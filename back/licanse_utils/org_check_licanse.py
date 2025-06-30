import os
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'django_project')))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'django_project.settings')

import django
django.setup()

from get_machine_id import generate_machine_id
from django.core.cache import cache
import json
import base64
import hmac
import hashlib
from datetime import datetime, timedelta, timezone
from pathlib import Path
from Crypto.PublicKey import RSA
from Crypto.Signature import pkcs1_15
from Crypto.Hash import SHA256
import threading


class LicenseChecker:
    LAST_CHECK_FILE_INTERVAL = timedelta(hours=1)

    def __init__(
        self,
        app_name='ticketSystem',   # <-- app name here
        license_path='license.json',
        public_key_path='public.pem',
        last_check_path='last_license_check.json',
        hmac_secret=b'supersecretkey',
        cache_timeout=1,  # 1 hour by default to recheck licanse
    ):
        self.app_name = app_name
        self.license_path = Path(license_path)
        self.public_key_path = Path(public_key_path)
        self.last_check_path = Path(last_check_path)
        self._hmac_secret = hmac_secret
        self.cache_timeout = cache_timeout
        self._lock = threading.Lock()

        self._public_key = self._load_public_key()
        self._license_data, self._license_signature, self._license_json = self._load_license()
        self.machine_id_obj = generate_machine_id()

    @property
    def LICENSE_CACHE_KEY(self):
        return f"{self.app_name}:license_check_cache"

    @property
    def successful_license_check_cache_key(self):
        return f"{self.app_name}:license_valid_and_successful_last_check_cache"

    @property
    def LICENSE_FULL_INFO_CACHE_KEY(self):
        return f"{self.app_name}:license_full_info_cache"

    def _generate_hmac(self, data: bytes) -> str:
        return hmac.new(self._hmac_secret, data, hashlib.sha256).hexdigest()

    def _verify_hmac(self, data: bytes, signature: str) -> bool:
        return hmac.compare_digest(self._generate_hmac(data), signature)

    def _load_public_key(self):
        try:
            with open(self.public_key_path, 'rb') as f:
                return RSA.import_key(f.read())
        except Exception as e:
            raise RuntimeError(f"Failed to load public key: {e}")

    def _load_license(self):
        if not self.license_path.exists():
            raise FileNotFoundError(f"License file not found: {self.license_path}")

        with open(self.license_path, 'r') as f:
            package = json.load(f)

        license_data = package.get('license')
        signature_b64 = package.get('signature')
        if license_data is None or signature_b64 is None:
            raise ValueError("Invalid license file format")

        signature = base64.b64decode(signature_b64)
        license_json = json.dumps(license_data, sort_keys=True).encode('utf-8')
        return license_data, signature, license_json

    def _verify_signature(self) -> bool:
        try:
            h = SHA256.new(self._license_json)
            pkcs1_15.new(self._public_key).verify(h, self._license_signature)
            return True
        except (ValueError, TypeError):
            return False

    def _load_last_check_file(self):
        if not self.last_check_path.exists():
            return None
        try:
            with open(self.last_check_path, 'r') as f:
                wrapped = json.load(f)
            data = wrapped.get('data')
            sig = wrapped.get('hmac')
            if not data or not sig:
                return None
            json_bytes = json.dumps(data).encode('utf-8')
            if not self._verify_hmac(json_bytes, sig):
                return None
            data['timestamp'] = datetime.fromisoformat(data['timestamp'])
            return data
        except Exception:
            return None

    def _save_last_check_file(self, timestamp: datetime, is_valid: bool):
        data = {'timestamp': timestamp.isoformat(), 'is_valid': is_valid}
        try:
            json_bytes = json.dumps(data).encode('utf-8')
            signature = self._generate_hmac(json_bytes)
            wrapped = {'data': data, 'hmac': signature}
            tmp_path = self.last_check_path.with_suffix('.tmp')
            with open(tmp_path, 'w') as f:
                json.dump(wrapped, f)
            tmp_path.rename(self.last_check_path)
        except Exception as e:
            print(f"Warning: Failed to save last check file: {e}", file=sys.stderr)

    def _check_last_check_file(self):
        cached = cache.get(self.successful_license_check_cache_key)
        now = datetime.now(timezone.utc)

        if cached:
            cached_ts = datetime.fromisoformat(cached['timestamp'])
            if now - cached_ts < self.LAST_CHECK_FILE_INTERVAL:
                cached['timestamp'] = cached_ts
                return cached

        file_data = self._load_last_check_file()
        if file_data is None:
            file_data = {'timestamp': now, 'is_valid': True}

        cache.set(self.successful_license_check_cache_key, {
            'timestamp': file_data['timestamp'].isoformat(),
            'is_valid': file_data['is_valid']
        }, timeout=int(self.LAST_CHECK_FILE_INTERVAL.total_seconds()))
        return file_data

    def _build_license_response(self, is_valid, reason=None):
        return {
            'machine_id': self._license_data.get('machine_id'),
            'issued_at': self._license_data.get('issued_at'),
            'expires_at': self._license_data.get('expires_at'),
            'license_type': self._license_data.get('license_type'),
            'application': self._license_data.get('application'),
            'is_valid': is_valid,
            'reason': reason,
        }

 
    def _cache_license_result(self, now, license_response):
        cache.set(self.LICENSE_CACHE_KEY, {
            'checked_at': now.isoformat(),
            'license_data': license_response
        }, timeout=None)

        # 🔐 Save full license info (data + signature) to cache
        full_info = {
            'license_data': self._license_data,
            'signature': base64.b64encode(self._license_signature).decode(),
            'machine_id': self.machine_id_obj,
        }
        cache.set(self.LICENSE_FULL_INFO_CACHE_KEY, full_info, timeout=None)  # No timeout



    def check_license(self):
        with self._lock:
            now = datetime.now(timezone.utc)

            cached_result = cache.get(self.LICENSE_CACHE_KEY)

            # check server time changed from cache
            if cached_result:
                cached_time = datetime.fromisoformat(cached_result['checked_at'])
                if now - cached_time < timedelta(seconds=self.cache_timeout):
                    last_check = self._check_last_check_file()
                    if now < last_check['timestamp']:

                        license_response = self._build_license_response(False,
                              'System clock rollback detected - license invalidated',
                            )

                        self._cache_license_result(now, license_response)
                        return license_response
                    return cached_result['license_data']

            if not self._verify_signature():
                self._save_last_check_file(now, False)
                license_response = self._build_license_response(False,
                        'Invalid license signature',
                    )
                self._cache_license_result(now, license_response)
                return license_response

            try:
                expires_at = datetime.strptime(self._license_data['expires_at'], '%Y-%m-%dT%H:%M:%SZ').replace(tzinfo=timezone.utc)
                issued_at = datetime.strptime(self._license_data['issued_at'], '%Y-%m-%dT%H:%M:%SZ').replace(tzinfo=timezone.utc)
            except Exception:
                self._save_last_check_file(now, False)
                license_response = self._build_license_response(False,
                        'Invalid license date format'
                    )

                self._cache_license_result(now, license_response)
                return license_response

            if expires_at < now:
                self._save_last_check_file(now, False)

                license_response = self._build_license_response(False,
                       'License expired'
                    )
                self._cache_license_result(now, license_response)
                return license_response

            last_check = self._check_last_check_file()
            if now < last_check['timestamp']:
                self._save_last_check_file(now, False)
                license_response = self._build_license_response(False,
                       'System clock rollback detected - license invalidated'
                    )
                self._cache_license_result(now, license_response)
                return license_response

            if self._license_data['machine_id'] != self.machine_id_obj['machine_id']:
                self._save_last_check_file(now, False)

                license_response = self._build_license_response(False,
                       'machine_id not valid'
                    )

                self._cache_license_result(now, license_response)
                return license_response

            self._save_last_check_file(now, True)
 
            license_response = self._build_license_response(True)


            self._cache_license_result(now, license_response)

            cache.set(self.successful_license_check_cache_key, {
                'timestamp': now.isoformat(),
                'is_valid': True
            }, timeout=int(self.LAST_CHECK_FILE_INTERVAL.total_seconds()))

            return license_response


 
if __name__ == "__main__":
    start_time = datetime.now()
    print("License check started at:", start_time)

    checker = LicenseChecker()  # default app_name = "ticketSystem"
    result = checker.check_license()
    print("License check result:", result)
