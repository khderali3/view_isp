


 
 
from .models import TicketFiles, TicketReplyFiles


import os
from django.db.models.signals import post_delete
from django.dispatch import receiver
from .models import TicketFiles, TicketReplyFiles

def delete_file_from_storage(file_field):
    """Helper to delete file if it exists in storage."""
    if file_field and file_field.name and os.path.isfile(file_field.path):
        try:
            os.remove(file_field.path)
        except :
            pass

@receiver(post_delete, sender=TicketFiles)
def delete_ticket_file_on_delete(sender, instance, **kwargs):
    delete_file_from_storage(instance.ticket_file_ticket_file)

@receiver(post_delete, sender=TicketReplyFiles)
def delete_ticket_reply_file_on_delete(sender, instance, **kwargs):
    delete_file_from_storage(instance.ticket_replay_file)





