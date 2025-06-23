from datetime import datetime
from django.db import models
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from os.path  import basename
from django.contrib.auth.models import Group
import os
from django.utils import timezone

from django.utils.text import slugify

User = get_user_model()
 
from .utils import validate_file_or_image, validate_image

from .project_type_models import ProjectType



class ProjectFlow(models.Model):
    ProjectFlow_status_options = [
        ('pending', 'pending'),
        ('wait_customer_action', 'wait_customer_action'),
        ('in_progress', 'in_progress'),
        ('completed', 'completed'),
        ('canceled', 'canceled'),
    ]
    default_start_process_step_or_sub_step_strategy_options = [
        ('auto', 'auto'),
        ('manual', 'manual'),
    ]

    project_type = models.ForeignKey(ProjectType, related_name='ProjectFlow_project_type_related_ProjectType', on_delete=models.SET_NULL, blank=True, null=True, db_index=True,)
    project_type_name = models.CharField(max_length=255, default='',  blank=True, db_index=True, )
    project_type_name_ar = models.CharField(max_length=255, default='',  blank=True, db_index=True,)
    details = models.TextField()
    project_user = models.ForeignKey(User, related_name='ProjectFlow_project_user_related_User', on_delete=models.PROTECT, blank=True, null=True)
    project_created_user = models.ForeignKey(User, related_name='ProjectFlow_project_created_user_related_User', on_delete=models.PROTECT, blank=True, null=True)
    project_flow_status = models.CharField(max_length=30, choices=ProjectFlow_status_options, default='pending', db_index=True,)

    project_flow_status_when_canceled = models.CharField(max_length=30, choices=ProjectFlow_status_options, default='pending')


    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)
    show_steps_to_client = models.BooleanField(default=True)
    show_steps_or_sub_steps_status_log_to_client = models.BooleanField(default=True)
    project_flow_slug =  models.SlugField(max_length=255, blank=True, null=True, db_index=True, unique=True) 
    default_start_process_step_or_sub_step_strategy = models.CharField(max_length=30, choices=default_start_process_step_or_sub_step_strategy_options, default='auto')
    is_template_cloned = models.BooleanField(default=False)
    template_name_cloned_from = models.CharField(max_length=255, default='')

    manual_start_mode_options = [
        ('serialized', 'serialized'),
        ('non-serialized', 'non-serialized'),
    ]
    manual_start_mode = models.CharField(max_length=30, choices=manual_start_mode_options, default='serialized')
    auto_start_first_step_after_clone = models.BooleanField(default=True)

    contact_phone_no  = models.CharField(max_length=255,  blank=True, default='')
    project_address = models.CharField(max_length=255,  blank=True, default='')
    created_ip_address = models.GenericIPAddressField(null=True, blank=True) 



    def __str__(self):
        if self.project_type:
            return f"{self.project_type.project_name} , {self.project_flow_status}"
        return f"{self.id}"

    class Meta:
        ordering = ('-id',)

    def save(self , *args , **kwargs):
        if not self.project_flow_slug:
            time_now = datetime.now().strftime('%Y-%m-%d_%H:%M:%S')
            data_to_slug = f"{time_now}_{self.project_type.project_name}"
            self.project_flow_slug = slugify(data_to_slug)

        if not self.project_type_name :
            self.project_type_name = self.project_type.project_name
        
        if not self.project_type_name_ar :
            self.project_type_name_ar = self.project_type.project_name_ar


        super(ProjectFlow , self).save(*args, **kwargs)




class InstalledProductType(models.Model):
    product_name = models.CharField(max_length=255)
    product_name_ar = models.CharField(max_length=255)


    private_note = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"{self.product_name}"


 


class InstalledProduct(models.Model):
    project_flow = models.ForeignKey(
        ProjectFlow,
        related_name='installed_products_ProjectFlow',
        on_delete=models.CASCADE
    )

    installed_product_type = models.ForeignKey(
        InstalledProductType,
        related_name='installed_products_InstalledProductType',
        on_delete=models.CASCADE,  
    )
    serial_number = models.CharField(max_length=255, blank=True, null=True)
    note = models.CharField(max_length=255, blank=True, null=True)
    private_note = models.CharField(max_length=255, blank=True, null=True)


 





