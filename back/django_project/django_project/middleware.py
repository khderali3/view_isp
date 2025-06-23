

import threading
from .custom_app_utils import get_client_ip

_thread_locals = threading.local()

def get_current_request():
    return getattr(_thread_locals, 'request', None)

def get_current_user():
 
    request = get_current_request()
    if request and hasattr(request, 'user'):
        return request.user
    return None

def get_current_ip_address():
 

    request = get_current_request()
    if request:
        return get_client_ip(request)
    return None



class RequestMiddleware:
 
    def __init__(self, get_response):
 
        self.get_response = get_response

    def __call__(self, request):
        _thread_locals.request = request
        try:
            response = self.get_response(request)
        except Exception as e:
            # Ensure request is cleaned even if an exception happens
            _thread_locals.request = None
            
        finally:
            _thread_locals.request = None
        return response



