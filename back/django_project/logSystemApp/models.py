from django.db import models

# Create your models here.


from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Log(models.Model):
    ADD = 'Add'
    EDIT = 'Edit'
    DELETE = 'Delete'
    LOGIN = 'Login'
    LOGOUT = 'Logout'
    ACTION_TYPES = [
        (ADD, 'Add'),
        (EDIT, 'Edit'),
        (DELETE, 'Delete'),
        (LOGIN, 'Login'),
        (LOGOUT, 'Logout'),
    ]

    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    action_type = models.CharField(max_length=6, choices=ACTION_TYPES)
    model_name = models.CharField(max_length=255)
    # object_id = models.PositiveIntegerField()

    object_id = models.CharField(max_length=100) 

    object_description = models.CharField(max_length=255)
    timestamp = models.DateTimeField(auto_now_add=True)
    changes = models.JSONField(null=True, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)

    def __str__(self):
        return f"{self.user} {self.get_action_type_display()} {self.model_name} at {self.timestamp}"
    

    class Meta:
        ordering = ['-id']   