class ProjectFlowAttachment(models.Model):
    project_flow = models.ForeignKey(ProjectFlow, related_name='ProjectFlowAttachment_project_flow_related_ProjectFlow', on_delete=models.CASCADE, null=True, blank=True)
    file = models.FileField(upload_to='project_flow/ProjectFlowAttachment/', validators=[validate_file_or_image])
    file_name = models.CharField(max_length=255, editable=False, null=True, blank=True)
    created_data = models.DateTimeField(auto_now_add=True) 
    obj_type = models.CharField(max_length=255, blank=True, null=True, default="normal", db_index=True)

    def save(self, *args, **kwargs):
        if self.file :
            self.file_name = basename(self.file.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.id}, {self.project_flow}" 




class ProjectFlowNote(models.Model):
    project_flow = models.ForeignKey(ProjectFlow, related_name='ProjectFlowNote_project_flow_related_ProjectFlow', on_delete=models.CASCADE )
    created_user = models.ForeignKey(User, related_name='ProjectFlowNote_created_user_related_User', on_delete=models.PROTECT, blank=True, null=True)
    note = models.TextField()
    note_type = models.CharField(max_length=255, blank=True, null=True, default="normal", db_index=True)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)
    show_to_client = models.BooleanField(default=False)
 

class ProjectFlowNoteAttachment(models.Model):
    project_flow_note = models.ForeignKey(ProjectFlowNote, related_name='ProjectFlowNoteAttachment_project_flow_note_related_ProjectFlowNote', on_delete=models.CASCADE, blank=True, null=True)
    file = models.FileField(upload_to='project_flow/ProjectFlowNoteAttachment/', validators=[validate_file_or_image])
    file_name = models.CharField(max_length=255, editable=False, null=True, blank=True)
    created_data = models.DateTimeField(auto_now_add=True) 

    def save(self, *args, **kwargs):
        if self.file :
            self.file_name = basename(self.file.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.id}, {self.project_flow_note}" 




class ProjectFlowStep(models.Model):
    ProjectFlowStep_status_options = [
        ('pending', 'pending'),
        ('in_progress', 'in_progress'),
        ('wait_customer_action', 'wait_customer_action'),
        ('completed', 'completed'),
        ('canceled', 'canceled'),
    ]
    
    allow_process_by_options = [
        ('any_staff', 'any_staff'),
        ('specific_staff_group', 'specific_staff_group'),
        ('client', 'client')
    ]

    start_process_step_strategy_options = [
        ('inherit_from_project_flow', 'inherit_from_project_flow'),
        ('auto', 'auto'),
        ('manual', 'manual'),
    ]

    show_status_log_to_client_options = [
        ('inherit_from_project_flow', 'inherit_from_project_flow'),
        ('yes', 'yes'),
        ('no', 'no'),
    ]

    show_status_log_to_client = models.CharField(max_length=30, choices=show_status_log_to_client_options, default='inherit_from_project_flow')

    project_flow = models.ForeignKey(ProjectFlow, related_name='ProjectFlowStep_ProjectFlow_related_ProjectFlow', on_delete=models.CASCADE, null=True, blank=True )
    handler_user = models.ForeignKey(User, related_name='ProjectFlowStep_handler_user_related_User', on_delete=models.PROTECT, blank=True, null=True)
    step_name = models.CharField(max_length=255, db_index=True)
    step_description = models.TextField()
    step_name_ar = models.CharField(max_length=255, db_index=True)
    step_description_ar = models.TextField()
    project_flow_step_status = models.CharField(max_length=30, choices=ProjectFlowStep_status_options, default='pending')

    show_to_client = models.BooleanField(default=True)

    allowed_process_by =  models.CharField(max_length=30, choices=allow_process_by_options, default='any_staff')
    allowed_process_groups = models.ManyToManyField(Group, related_name="project_flow_steps_groups", blank=True)

    sorted_weight = models.PositiveIntegerField(default=0, db_index=True)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)

    start_process_step_strategy = models.CharField(max_length=30, choices=start_process_step_strategy_options, default='inherit_from_project_flow')
    start_date_process = models.DateTimeField(null=True, blank=True)
    end_date_process =  models.DateTimeField(null=True, blank=True)

    step_type = models.CharField(max_length=50, default='default_step_type')

    def __str__(self):
        return f"{self.id}, {self.project_flow}" 


    def save(self, *args, **kwargs):

        if self.project_flow_step_status != 'pending' and not self.start_date_process:
            self.start_date_process = timezone.now()

        if self.project_flow_step_status in ['completed', 'canceled'] and not self.end_date_process:
            self.end_date_process = timezone.now()

 

        if not self.sorted_weight:  # If sorted_weight is None or 0
            super().save(*args, **kwargs)  # Save first to get an ID
            self.sorted_weight = self.id
            super().save(update_fields=['sorted_weight'])  # Update only sorted_weight
        else:
            super().save(*args, **kwargs)  # Regular save for updates

    class Meta:
        ordering = ['sorted_weight'] 



