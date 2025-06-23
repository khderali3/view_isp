import requests
from django.conf import settings
 

def verify_recaptcha(captcha_response):
    secret_key = settings.GOOGLE_RECAPCHA_SECRET_KEY  # Replace with your secret key
    payload = {
        'secret': secret_key,
        'response': captcha_response
    }
    verify_url = settings.GOOGLE_RECAPCHA_CHECK_URL
    response = requests.post(verify_url, data=payload)
    result = response.json()

    return result.get("success", False)
