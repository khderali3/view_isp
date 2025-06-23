
from django.db import transaction
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import os

from ..models import   (
    ProjectFlowTemplate,ProjectFlowTemplateNote,ProjectFlowTemplateNoteAttachment,
      StepTemplate,  StepTemplateNote,  StepTemplateNoteAttachment,
   
   SubStepTemplate,  SubStepTemplateNote, SubStepTemplateNoteAttachment
  )


from ..models.project_flow_models import (
    ProjectFlow,  ProjectFlowNote, ProjectFlowNoteAttachment,
    ProjectFlowStep,  ProjectFlowStepNote, ProjectFlowStepNoteAttachment,
    ProjectFlowSubStep,  ProjectFlowSubStepNote, ProjectFlowSubStepNoteAttachment
    )

from django.core.files import File


def clone_project_flow_template(request, template_id, projectflow_id, is_force_clone=True):
    try:
        # Start a transaction
        with transaction.atomic():
            # Fetch the necessary objects (adjust this part as needed)
            template = get_object_or_404(ProjectFlowTemplate, id=template_id)   
            projectflow = get_object_or_404(ProjectFlow, id=projectflow_id)

            if projectflow.is_template_cloned :
                if not is_force_clone:
                    return Response({"message": "Workflow template already cloned."}, status=status.HTTP_400_BAD_REQUEST)
                else:
                    try:

                        projectflow.ProjectFlowAttachment_project_flow_related_ProjectFlow.filter(obj_type="cloned_from_template").delete()

                        projectflow.ProjectFlowNote_project_flow_related_ProjectFlow.filter(note_type="cloned_from_template").delete()
 
                        projectflow.ProjectFlowStep_ProjectFlow_related_ProjectFlow.all().delete()

                    except Exception as e:
                        return Response({'message' : str(e)}, status=status.HTTP_400_BAD_REQUEST)


            projectflow.show_steps_to_client = template.show_steps_to_client
            projectflow.show_steps_or_sub_steps_status_log_to_client = template.show_steps_or_sub_steps_status_log_to_client
            projectflow.default_start_process_step_or_sub_step_strategy = template.default_start_process_step_or_sub_step_strategy
            projectflow.template_name_cloned_from = template.template_name
            projectflow.auto_start_first_step_after_clone = template.auto_start_first_step_after_clone
            projectflow.manual_start_mode = template.manual_start_mode
            if projectflow.auto_start_first_step_after_clone:
                projectflow.project_flow_status = 'in_progress'
            else :
                projectflow.project_flow_status = 'pending'
            projectflow.save()

            # project_flow_template_attachments = ProjectFlowTemplateAttachment.objects.filter(project_flow_template=template)
            # for attachment in project_flow_template_attachments:
            #     if attachment.file:
            #         file_name = os.path.basename(attachment.file.name)
            #         with attachment.file.open('rb') as f:
            #             new_attachment = ProjectFlowAttachment(project_flow=projectflow, obj_type="cloned_from_template")                      
            #             new_attachment.file.save(file_name, File(f), save=True)


            #projectflow comments and notes
            project_flow_template_notes = ProjectFlowTemplateNote.objects.filter(project_flow_template=template)
            for note in project_flow_template_notes:
                new_note = ProjectFlowNote(project_flow=projectflow)
                new_note.note = note.note
                new_note.note_type = "cloned_from_template"
                new_note.save()

                note_template_attachments = ProjectFlowTemplateNoteAttachment.objects.filter(project_flow_template_note=note)
                for attachment in note_template_attachments:
                    if attachment.file:
                        file_name = os.path.basename(attachment.file.name)
                        with attachment.file.open('rb') as f:
                            new_attachment = ProjectFlowNoteAttachment(project_flow_note=new_note)
                            new_attachment.file.save(file_name, File(f), save=True)
 



            template_steps = StepTemplate.objects.filter(project_flow_template=template)
            for step_template in template_steps:
                new_step_obj = ProjectFlowStep(project_flow=projectflow)
                new_step_obj.step_name = step_template.step_name
                new_step_obj.show_status_log_to_client = step_template.show_status_log_to_client
                new_step_obj.step_description = step_template.step_description
                new_step_obj.step_name_ar = step_template.step_name_ar
                new_step_obj.step_description_ar = step_template.step_description_ar
                new_step_obj.show_to_client = step_template.show_to_client
                new_step_obj.allowed_process_by = step_template.allowed_process_by 
                new_step_obj.sorted_weight = step_template.sorted_weight
                new_step_obj.start_process_step_strategy = step_template.start_process_step_strategy
                new_step_obj.step_type = step_template.step_type
                new_step_obj.save()
                new_step_obj.allowed_process_groups.set(step_template.allowed_process_groups.all())
             


 
                step_templates_notes = StepTemplateNote.objects.filter(step_template=step_template)
                for step_template_note_obj in step_templates_notes:
                    new_step_note_obj = ProjectFlowStepNote(project_step=new_step_obj)
                    new_step_note_obj.note_type = "cloned_from_template"
                    new_step_note_obj.note = step_template_note_obj.note
               
                    new_step_note_obj.save()

                    step_templates_note_attachments = StepTemplateNoteAttachment.objects.filter(step_template_note=step_template_note_obj)
                    for attachment in step_templates_note_attachments:
                        if attachment.file:
                            file_name = os.path.basename(attachment.file.name)
                            with attachment.file.open('rb') as f:
                                new_attachment = ProjectFlowStepNoteAttachment(project_flow_step_note=new_step_note_obj)
                                # Save the file with only the filename
                                new_attachment.file.save(file_name, File(f), save=True)


                
                template_sub_steps = SubStepTemplate.objects.filter(step_template=step_template)
                for template_sub_step in template_sub_steps:
                    new_sub_step_obj = ProjectFlowSubStep(step=new_step_obj)
                    new_sub_step_obj.show_status_log_to_client = template_sub_step.show_status_log_to_client
                    new_sub_step_obj.sub_step_name =  template_sub_step.sub_step_name
                    new_sub_step_obj.sub_step_description = template_sub_step.sub_step_description

                    new_sub_step_obj.sub_step_name_ar =  template_sub_step.sub_step_name_ar
                    new_sub_step_obj.sub_step_description_ar = template_sub_step.sub_step_description_ar
                    
                    new_sub_step_obj.start_process_sub_step_strategy = template_sub_step.start_process_sub_step_strategy

                    new_sub_step_obj.show_to_client =  template_sub_step.show_to_client
                    new_sub_step_obj.allowed_process_by = template_sub_step.allowed_process_by
                    new_sub_step_obj.sorted_weight = template_sub_step.sorted_weight
                    new_sub_step_obj.save()
                    new_sub_step_obj.allowed_process_groups.set(template_sub_step.allowed_process_groups.all())


                    # template_sub_step_files = SubStepTemplateAttachment.objects.filter(sub_step_template=template_sub_step)
                    # for attachment in template_sub_step_files:
                    #     if attachment.file:
                    #         file_name = os.path.basename(attachment.file.name)
                    #         with attachment.file.open('rb') as f:
                    #             new_attachment = ProjectFlowSubStepAttachment(sub_step=new_sub_step_obj)
                    #             # Save the file with only the filename
                    #             new_attachment.file.save(file_name, File(f), save=True)

                    template_sub_step_notes = SubStepTemplateNote.objects.filter(sub_step_template=template_sub_step)
                    for template_sub_step_note in template_sub_step_notes:
                        new_sub_step_obj = ProjectFlowSubStepNote(sub_step=new_sub_step_obj)
                        new_sub_step_obj.note = template_sub_step_note.note
                        new_sub_step_obj.note_type = "cloned_from_template"
                        new_sub_step_obj.save()


                        template_sub_step_note_attachments = SubStepTemplateNoteAttachment.objects.filter(sub_step_template_note=template_sub_step_note)
                        for attachment in template_sub_step_note_attachments:
                            if attachment.file:
                                file_name = os.path.basename(attachment.file.name)
                                with attachment.file.open('rb') as f:
                                    new_attachment = ProjectFlowSubStepNoteAttachment(sub_step_note=new_sub_step_obj)
                                    new_attachment.file.save(file_name, File(f), save=True)


            # if projectflow.auto_start_first_step_after_clone:
            #     first_step = projectflow.ProjectFlowStep_ProjectFlow_related_ProjectFlow.all().first()
            #     if first_step:  # Ensure there is a step before modifying it
            #         first_step.project_flow_step_status = 'in_progress'
            #         first_step.save()

            #         first_sub_step = first_step.ProjectFlowSubStep_step_related_ProjectFlowStep.all().first()
            #         if first_sub_step:
            #             first_sub_step.project_flow_sub_step_status = 'in_progress'
            #             first_sub_step.save()


            first_step = projectflow.ProjectFlowStep_ProjectFlow_related_ProjectFlow.all().first()

            if (first_step and first_step.start_process_step_strategy == 'auto') \
                    or projectflow.auto_start_first_step_after_clone:
                if first_step:  # Ensure there is a step before modifying it
                    first_step.project_flow_step_status = 'in_progress'
                    first_step.save()

                    first_sub_step = first_step.ProjectFlowSubStep_step_related_ProjectFlowStep.all().first()
                    if first_sub_step:
                        first_sub_step.project_flow_sub_step_status = 'in_progress'
                        first_sub_step.save()

                projectflow.project_flow_status = 'in_progress'
 

            projectflow.is_template_cloned = True
            projectflow.save()


            return Response({"message": "Workflow template successfully mounted."}, status=status.HTTP_201_CREATED)
    
    except Exception as e:
        # If any error occurs, the transaction will be rolled back automatically
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)



class CloneWorkFlowTemplateView(APIView):
    def post(self, request, template_id, projectflow_id): 
        return clone_project_flow_template(request, template_id, projectflow_id)


