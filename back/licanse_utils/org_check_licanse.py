import os
import sys

 
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'django_project')))

# Set the Django settings module (dot notation)
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
from django.core.cache import cache
import threading

class LicenseChecker:
    """
    License checker with Redis cache for hourly validation,
    and a file-based last_check (every 24h) for detecting clock rollback.
    """

    LAST_CHECK_FILE_INTERVAL = timedelta(hours=24)
    LICENSE_CACHE_KEY = "license_check_cache"
    LAST_CHECK_CACHE_KEY = "license_last_check_cache"

    def __init__(
        self,
        license_path='license.json',
        public_key_path='public.pem',
        last_check_path='last_license_check.json',
        hmac_secret=b'supersecretkey',
        # cache_timeout=3600,  # seconds, 1 hour for license cache
        cache_timeout=1,  # seconds, 1 hour for license cache
    ):
        self.license_path = Path(license_path)
        self.public_key_path = Path(public_key_path)
        self.last_check_path = Path(last_check_path)
        self._hmac_secret = hmac_secret
        self.cache_timeout = cache_timeout
        self._lock = threading.Lock()

        # Load once at init
        self._public_key = self._load_public_key()
        self._license_data, self._license_signature, self._license_json = self._load_license()
        self.machine_id_obj = generate_machine_id() 
  

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
        """
        Load and verify last check from file.
        Returns dict with keys: timestamp(datetime), is_valid(bool), or None if invalid.
        """
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
        except Exception:
            pass  # ignore errors silently

    def _check_last_check_file(self):
        """
        Checks if we should reload last_check from file.
        Uses Redis cache to store last check from file for 24h.
        Returns cached last check data or reloads from file.
        """
        cached = cache.get(self.LAST_CHECK_CACHE_KEY)
        now = datetime.now(timezone.utc)

        if cached:
            # cached = {'timestamp': str, 'is_valid': bool}
            cached_ts = datetime.fromisoformat(cached['timestamp'])
            if now - cached_ts < self.LAST_CHECK_FILE_INTERVAL:
                cached['timestamp'] = cached_ts
                return cached

        # Reload from file
        file_data = self._load_last_check_file()
        if file_data is None:
            # No valid last check file, create new record with now and valid=True (optimistic)
            file_data = {'timestamp': now, 'is_valid': True}

        # Cache it in Redis for 24h
        cache.set(self.LAST_CHECK_CACHE_KEY, {'timestamp': file_data['timestamp'].isoformat(), 'is_valid': file_data['is_valid']}, timeout=int(self.LAST_CHECK_FILE_INTERVAL.total_seconds()))
        return file_data

    def check_license(self):
        """
        Main license check, using Redis cache for hourly license validity,
        and file-based last_check for 24h clock rollback detection.
        """
        with self._lock:
            now = datetime.now(timezone.utc)

            # First check Redis cache for license status (valid + last check time)
            cached_result = cache.get(self.LICENSE_CACHE_KEY)
            if cached_result:
                cached_time = datetime.fromisoformat(cached_result['checked_at'])
                # If within 1 hour cache, return cached result directly
                if now - cached_time < timedelta(seconds=self.cache_timeout):
                    # Check for clock rollback by comparing with last_check file data
                    last_check = self._check_last_check_file()
                    if now < last_check['timestamp']:
                        # Clock rollback detected
                        return {
                            'is_valid': False,
                            'reason': 'System clock rollback detected - license invalidated',
                            **{k: None for k in ('machine_id','issued_at','expires_at','license_type','application')}
                        }
                    # Return cached license result
                    return cached_result['license_data']

            # No valid cache or expired - do full check now

            # Verify license signature
            if not self._verify_signature():
                # Save last check file as invalid now
                self._save_last_check_file(now, False)
                cache.set(self.LICENSE_CACHE_KEY, {
                    'checked_at': now.isoformat(),
                    'license_data': {
                        **{k: None for k in ('machine_id','issued_at','expires_at','license_type','application')},
                        'is_valid': False,
                        'reason': 'Invalid license signature'
                    }
                }, timeout=self.cache_timeout)
                return cache.get(self.LICENSE_CACHE_KEY)['license_data']

            # Check expiration dates
            try:
                expires_at = datetime.strptime(self._license_data['expires_at'], '%Y-%m-%dT%H:%M:%SZ').replace(tzinfo=timezone.utc)
                issued_at = datetime.strptime(self._license_data['issued_at'], '%Y-%m-%dT%H:%M:%SZ').replace(tzinfo=timezone.utc)
            except Exception:
                self._save_last_check_file(now, False)
                return {
                    **{k: None for k in ('machine_id','issued_at','expires_at','license_type','application')},
                    'is_valid': False,
                    'reason': 'Invalid license date format'
                }

            if expires_at < now:
                self._save_last_check_file(now, False)
                return {
                    **{k: None for k in ('machine_id','issued_at','expires_at','license_type','application')},
                    'is_valid': False,
                    'reason': 'License expired'
                }

            # Check clock rollback with last_check file
            last_check = self._check_last_check_file()
            if now < last_check['timestamp']:
                return {
                    **{k: None for k in ('machine_id','issued_at','expires_at','license_type','application')},
                    'is_valid': False,
                    'reason': 'System clock rollback detected - license invalidated'
                }


            # add by khder
            if self._license_data['machine_id'] != self.machine_id_obj['machine_id']:
                return {
                    **{k: None for k in ('machine_id','issued_at','expires_at','license_type','application')},
                    'is_valid': False,
                    'reason': 'machine_id not valid'
                }

            # end add by khder


 

            # License is valid, save last check file and Redis cache
            self._save_last_check_file(now, True)

            license_response = {
                **self._license_data,
                'is_valid': True,
                'reason': None,
            }

            cache.set(self.LICENSE_CACHE_KEY, {
                'checked_at': now.isoformat(),
                'license_data': license_response
            }, timeout=self.cache_timeout)

            # Also update last check Redis cache
            cache.set(self.LAST_CHECK_CACHE_KEY, {'timestamp': now.isoformat(), 'is_valid': True}, timeout=int(self.LAST_CHECK_FILE_INTERVAL.total_seconds()))

            return license_response

 

from datetime import datetime

if __name__ == "__main__":
    start_time = datetime.now()
    print("License check started at:", start_time)

    checker = LicenseChecker()
    result = checker.check_license()
    print(result)

    end_time = datetime.now()
    print("License check ended at:", end_time)

    duration = end_time - start_time
    print("Duration:", duration)