class ProjectFlowStepStatusLog(models.Model):
    project_flow_step = models.ForeignKey(ProjectFlowStep, related_name="ProjectFlowStepStatusLog_project_flow_step_related_ProjectFlowStep", on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.PROTECT, related_name="ProjectFlowStepStatusLog_user_related_User", blank=True, null=True)
    previous_status = models.CharField(max_length=30, choices=ProjectFlowStep.ProjectFlowStep_status_options)
    new_status = models.CharField(max_length=30, choices=ProjectFlowStep.ProjectFlowStep_status_options)
    timestamp = models.DateTimeField(auto_now_add=True)



class ProjectFlowStepNote(models.Model):
    project_step = models.ForeignKey(ProjectFlowStep, related_name='ProjectFlowStepNote_project_step_related_ProjectFlowStep', on_delete=models.CASCADE, null=True, blank=True)
    step_note_user = models.ForeignKey(User, related_name='ProjectFlowStepNote_step_note_user_related_ProjectFlowStep', on_delete=models.PROTECT, blank=True, null=True)
    note = models.TextField()
    note_type = models.CharField(max_length=255, blank=True, null=True, default="normal")
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.id}, {self.project_step}"











class ProjectFlowStepNoteAttachment(models.Model):
    project_flow_step_note = models.ForeignKey(ProjectFlowStepNote, related_name='ProjectFlowStepNoteAttachment_project_flow_step_note_related_ProjectFlowStepNote', on_delete=models.CASCADE, null=True, blank=True)
    file = models.FileField(upload_to='project_flow/ProjectFlowStepNoteAttachment/', validators=[validate_file_or_image])
    file_name = models.CharField(max_length=255, editable=False, null=True, blank=True)
    created_data = models.DateTimeField(auto_now_add=True) 

    def save(self, *args, **kwargs):
        if self.file :
            self.file_name = basename(self.file.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.id}, {self.project_flow_step_note}, {self.file_name}" 



