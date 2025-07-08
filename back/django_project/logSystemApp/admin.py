from django.contrib import admin

# Register your models here.

from .models import Log, ErrorLog


admin.site.register(Log)



@admin.register(ErrorLog)  # <-- this is the decorator form
class ErrorLogAdmin(admin.ModelAdmin):
    list_display = ['timestamp']
    readonly_fields = ['timestamp']
