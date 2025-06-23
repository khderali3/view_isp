from django.contrib import admin

from .models import Department, Ticket, TicketFiles, TicketReplay, TicketReplyFiles
# Register your models here.

admin.site.register(Department)
admin.site.register(Ticket)
admin.site.register(TicketFiles)
admin.site.register(TicketReplay)
admin.site.register(TicketReplyFiles)


