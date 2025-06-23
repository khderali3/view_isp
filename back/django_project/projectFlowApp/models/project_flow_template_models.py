from datetime import datetime
from django.db import models
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from os.path  import basename
from django.contrib.auth.models import Group
import os

from django.utils.text import slugify

User = get_user_model()
 
from .utils import validate_file_or_image, validate_image



class ProjectFlowTemplate(models.Model):
    default_start_process_step_or_sub_step_strategy_options = [
        ('auto', 'auto'),
        ('manual', 'manual'),
    ]
    manual_start_mode_options = [
        ('serialized', 'serialized'),
        ('non-serialized', 'non-serialized'),
    ]
    template_name = models.CharField(max_length=255, db_index=True)
    # template_name_ar = models.CharField(max_length=255, db_index=True, default="", blank=True)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)
    show_steps_to_client = models.BooleanField(default=True)
    show_steps_or_sub_steps_status_log_to_client = models.BooleanField(default=True)
    default_start_process_step_or_sub_step_strategy = models.CharField(max_length=30, choices=default_start_process_step_or_sub_step_strategy_options, default='auto')
    manual_start_mode = models.CharField(max_length=30, choices=manual_start_mode_options, default='serialized')
    auto_start_first_step_after_clone = models.BooleanField(default=True)
    def __str__(self):
        return f"{self.id}, {self.template_name}" 
    class Meta:
        ordering = ['-id'] 




# class ProjectFlowTemplateAttachment(models.Model):
#     project_flow_template = models.ForeignKey(ProjectFlowTemplate, related_name='ProjectFlowTemplateAttachment_project_flow_template_related_ProjectFlowTemplate', on_delete=models.CASCADE, null=True, blank=True )
#     file = models.FileField(upload_to='project_flow/ProjectFlowTemplateAttachment/', validators=[validate_file_or_image])
#     file_name = models.CharField(max_length=255, editable=False, null=True, blank=True)
#     created_data = models.DateTimeField(auto_now_add=True) 

#     def save(self, *args, **kwargs):
#         if self.file :
#             self.file_name = basename(self.file.name)
#         super().save(*args, **kwargs)

#     def __str__(self):
#         return f"{self.id}, {self.project_flow_template}" 



class ProjectFlowTemplateNote(models.Model):
    project_flow_template = models.ForeignKey(ProjectFlowTemplate, related_name='ProjectFlowTemplateNote_project_flow_template_releated_ProjectFlowTemplate', on_delete=models.CASCADE, null=True, blank=True)
    created_user = models.ForeignKey(User, related_name='ProjectFlowTemplateNote_created_user_User', on_delete=models.PROTECT, blank=True, null=True)
 

    note = models.TextField()
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.id}, {self.project_flow_template}, {self.note}"

 
class ProjectFlowTemplateNoteAttachment(models.Model):
    project_flow_template_note = models.ForeignKey(ProjectFlowTemplateNote, related_name='ProjectFlowTemplateNoteAttachment_project_flow_template_note_related_ProjectFlowTemplateNote', on_delete=models.CASCADE, null=True, blank=True)
    
    file = models.FileField(upload_to='project_flow/ProjectFlowTemplateNoteAttachment/', validators=[validate_file_or_image])
    file_name = models.CharField(max_length=255, editable=False, null=True, blank=True)
    created_data = models.DateTimeField(auto_now_add=True) 

    def save(self, *args, **kwargs):
        if self.file :
            self.file_name = basename(self.file.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.id}, {self.file_name}" 
    
    # def delete(self, *args, **kwargs):
    #     # Check if file exists before deleting
    #     if self.file:
    #         if os.path.isfile(self.file.path):
    #             os.remove(self.file.path)
    #     super().delete(*args, **kwargs)  # Call the parent class's delete method





class StepTemplate(models.Model):
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

    show_status_log_to_client = models.CharField(max_length=128, choices=show_status_log_to_client_options, default='inherit_from_project_flow')


    project_flow_template = models.ForeignKey(ProjectFlowTemplate, related_name='StepTemplate_project_flow_template_related_ProjectFlowTemplate', on_delete=models.CASCADE, null=True, blank=True)
    step_name = models.CharField(max_length=255, db_index=True)
    step_description = models.TextField()
    step_name_ar = models.CharField(max_length=255, db_index=True)
    step_description_ar = models.TextField()
    show_to_client = models.BooleanField(default=True)
    allowed_process_by =  models.CharField(max_length=30, choices=allow_process_by_options, default='any_staff')
    allowed_process_groups = models.ManyToManyField(Group, related_name="steps_templates_allowed_groups", blank=True)
    sorted_weight = models.PositiveIntegerField(db_index=True, blank=True, default=0)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)    


    start_process_step_strategy = models.CharField(max_length=30, choices=start_process_step_strategy_options, default='inherit_from_project_flow')

    step_type = models.CharField(max_length=50, default='default_step_type')

    def __str__(self):
        return f"{self.id}, {self.step_name} , {self.project_flow_template}" 

  
    def save(self, *args, **kwargs):
        if not self.sorted_weight:  # If sorted_weight is None or 0
            super().save(*args, **kwargs)  # Save first to get an ID
            self.sorted_weight = self.id
            super().save(update_fields=['sorted_weight'])  # Update only sorted_weight
        else:
            super().save(*args, **kwargs)  # Regular save for updates

    class Meta:
        ordering = ['sorted_weight'] 




