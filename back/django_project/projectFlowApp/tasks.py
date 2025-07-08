from celery import shared_task
from .extra_modules.license_check.check_licanse import LicenseChecker
 


@shared_task
def check_license_task():
    checker = LicenseChecker()
    result = checker.check_license()
    # Optional: log or save the result somewhere
    return result



 