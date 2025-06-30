from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.cache import cache

class LicenseView(APIView):
    def get(self, request):
        cache_key = "ticketSystem:license_check_cache"
        cached_data = cache.get(cache_key)

        if not cached_data:
            return Response(
                {"message": "License data not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        return Response(cached_data, status=status.HTTP_200_OK)
