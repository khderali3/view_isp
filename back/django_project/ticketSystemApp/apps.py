from django.apps import AppConfig


class TicketsystemappConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'ticketSystemApp'
    
    def ready(self): 
        import ticketSystemApp.signals