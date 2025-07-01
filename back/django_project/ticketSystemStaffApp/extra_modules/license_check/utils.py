import os
import uuid
import importlib.util


from functools import wraps
from django.core.cache import cache
from rest_framework.response import Response
from rest_framework import status

 
import glob

def get_or_create_installation_info(app_name):
    current_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Try to find compiled install module first (.so or .pyd)
    compiled_modules = glob.glob(os.path.join(current_dir, 'install.*.so')) + glob.glob(os.path.join(current_dir, 'install.*.pyd'))
    
    if compiled_modules:
        install_file_path = compiled_modules[0]
    else:
        # fallback to .py file
        install_file_path = os.path.join(current_dir, 'install.py')

    if os.path.exists(install_file_path):
        try:
            spec = importlib.util.spec_from_file_location("install", install_file_path)
            install = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(install)
            return {
                'installation_id': install.INSTALLATION_ID,
                'app_name': install.APP_NAME
            }
        except Exception:
            pass  # Fall through to regenerate

    # Generate new values and write them to install.py
    installation_id = str(uuid.uuid4())
    content = (
        f'# Auto-generated installation info\n'
        f'INSTALLATION_ID = "{installation_id}"\n'
        f'APP_NAME = "{app_name}"\n'
    )

    with open(os.path.join(current_dir, 'install.py'), 'w') as f:
        f.write(content)

    return {
        'installation_id': installation_id,
        'app_name': app_name
    }








# def get_or_create_installation_info(app_name):
#     current_dir = os.path.dirname(os.path.abspath(__file__))
#     install_file_path = os.path.join(current_dir, 'install.py')

#     if os.path.exists(install_file_path):
#         try:
#             spec = importlib.util.spec_from_file_location("install", install_file_path)
#             install = importlib.util.module_from_spec(spec)
#             spec.loader.exec_module(install)
#             return {
#                 'installation_id': install.INSTALLATION_ID,
#                 'app_name': install.APP_NAME
#             }
#         except Exception:
#             pass  # Fall through to regenerate

#     # Generate new values and write them to install.py
#     installation_id = str(uuid.uuid4())
#     content = (
#         f'# Auto-generated installation info\n'
#         f'INSTALLATION_ID = "{installation_id}"\n'
#         f'APP_NAME = "{app_name}"\n'
#     )

#     with open(install_file_path, 'w') as f:
#         f.write(content)

#     return {
#         'installation_id': installation_id,
#         'app_name': app_name
#     }




def license_required(view_method):
    @wraps(view_method)
    def _wrapped(self, request, *args, **kwargs):
        cache_key = "projectflow:license_check_cache"
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

