
from rest_framework.permissions import BasePermission
from rest_framework.exceptions import PermissionDenied


from functools import wraps
from django.core.cache import cache
from rest_framework.response import Response
from rest_framework import status

def license_required(view_method):
    @wraps(view_method)
    def _wrapped(self, request, *args, **kwargs):
        cache_key = "ticketSystem:license_check_cache"
        try:
            cached = cache.get(cache_key)
            if not cached:
                return Response({"message": "License check failed: no cached license data."}, status=status.HTTP_403_FORBIDDEN)

            license_data = cached.get('license_data')
            if not license_data:
                return Response({"message": "License check failed: license data missing."}, status=status.HTTP_403_FORBIDDEN)

            if not license_data.get('is_valid', False):
                reason = license_data.get('reason', 'License is invalid or expired.')
                return Response({"message": f"License invalid: {reason}"}, status=status.HTTP_403_FORBIDDEN)

        except Exception:
            return Response({"message": "License check failed: unable to access caLicense info"}, status=status.HTTP_403_FORBIDDEN)

        # License is valid, proceed to the view method
        return view_method(self, request, *args, **kwargs)

    return _wrapped







class IsStaffOrSuperUser(BasePermission):
    def has_permission(self, request, view):
        return request.user and (request.user.is_staff or request.user.is_superuser)
    

class HasUserManagementPermission(BasePermission):
    def has_permission(self, request, view):
        # Check if user is a superuser or has the `user_management` permission
        if request.user.is_superuser or request.user.has_perm('usersAuthApp.user_managment'):
            return True

        # If permission is denied, raise the `PermissionDenied` exception with a custom message
        raise PermissionDenied(detail="Permission denied for this operation.")
    

class HasSiteManagementPermission(BasePermission):
    def has_permission(self, request, view):
        # Check if user is a superuser or has the `site_managment` permission
        if request.user.is_superuser or request.user.has_perm('usersAuthApp.site_managment'):
            return True

        # If permission is denied, raise the `PermissionDenied` exception with a custom message
        raise PermissionDenied(detail="Permission denied for this operation.")