import logging
from .middleware import get_current_request, get_current_user, get_current_ip_address

import logging
import traceback as tb



class RequestLogFilter(logging.Filter):
    def filter(self, record):
        request = get_current_request()
        user = get_current_user()
        ip = get_current_ip_address()

        record.request_method = getattr(request, 'method', 'N/A')
        record.request_path = getattr(request, 'path', 'N/A')
        record.request_user = user if user and user.is_authenticated else None  # <--- keep object
        record.client_ip = ip or 'N/A'

        # Optional: add user_display for logs
        record.user_display = str(user) if user and user.is_authenticated else 'Anonymous'

        return True

from django.utils import timezone


class DBErrorLogHandler(logging.Handler):
    def emit(self, record):
        try:
            from logSystemApp.models import ErrorLog  # Use your app's correct import path


            msg = self.format(record)
 
            # Pseudo-code: Check for duplicate
            recent_logs = ErrorLog.objects.filter(message=msg).order_by('-timestamp')
            if recent_logs.exists():
                last_log = recent_logs.first()
                time_diff = timezone.now() - last_log.timestamp
                if time_diff.total_seconds() < 5:  # less than 60 seconds ago
                    return  # skip saving duplicate


            # Optional imports to avoid circular import errors
            user = getattr(record, 'request_user', None)
            ip = getattr(record, 'client_ip', None)

            ErrorLog.objects.create(
                level=record.levelname,
                request_method=getattr(record, 'request_method', None),
                request_path=getattr(record, 'request_path', None),
                message=record.getMessage(),
                traceback=getattr(record, 'exc_text', None) or tb.format_exc(),
                user=user if hasattr(user, 'pk') else None,
                ip_address=ip if isinstance(ip, str) else None
            )
        except Exception:
            pass  # Never raise logging errors
