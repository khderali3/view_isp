from django.apps import AppConfig


class ProjectflowappConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'projectFlowApp'

    def ready(self): 
        import projectFlowApp.models.signals

