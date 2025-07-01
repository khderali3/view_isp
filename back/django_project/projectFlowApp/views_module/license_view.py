from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.cache import cache


from projectFlowApp.extra_modules.license_check.check_licanse import LicenseChecker


class LicenseView(APIView):
    def get(self, request):


        try:
            checker = LicenseChecker()
            checker.check_license()
        except :
            pass
 

        cache_key = "projectflow:license_check_cache"
        cached_data = cache.get(cache_key)

        if not cached_data:
            return Response(
                {"message": "License data not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        return Response(cached_data, status=status.HTTP_200_OK)
