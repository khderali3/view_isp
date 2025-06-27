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
    """
    Professional license checker to be used inside DRF views or anywhere.
    It verifies the license signature, expiration,
    caches last check result in a file with HMAC signature,
    prevents clock rollback manipulation,
    and supports configurable check intervals.
    """

    def __init__(
        self,
        license_path: str = 'license.json',
        public_key_path: str = 'public.pem',
        last_check_path: str = 'last_license_check.json',
        check_interval_seconds: int = 3600,  # 1 hour cache validity
        hmac_secret: bytes = b'supersecretkey'  # secret key for HMAC signing cache
    ):
        self.license_path = Path(license_path)
        self.public_key_path = Path(public_key_path)
        self.last_check_path = Path(last_check_path)
        self.check_interval = timedelta(seconds=check_interval_seconds)
        self._lock = threading.Lock()  # thread safety if needed
        self._public_key = self._load_public_key()
        self._hmac_secret = hmac_secret
        self._last_check_data = self._load_last_check()

    def _generate_hmac(self, data: bytes) -> str:
        return hmac.new(self._hmac_secret, data, hashlib.sha256).hexdigest()

    def _verify_hmac(self, data: bytes, signature: str) -> bool:
        expected = self._generate_hmac(data)
        return hmac.compare_digest(expected, signature)

    def _load_public_key(self):
        try:
            with open(self.public_key_path, 'rb') as f:
                return RSA.import_key(f.read())
        except Exception as e:
            raise RuntimeError(f"Failed to load public key: {e}")

    def _load_last_check(self):
        if not self.last_check_path.exists():
            return None
        try:
            with open(self.last_check_path, 'r') as f:
                wrapped = json.load(f)
            data = wrapped.get('data')
            signature = wrapped.get('hmac')
            if data is None or signature is None:
                return None
            json_bytes = json.dumps(data).encode('utf-8')
            if not self._verify_hmac(json_bytes, signature):
                # HMAC mismatch: data tampered
                return None
            data['timestamp'] = datetime.fromisoformat(data['timestamp'])
            return data
        except Exception:
            # Corrupted file or parsing error — ignore and treat as no cache
            return None

    def _save_last_check(self, timestamp: datetime, is_valid: bool):
        data = {
            'timestamp': timestamp.isoformat(),
            'is_valid': is_valid,
        }
        try:
            json_bytes = json.dumps(data).encode('utf-8')
            signature = self._generate_hmac(json_bytes)
            wrapped = {
                'data': data,
                'hmac': signature,
            }
            temp_file = self.last_check_path.with_suffix('.tmp')
            with open(temp_file, 'w') as f:
                json.dump(wrapped, f)
            temp_file.rename(self.last_check_path)
        except Exception:
            # Log error in real app — here just ignore to not block
            pass

    def _load_license(self):
        if not self.license_path.exists():
            raise FileNotFoundError(f"License file not found: {self.license_path}")

        with open(self.license_path, 'r') as f:
            license_package = json.load(f)

        license_data = license_package.get('license')
        signature_b64 = license_package.get('signature')

        if license_data is None or signature_b64 is None:
            raise ValueError("Invalid license file format")

        signature = base64.b64decode(signature_b64)

        # JSON dump sorted keys for exact signature matching
        license_json = json.dumps(license_data, sort_keys=True).encode('utf-8')

        return license_data, signature, license_json

    def _verify_signature(self, license_json: bytes, signature: bytes) -> bool:
        try:
            h = SHA256.new(license_json)
            pkcs1_15.new(self._public_key).verify(h, signature)
            return True
        except (ValueError, TypeError):
            return False

    def check_license(self):
        """
        Check license validity with caching, HMAC verification, and time rollback protection.

        Returns:
            dict: {
                'machine_id': str,
                'issued_at': str,
                'expires_at': str,
                'license_type': str,
                'application': str,
                'is_valid': bool,
                'reason': Optional[str],  # if invalid, reason why
            }
        """

        with self._lock:
            now = datetime.now(timezone.utc)

            # Use cache if available and not expired
            if self._last_check_data:
                last_time = self._last_check_data['timestamp']
                last_valid = self._last_check_data['is_valid']

                # If system clock moved backwards, invalidate license immediately
                if now < last_time:
                    return {
                        'machine_id': None,
                        'issued_at': None,
                        'expires_at': None,
                        'license_type': None,
                        'application': None,
                        'is_valid': False,
                        'reason': 'System clock rollback detected - license invalidated',
                    }

                # Return cached result if within check interval
                if now - last_time < self.check_interval:
                    # Try to return cached license info if available (load license to get fields)
                    try:
                        license_data, _, _ = self._load_license()
                        license_data['is_valid'] = last_valid
                        license_data['reason'] = None if last_valid else 'Cached invalid license'
                        return license_data
                    except Exception:
                        # fallback if license file corrupted/unavailable
                        return {
                            'machine_id': None,
                            'issued_at': None,
                            'expires_at': None,
                            'license_type': None,
                            'application': None,
                            'is_valid': last_valid,
                            'reason': 'Cached license status with error loading license data',
                        }

            # Else: do full check
            try:
                license_data, signature, license_json = self._load_license()
                print('this is full check')
            except Exception as e:
                # Save last check as invalid now
                self._save_last_check(now, False)
                return {
                    'machine_id': None,
                    'issued_at': None,
                    'expires_at': None,
                    'license_type': None,
                    'application': None,
                    'is_valid': False,
                    'reason': f'Failed to load license: {e}'
                }

            # Verify signature
            if not self._verify_signature(license_json, signature):
                self._save_last_check(now, False)
                license_data['is_valid'] = False
                license_data['reason'] = 'Invalid license signature'
                return license_data

            # Parse dates for expiration check
            try:
                expires_at = datetime.strptime(license_data['expires_at'], '%Y-%m-%dT%H:%M:%SZ').replace(tzinfo=timezone.utc)
                issued_at = datetime.strptime(license_data['issued_at'], '%Y-%m-%dT%H:%M:%SZ').replace(tzinfo=timezone.utc)
            except Exception:
                self._save_last_check(now, False)
                license_data['is_valid'] = False
                license_data['reason'] = 'Invalid license date format'
                return license_data

            if expires_at < now:
                self._save_last_check(now, False)
                license_data['is_valid'] = False
                license_data['reason'] = 'License expired'
                return license_data

            # License is valid
            self._save_last_check(now, True)
            license_data['is_valid'] = True
            license_data['reason'] = None
            return license_data


if __name__ == "__main__":
    checker = LicenseChecker()
    result = checker.check_license()
    print(result)
