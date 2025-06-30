import json
import base64
from datetime import datetime, timedelta, timezone
from Crypto.Signature import pkcs1_15
from Crypto.Hash import SHA256
from Crypto.PublicKey import RSA

# Define license period here (e.g., 104 weeks = 2 years)
license_period = timedelta(days=365)

def load_private_key(path='private.pem'):
    with open(path, 'rb') as f:
        return RSA.import_key(f.read())

def generate_license(machine_id, valid_days=365, license_type='standard'):
    now_utc = datetime.now(timezone.utc)  # timezone-aware UTC now
    expires_utc = now_utc + license_period  # Use license_period variable here

    # License data with ISO 8601 UTC timestamps
    license_data = {
        'machine_id': machine_id,
        'issued_at': now_utc.strftime('%Y-%m-%dT%H:%M:%SZ'),
        'expires_at': expires_utc.strftime('%Y-%m-%dT%H:%M:%SZ'),
        'license_type': license_type,
        'application' : "CloudTechSKy Ticket System"
    }

    # Specific test dates (UTC)
    # issued_at_test = datetime(2024, 1, 1, 12, 0, 0, tzinfo=timezone.utc)
    # expires_at_test = datetime(2025, 1, 1, 12, 0, 0, tzinfo=timezone.utc)

    # license_data = {
    #     'machine_id': machine_id,
    #     'issued_at': issued_at_test.strftime('%Y-%m-%dT%H:%M:%SZ'),
    #     'expires_at': expires_at_test.strftime('%Y-%m-%dT%H:%M:%SZ'),
    #     'license_type': license_type,
    #     'application': "CloudTechSKy Ticket System"
    # }


    # Convert license data to JSON string (sorted keys for consistent signature)
    license_json = json.dumps(license_data, sort_keys=True).encode('utf-8')

    # Load private key
    private_key = load_private_key()

    # Hash the license JSON
    h = SHA256.new(license_json)

    # Sign the hash with the private key
    signature = pkcs1_15.new(private_key).sign(h)

    # Encode signature as base64 for safe transport
    signature_b64 = base64.b64encode(signature).decode('utf-8')

    # Create final license object with signature
    license_package = {
        'license': license_data,
        'signature': signature_b64
    }

    return license_package

def save_license_file(license_package, filename='license.json'):
    with open(filename, 'w') as f:
        json.dump(license_package, f, indent=4)
    print(f'License saved to {filename}')

if __name__ == '__main__':
    # Example usage: replace with actual client machine_id
    example_machine_id = '4285732ac0d3ffc340847c4fbde6f1a0bd58d4addf009d5083191bb1633ffe5c'
    license_package = generate_license(example_machine_id, valid_days=365, license_type='pro')
    save_license_file(license_package)