class ProjectFlowSubStep(models.Model):

    ProjectFlow_Sub_Step_status_options = [
        ('pending', 'pending'),
        ('in_progress', 'in_progress'),
        ('wait_customer_action', 'wait_customer_action'),
        ('completed', 'completed'),
        ('canceled', 'canceled'),
    ]



    allow_process_by_options = [
        ('any_staff', 'any_staff'),
        ('specific_staff_group', 'specific_staff_group'),
        ('client', 'client')

    ]

    show_status_log_to_client_options = [
        ('inherit_from_project_flow', 'inherit_from_project_flow'),
        ('yes', 'yes'),
        ('no', 'no'),
    ]

    show_status_log_to_client = models.CharField(max_length=30, choices=show_status_log_to_client_options, default='inherit_from_project_flow')
    project_flow_sub_step_status = models.CharField(max_length=30, choices=ProjectFlow_Sub_Step_status_options, default='pending')


    step = models.ForeignKey(ProjectFlowStep, related_name='ProjectFlowSubStep_step_related_ProjectFlowStep', on_delete=models.CASCADE, null=True, blank=True)
    sub_step_name = models.CharField(max_length=255, db_index=True)
    sub_step_description = models.TextField()

    sub_step_name_ar = models.CharField(max_length=255, db_index=True)
    sub_step_description_ar = models.TextField()

    handler_user = models.ForeignKey(User, related_name='ProjectFlowSubStep_handler_user_related_User', on_delete=models.PROTECT, blank=True, null=True)

    show_to_client = models.BooleanField(default=True)
    allowed_process_by =  models.CharField(max_length=30, choices=allow_process_by_options, default='any_staff')
    allowed_process_groups = models.ManyToManyField(Group, related_name="ProjectFlowSubStep_groups", blank=True)
    sorted_weight = models.PositiveIntegerField(db_index=True, blank=True, default=0)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)    




    start_process_sub_step_strategy_options = [
        ('inherit_from_project_flow', 'inherit_from_project_flow'),
        ('auto', 'auto'),
        ('manual', 'manual'),
    ]

    start_process_sub_step_strategy = models.CharField(max_length=30, choices=start_process_sub_step_strategy_options, default='inherit_from_project_flow')
    start_date_process = models.DateTimeField(null=True, blank=True)
    end_date_process =  models.DateTimeField(null=True, blank=True)

    step_type = models.CharField(max_length=50, default='default_step_type')

 
    def __str__(self):
        return f"{self.id}, {self.sub_step_name} " 

 
    def save(self, *args, **kwargs):


        if self.project_flow_sub_step_status != 'pending' and not self.start_date_process:
            self.start_date_process = timezone.now()

        if self.project_flow_sub_step_status in ['completed', 'canceled'] and not self.end_date_process:
            self.end_date_process = timezone.now()
 

        if not self.sorted_weight:  # If sorted_weight is None or 0
            super().save(*args, **kwargs)  # Save first to get an ID
            self.sorted_weight = self.id
            super().save(update_fields=['sorted_weight'])  # Update only sorted_weight
        else:
            super().save(*args, **kwargs)  # Regular save for updates

    class Meta:
        ordering = ['sorted_weight'] 

  
class ProjectFlowSubStepStatusLog(models.Model):
    project_flow_sub_step = models.ForeignKey(ProjectFlowSubStep, related_name="ProjectFlowSubStepStatusLog_project_flow_sub_step_related_ProjectFlowSubStep", on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.PROTECT, related_name="ProjectFlowSubStepStatusLog_user_related_User", blank=True, null=True)
    previous_status = models.CharField(max_length=30, choices=ProjectFlowStep.ProjectFlowStep_status_options)
    new_status = models.CharField(max_length=30, choices=ProjectFlowStep.ProjectFlowStep_status_options)
    timestamp = models.DateTimeField(auto_now_add=True)




class ProjectFlowSubStepNote(models.Model):
    sub_step = models.ForeignKey(ProjectFlowSubStep, related_name='ProjectFlowSubStepNote_sub_step_related_ProjectFlowSubStep', on_delete=models.CASCADE, null=True, blank=True)
    sub_step_note_user = models.ForeignKey(User, related_name='ProjectFlowSubStepNote_sub_step_note_user_related_User', on_delete=models.PROTECT, blank=True, null=True)
    note = models.TextField()
    note_type = models.CharField(max_length=255, blank=True, null=True, default="normal")
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.id}, {self.sub_step}"


class ProjectFlowSubStepNoteAttachment(models.Model):
    sub_step_note = models.ForeignKey(ProjectFlowSubStepNote, related_name='ProjectFlowSubStepNoteAttachment_sub_step_note_related_ProjectFlowSubStepNote', on_delete=models.CASCADE, null=True, blank=True)
    file = models.FileField(upload_to='project_flow/ProjectFlowSubStepNoteAttachment/', validators=[validate_file_or_image])
    file_name = models.CharField(max_length=255, editable=False, null=True, blank=True)
    created_data = models.DateTimeField(auto_now_add=True) 

    def save(self, *args, **kwargs):
        if self.file :
            self.file_name = basename(self.file.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.id}, {self.file_name}" 

  