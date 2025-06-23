from django.db import models

from django.utils.text import slugify
from datetime import datetime
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from os.path  import basename

# Create your models here.
User = get_user_model()

def validate_file_or_image(value):
    if not value.name.endswith(('.png', '.jpg', '.jpeg', '.gif', '.pdf', '.docx')):
        raise ValidationError("Only image files (.png, .jpg, .jpeg, .gif) and document files (.pdf, .docx) are allowed.")




class Department(models.Model):
    department_name = models.CharField(max_length=255, unique=True)
    department_name_ar = models.CharField(max_length=255,   unique=True)

    def __str__(self):
        return f"{self.department_name}"


class Ticket(models.Model):
    ticket_status_options = [
        ('open', 'open'),
        ('wait_customer_reply', 'wait_customer_reply'),
        ('replied_by_staff', 'replied_by_staff'),
        ('replied_by_customer', 'replied_by_customer'),
        ('solved', 'solved'),
    ]
    ticket_user = models.ForeignKey(User, related_name='ticket_user_related_name', on_delete=models.PROTECT, blank=True, null=True)
    ticket_department = models.ForeignKey('Department', related_name='ticket_department_related_name', on_delete=models.SET_NULL, blank=True, null=True)
    ticket_subject = models.CharField(max_length=50, db_index=True, verbose_name="ticket subject")
    ticket_body = models.TextField(verbose_name="ticket body")
    ticket_assigned_to = models.ForeignKey(User, related_name='Assigned', on_delete=models.PROTECT, blank=True, null=True)
    ticket_status = models.CharField(max_length=30, choices=ticket_status_options, default='open', db_index=True)
    ticket_created_by = models.ForeignKey(User, related_name='ticket_user_created_by_related_name',on_delete=models.CASCADE, blank=True, null=True)
    ticket_closed_by = models.ForeignKey(User, related_name='ticket_user_closed_by_related_name', on_delete=models.CASCADE, blank=True, null=True)
    ticket_slog = models.SlugField(max_length=100, blank=True, null=True, db_index=True, unique=True)
    ticket_created_date = models.DateTimeField(auto_now_add=True)
    ticket_updated_date = models.DateTimeField(auto_now=True)
    ticket_created_ip_address = models.GenericIPAddressField(null=True, blank=True)  # Add this line to store the IP address



    def save(self , *args , **kwargs):
        if not self.ticket_slog:
            time_now = datetime.now().strftime('%Y-%m-%d_%H:%M:%S')
            data_to_slug = f"{time_now}_{self.ticket_subject}"
            self.ticket_slog = slugify(data_to_slug)
        super(Ticket , self).save(*args, **kwargs)


    class Meta:
        ordering = ('-id',)

    def __str__(self):
        return f"{self.id},{self.ticket_user}, {self.ticket_status}, {self.ticket_subject}"



class TicketFiles(models.Model):
    ticket_file_ticket = models.ForeignKey(Ticket, related_name='ticket_files_ticket_related_name', on_delete=models.CASCADE, blank=True, null=True)
    ticket_file_ticket_file = models.FileField(upload_to='ticket/ticket_files/', validators=[validate_file_or_image])
    ticket_file_name = models.CharField(max_length=255, editable=False, null=True, blank=True)
    ticket_file_created_data = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if self.ticket_file_ticket_file :
            self.ticket_file_name = basename(self.ticket_file_ticket_file.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.id}, {self.ticket_file_name}"




class TicketReplay(models.Model):

    ticket_replay_ticket = models.ForeignKey(Ticket, related_name='ticket_replay_ticket_related_name', on_delete=models.CASCADE, blank=True, null=True)
    ticket_replay_from = models.ForeignKey(User, related_name='ticket_replay_from_user_related_name', on_delete=models.PROTECT, blank=True, null=True)
    ticket_replay_body = models.TextField(verbose_name="ticket reply body")
    ticket_replay_created_date = models.DateTimeField(auto_now_add=True)
    ticket_replay_updated_date = models.DateTimeField(auto_now=True)
    ticket_replay_created_ip_address = models.GenericIPAddressField(null=True, blank=True)  # Add this line to store the IP address

    class Meta:
        ordering = ('id',)

    def __str__(self):
        return f"{self.id},{self.ticket_replay_ticket}, {self.ticket_replay_from}"


class TicketReplyFiles(models.Model):
    ticket_replay_file_ticket_replay = models.ForeignKey(TicketReplay, related_name='ticket_replay_files_ticket_replay_related_name', on_delete=models.CASCADE, blank=True, null=True)
    ticket_replay_file = models.FileField(upload_to='ticket/ticket_replay_files/', validators=[validate_file_or_image])
    ticket_replay_file_name = models.CharField(max_length=255, editable=False, null=True, blank=True)
    ticket_replay_file_created_data = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if self.ticket_replay_file:
            self.ticket_replay_file_name = basename(self.ticket_replay_file.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.id}, {self.ticket_replay_file_name}"
