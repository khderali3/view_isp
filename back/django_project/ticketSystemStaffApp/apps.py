from django.apps import AppConfig

from .extra_modules.license_check.check_licanse import LicenseChecker
from django.core.exceptions import ImproperlyConfigured
from django.core.cache import cache

  






class TicketsystemstaffappConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'ticketSystemStaffApp'


    def ready(self):
        # Generate installation ID with dynamic app name
        from ticketSystemStaffApp.extra_modules.license_check.utils import get_or_create_installation_info
        installation_info = get_or_create_installation_info("ticketSystem")
        # print(f"Installation info,  App Name Id is : {installation_info.get('app_name')}, app installation ID is: {installation_info.get('installation_id')}")
        # end create app id
 

        cache_key = "ticketSystem:license_check_cache"
        try:
            checker = LicenseChecker()

            result = checker.check_license()
            # print(result)

            if not result:
                raise ImproperlyConfigured("License check failed: No result returned.")
            
        except Exception as e:
            # print(f"❌ License check error: {e}")
            raise  # re-raise to prevent app startup
        try:
            cached = cache.get(cache_key)
            # print('the cached key resule is :', cached)
        except Exception as e:
            # Redis connection error or cache backend error
            raise ImproperlyConfigured(f"License check error: Redis cache not accessible: {e}")

        if not cached:
            raise ImproperlyConfigured("License check error: No license data cached in Redis.")

        license_data = cached.get('license_data')
        if not license_data:
            raise ImproperlyConfigured("License check error: License data missing in cache.")
