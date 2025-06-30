from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.permissions import BasePermission
from django.conf import settings




from functools import wraps
from django.core.cache import cache
from rest_framework.response import Response
from rest_framework import status



import os
import json
import uuid

# def get_or_create_installation_info(app_name):
#     # Path: same directory as this utils file (i.e., projectFlowApp/)
#     current_dir = os.path.dirname(os.path.abspath(__file__))
#     install_file_path = os.path.join(current_dir, 'install.json')

#     if os.path.exists(install_file_path):
#         try:
#             with open(install_file_path, 'r') as f:
#                 data = json.load(f)
#                 return data
#         except Exception:
#             pass  # fall through to regenerate

#     # Generate new ID and write it
#     installation_id = str(uuid.uuid4())
#     data = {
#         'installation_id': installation_id,
#         'app_name': app_name,
#     }

#     with open(install_file_path, 'w') as f:
#         json.dump(data, f, indent=4)

#     return installation_id






def get_client_ip(request):
    try:
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0].strip()
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip or None
    except :
        return None
    





class IsStaffOrSuperUser(BasePermission):
    def has_permission(self, request, view):
        return request.user and (request.user.is_staff or request.user.is_superuser)




class MyCustomPagination(PageNumberPagination):
    page_size = getattr(settings, 'PROJECT_FLOW_PAGINATION_PAGE_SIZE', 30)
    page_size_query_param = 'page_size'
               
    def get_current_page_url(self):
        if not self.request:
            return None
        current_page = self.page.number
        request = self.request
        url = request.build_absolute_uri(request.path)
        query_params = request.query_params.copy()
        query_params[self.page_query_param] = current_page

        return f"{url}?{query_params.urlencode()}"

    def get_paginated_response(self, data):
        return Response({
        'page_size': self.page_size,
        'total_objects': self.page.paginator.count,
        'total_objects_in_current_page': len(data),
        'total_pages': self.page.paginator.num_pages,
        'current_page_number': self.page.number,
        'next_page_url': self.get_next_link(),
        'previous_page_url': self.get_previous_link(),
        'current_page_url': self.get_current_page_url(),

        'results': data,
        })
    
