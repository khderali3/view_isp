
from rest_framework.permissions import BasePermission
from rest_framework.exceptions import PermissionDenied


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