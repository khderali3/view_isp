# from django.apps import AppConfig


# class LogsystemappConfig(AppConfig):
#     default_auto_field = 'django.db.models.BigAutoField'
#     name = 'logSystemApp'

#     def ready(self):
#         import logSystemApp.signals


from django.apps import AppConfig
import sys

class LogSystemAppConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'logSystemApp'

    def ready(self):
        if 'migrate' not in sys.argv:
             import logSystemApp.signals