# class StepTemplateAttachment(models.Model):
#     step_template = models.ForeignKey(StepTemplate, related_name='StepTemplateAttachment_step_template_StepTemplate', on_delete=models.CASCADE , null=True, blank=True )
#     file = models.FileField(upload_to='project_flow/StepTemplateAttachment/', validators=[validate_file_or_image])
#     file_name = models.CharField(max_length=255, editable=False, null=True, blank=True)
#     created_data = models.DateTimeField(auto_now_add=True) 

#     def save(self, *args, **kwargs):
#         if self.file :
#             self.file_name = basename(self.file.name)
#         super().save(*args, **kwargs)

#     def __str__(self):
#         return f"{self.id}, {self.step_template}" 



class StepTemplateNote(models.Model):
    step_template = models.ForeignKey(StepTemplate, related_name='StepsTemplateNote_step_template_related_StepTemplate', on_delete=models.CASCADE, null=True, blank=True)
    step_note_user = models.ForeignKey(User, related_name='ProjectFlowTemplateStepNote_step_note_user_related_ProjectFlowStep', on_delete=models.PROTECT, blank=True, null=True)

    note = models.TextField()
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.id}, {self.step_template.step_name}"

  


class StepTemplateNoteAttachment(models.Model):
    step_template_note = models.ForeignKey(StepTemplateNote, related_name='StepTemplateNoteAttachment_step_template_note_StepTemplateNote', on_delete=models.CASCADE, null=True, blank=True)
    
    file = models.FileField(upload_to='project_flow/StepTemplateNoteAttachment/', validators=[validate_file_or_image])
    file_name = models.CharField(max_length=255, editable=False, null=True, blank=True)
    created_data = models.DateTimeField(auto_now_add=True) 

    def save(self, *args, **kwargs):
        if self.file :
            self.file_name = basename(self.file.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.id}, {self.file_name}" 
    
   
  

class SubStepTemplate(models.Model):

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


    show_status_log_to_client = models.CharField(max_length=128, choices=show_status_log_to_client_options, default='inherit_from_project_flow')



    step_template = models.ForeignKey(StepTemplate, related_name='SubStepTemplate_step_template_StepTemplate', on_delete=models.CASCADE, null=True, blank=True)
    sub_step_name = models.CharField(max_length=255, db_index=True)
    sub_step_description = models.TextField()

    sub_step_name_ar = models.CharField(max_length=255, db_index=True)
    sub_step_description_ar = models.TextField()


    show_to_client = models.BooleanField(default=True)
    allowed_process_by =  models.CharField(max_length=30, choices=allow_process_by_options, default='any_staff')
    allowed_process_groups = models.ManyToManyField(Group, related_name="SubStepTemplate_groups", blank=True)
    sorted_weight = models.PositiveIntegerField(db_index=True, blank=True, default=0)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)    


    start_process_sub_step_strategy_options = [
        ('inherit_from_project_flow', 'inherit_from_project_flow'),
        ('auto', 'auto'),
        ('manual', 'manual'),
    ]

    start_process_sub_step_strategy = models.CharField(max_length=30, choices=start_process_sub_step_strategy_options, default='inherit_from_project_flow')



    step_type = models.CharField(max_length=50, default='default_step_type')






    def __str__(self):
        return f"{self.id}, {self.sub_step_name} , {self.step_template}" 

    def save(self, *args, **kwargs):
        if not self.sorted_weight:  # If sorted_weight is None or 0
            super().save(*args, **kwargs)  # Save first to get an ID
            self.sorted_weight = self.id
            super().save(update_fields=['sorted_weight'])  # Update only sorted_weight
        else:
            super().save(*args, **kwargs)  # Regular save for updates

    class Meta:
        ordering = ['sorted_weight'] 

  
# class SubStepTemplateAttachment(models.Model):
#     sub_step_template = models.ForeignKey(SubStepTemplate, related_name='SubStepTemplateAttachment_sub_step_template_related_SubStepTemplate', on_delete=models.CASCADE, null=True, blank=True)
#     file = models.FileField(upload_to='project_flow/SubStepTemplateAttachment/', validators=[validate_file_or_image])
#     file_name = models.CharField(max_length=255, editable=False, null=True, blank=True)
#     created_data = models.DateTimeField(auto_now_add=True) 

#     def save(self, *args, **kwargs):
#         if self.file :
#             self.file_name = basename(self.file.name)
#         super().save(*args, **kwargs)

#     def __str__(self):
#         return f"{self.id}, {self.sub_step_template}" 



class SubStepTemplateNote(models.Model):
    sub_step_template = models.ForeignKey(SubStepTemplate, related_name='SubStepTemplateNote_sub_step_template_related_SubStepTemplate', on_delete=models.CASCADE, null=True, blank=True)

    sub_step_note_user = models.ForeignKey(User, related_name='ProjectFlowTemplatesubStepNote_step_note_user_related_ProjectFlowStep', on_delete=models.PROTECT, blank=True, null=True)

    note = models.TextField()
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)



    def __str__(self):
        return f"{self.id}, {self.sub_step_template}, {self.note}"
    
 
class SubStepTemplateNoteAttachment(models.Model):
    sub_step_template_note = models.ForeignKey(SubStepTemplateNote, related_name='SubStepTemplateNoteAttachment_sub_step_template_note_related_SubStepTemplateNote', on_delete=models.CASCADE, null=True, blank=True)

    file = models.FileField(upload_to='project_flow/SubStepTemplateNoteAttachment/', validators=[validate_file_or_image])
    file_name = models.CharField(max_length=255, editable=False, null=True, blank=True)
    created_data = models.DateTimeField(auto_now_add=True) 

    def save(self, *args, **kwargs):
        if self.file :
            self.file_name = basename(self.file.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.id}, {self.file_name}" 
    
