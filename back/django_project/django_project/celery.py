import os
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'django_project.settings')

app = Celery('django_project')

app.config_from_object('django.conf:settings', namespace='CELERY')

# Auto-discover tasks in installed apps
app.autodiscover_tasks()



from django.conf import settings

# @app.task(bind=True)
# def debug_task(self):
#     print(f'Request: {self.request!r}')


if settings.DEBUG:
    @app.task(bind=True)
    def debug_task(self):
        print(f'Debug Task Request: {self.request!r}')


from celery.schedules import crontab

# app.conf.beat_schedule = {
#     'check-license-every-hour': {
#         'task': 'ticketSystemStaffApp.tasks.check_license_task',
#         'schedule': crontab(minute=0, hour='*'),  # every hour at minute 0
#     },
# }



app.conf.beat_schedule = {
    'check-license-every-minute': {
        'task': 'ticketSystemStaffApp.tasks.check_license_task',
        'schedule': crontab(),  # equivalent to crontab(minute='*')
    },
}