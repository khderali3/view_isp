
 
from django.db.models.signals import pre_delete, post_delete
 
import os

from ..project_type_models import  ProjectTypeExtraImages , ProjectTypeAttachment, ProjectType






# def delete_attachment_file(sender, instance, **kwargs):
 
#     file_path = None  

#     if isinstance(instance, ProjectType) and instance.main_image:
#         file_path = instance.main_image.path  # Delete `main_image` for ProjectType

#     elif hasattr(instance, 'file') and instance.file:  
#         file_path = instance.file.path  # Delete `file` for other models

#     if file_path and os.path.isfile(file_path):  # Ensure file exists before deleting
#         os.remove(file_path)



# # Attach the signal handler to multiple models
# models_to_register = [ProjectTypeExtraImages, ProjectTypeAttachment, ProjectType]

# for model in models_to_register:
#     pre_delete.connect(delete_attachment_file, sender=model)


 

def delete_attachment_file(sender, instance, **kwargs):
    file_path = None  

    try:
        if isinstance(instance, ProjectType) and instance.main_image:
            file_path = instance.main_image.path  # Delete `main_image` for ProjectType

        elif hasattr(instance, 'file') and instance.file:  
            file_path = instance.file.path  # Delete `file` for other models

        if file_path and os.path.isfile(file_path):  # Ensure file exists before deleting
            os.remove(file_path)
    except :
        pass  

# Attach the signal handler to multiple models
models_to_register = [ProjectTypeExtraImages, ProjectTypeAttachment, ProjectType]

for model in models_to_register:
    post_delete.connect(delete_attachment_file, sender=model)
