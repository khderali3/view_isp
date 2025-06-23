from django.apps import AppConfig


class LogsystemappConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'logSystemApp'

    def ready(self):
        import logSystemApp.signals