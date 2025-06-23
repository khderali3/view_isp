import json
from django.db.models.signals import pre_save, post_save, pre_delete
from django.dispatch import receiver
from django.utils import timezone
from .models import Log
# from .custom_app_utils import get_client_ip
 


from django_project.middleware import get_current_user, get_current_ip_address

from django.contrib.admin.models import LogEntry  # Make sure you import this
from django.utils import timezone
from django.contrib.auth import get_user_model

User = get_user_model()
 
from django.db.models.signals import m2m_changed

from django.forms.models import model_to_dict


@receiver(m2m_changed)
def track_m2m_changes(sender, instance, action, model, pk_set, **kwargs):
    
    if action not in ["post_add", "post_remove", "post_clear"]:
        return

    try:
        if action == "post_clear":
            changes = {f"{model.__name__}_objects": {"cleared": True}}
        else:
            related_objects = model.objects.filter(pk__in=pk_set)
            simplified_data = []

            for obj in related_objects:
                obj_dict = model_to_dict(obj, exclude=[field.name for field in obj._meta.many_to_many])
                # Optionally include M2M names/IDs manually
                if hasattr(obj, 'permissions'):
                    obj_dict['permissions'] = list(obj.permissions.values_list('name', flat=True))
                simplified_data.append(obj_dict)

            changes = {
                f"{model.__name__}_objects": {
                    action: simplified_data
                }
            }

        Log.objects.create(
            user=get_current_user(),
            action_type=Log.EDIT,
            model_name=instance.__class__.__name__,
            object_id=instance.pk,
            object_description=str(instance),
            timestamp=timezone.now(),
            changes=changes,
            ip_address=get_current_ip_address(),
        )
    except Exception as e:
        print("M2M log error:", str(e))









@receiver(pre_save)
def log_model_edit(sender, instance, **kwargs):
    if sender == Log:
        return  # Prevent logging Log model changes
    try:
        old_instance = sender.objects.get(pk=instance.pk)
        changes = {}
        for field in instance._meta.fields:
            field_name = field.name
            old_value = getattr(old_instance, field_name)
            new_value = getattr(instance, field_name)
            if old_value != new_value:

                try:
                    json.dumps(old_value)  # test serializability
                    old_value = old_value
                except TypeError:
                    old_value = str(old_value)

                try:
                    json.dumps(new_value)  # test serializability
                    new_value = new_value
                except TypeError:
                    new_value = str(new_value)

                changes[field_name] ={ 'old': old_value,'new': new_value }
                

        if changes:
 
            try:
                Log.objects.create(
                    user=get_current_user(),
                    action_type=Log.EDIT,
                    model_name=sender.__name__,
                    object_id=str(instance.pk),
                    object_description=str(instance),
                    timestamp=timezone.now(),
                    changes=changes,
                    ip_address=get_current_ip_address(),
                    )
            except Exception as e: 
                print('error', str(e))

 

    except Exception as e:
        # Object is new, will be handled in post_save
      pass







@receiver(post_save)
def log_model_add(sender, instance, created, **kwargs):
    if sender == Log or sender == LogEntry:
        return  # Prevent logging Log model changes

    if created:

        object_data = {}
        for field in instance._meta.fields:
            field_name = field.name
            value = getattr(instance, field_name)
            try:
                json.dumps(value)
                object_data[field_name] = value
            except TypeError:
                object_data[field_name] = str(value)

        try:
            Log.objects.create(
                user=get_current_user(),
                action_type=Log.ADD,
                model_name=sender.__name__,
                object_id=str(instance.pk),
                object_description=str(instance),
                timestamp=timezone.now(),
                changes=object_data,
                ip_address=get_current_ip_address(),
            )
        except:
            pass


 
 

@receiver(pre_delete)
def log_model_delete(sender, instance, **kwargs):
    if sender == Log:
        return  # Prevent recursive logging

    object_data = {}
    for field in instance._meta.fields:
        field_name = field.name
        value = getattr(instance, field_name)
        try:
            json.dumps(value)  # test serializability
            object_data[field_name] = value
        except TypeError:
            object_data[field_name] = str(value)

    try:
        Log.objects.create(
            user=get_current_user(),
            action_type=Log.DELETE,
            model_name=sender.__name__,
             object_id=str(instance.pk),
            object_description=str(instance),
            timestamp=timezone.now(),
            changes=object_data,
            ip_address=get_current_ip_address(),
        )
    except:
        pass





