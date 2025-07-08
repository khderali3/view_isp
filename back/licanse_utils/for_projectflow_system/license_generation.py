import json
import base64
from datetime import datetime, timedelta, timezone
from Crypto.Signature import pkcs1_15
from Crypto.Hash import SHA256
from Crypto.PublicKey import RSA
import uuid
import random

# Define license period here (e.g., 104 weeks = 2 years)
license_period = timedelta(days=365)

def load_private_key(path='private.pem'):
    with open(path, 'rb') as f:
        return RSA.import_key(f.read())

def generate_license(device_app_fingerprint,app_Name_id, application,  app_installation_id , issued_to , valid_days=365, license_type='standard'):
    now_utc = datetime.now(timezone.utc)  # timezone-aware UTC now
    expires_utc = now_utc + license_period  # Use license_period variable here

    random_node = random.getrandbits(48)
    license_id = str(uuid.uuid1(node=random_node))  # Generate unique license ID

    # license_id = str(uuid.uuid1())  # Generate unique license ID

    # License data with ISO 8601 UTC timestamps



    license_data = {
        'license_id': license_id,
        'device_app_fingerprint': device_app_fingerprint,
        'issued_at': now_utc.strftime('%Y-%m-%dT%H:%M:%SZ'),
        'expires_at': expires_utc.strftime('%Y-%m-%dT%H:%M:%SZ'),
        'license_type': license_type,
        'application' : application,
        'app_Name_id' : app_Name_id,
        'app_installation_id' : app_installation_id,
        'issued_to' : issued_to
    }

    # Specific test dates (UTC)
    # issued_at_test = datetime(2024, 1, 1, 12, 0, 0, tzinfo=timezone.utc)
    # expires_at_test = datetime(2025, 1, 1, 12, 0, 0, tzinfo=timezone.utc)

    # license_data = {
    #     'machine_id': machine_id,
    #     'issued_at': issued_at_test.strftime('%Y-%m-%dT%H:%M:%SZ'),
    #     'expires_at': expires_at_test.strftime('%Y-%m-%dT%H:%M:%SZ'),
    #     'license_type': license_type,
    #     'application': "CloudTechSKy ProjectFlow System",
    #     'app_installation_id' : app_installation_id,
    #     'issued_to' : issued_to
 
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
    device_app_fingerprint = 'dcc5cb466ed1dc76f04cf6c528d7c98b76c2d2638610f359b2b78e60b11ee88e'
    for_app_installation_id  = "b23e90b7-78bc-4972-9cca-947b3e47f4dc"
    for_application = "CloudTechSKy ProjectFlow System"
    for_app_Name_id = "projectFlowApp" 
    for_issued_to = "CloudTech Sky Company"
    license_package = generate_license(device_app_fingerprint, for_app_Name_id, for_application, for_app_installation_id, for_issued_to, valid_days=365, license_type='pro')
    save_license_file(license_package)
