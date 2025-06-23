
from django.db.models.signals import pre_save
from django.dispatch import receiver
from django.db.models.signals import pre_delete, post_delete
from django.dispatch import receiver
import os
 


from ..project_flow_template_models import ( 
    ProjectFlowTemplateNoteAttachment,
    StepTemplateNoteAttachment, SubStepTemplateNoteAttachment
    )


# def delete_attachment_file(sender, instance, **kwargs):
#     if instance.file:
#         file_path = instance.file.path
#         if os.path.isfile(file_path):
#             os.remove(file_path)

# # Attach the signal handler to multiple models

# models_to_register = [  ProjectFlowTemplateNoteAttachment,
#     StepTemplateNoteAttachment, SubStepTemplateNoteAttachment ]

# for model in models_to_register:
#     pre_delete.connect(delete_attachment_file, sender=model)

 

def delete_attachment_file(sender, instance, **kwargs):
    if instance.file:
        file_path = instance.file.path
        try:
            if os.path.isfile(file_path):
                os.remove(file_path)
        except :
            pass 

# Attach the signal handler to multiple models
models_to_register = [
    ProjectFlowTemplateNoteAttachment,
    StepTemplateNoteAttachment,
    SubStepTemplateNoteAttachment,
]

for model in models_to_register:
    post_delete.connect(delete_attachment_file, sender=model)