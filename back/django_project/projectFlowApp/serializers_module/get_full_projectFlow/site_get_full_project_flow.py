
from rest_framework import serializers


from ...models.project_flow_models import (
    ProjectFlow, ProjectFlowAttachment, ProjectFlowNote, ProjectFlowNoteAttachment, 
    ProjectFlowStep,  ProjectFlowStepNote, ProjectFlowStepNoteAttachment, ProjectFlowStepStatusLog,
    ProjectFlowSubStep,   ProjectFlowSubStepNote, ProjectFlowSubStepNoteAttachment, ProjectFlowSubStepStatusLog
    )

from django.db.models import Max
from django.db.models.functions import Coalesce


def get_user_data(obj, user_attr_name, request=None):
    user = getattr(obj, user_attr_name, None)
    if user:
        PRF_image = None
        if hasattr(user, 'profile_prf_user_relaed_useraccount'):
            profile = user.profile_prf_user_relaed_useraccount
            if profile.PRF_image:
                PRF_image = profile.PRF_image.url
                if request:
                    PRF_image = request.build_absolute_uri(PRF_image)  # Ensure full URL

        return {
            "is_staff": user.is_staff or user.is_superuser ,
            "full_name": f"{user.first_name} {user.last_name}",
            "id": user.id,
            "PRF_image": PRF_image,
        }
    return None



class ProjectFlowSubStepStatusLogSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()

    class Meta:
        model = ProjectFlowSubStepStatusLog
        fields = "__all__"
        read_only_fields = ["id"]

    def get_user(self, obj):
        request = self.context.get("request")  
        return get_user_data(obj, "user", request)  

class ProjectFlowSubStepNoteAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectFlowSubStepNoteAttachment
        fields = "__all__"
        read_only_fields = ["id"]


class ProjectFlowSubStepNoteSerializer(serializers.ModelSerializer):
    files = ProjectFlowSubStepNoteAttachmentSerializer(many=True, read_only=True, source= "ProjectFlowSubStepNoteAttachment_sub_step_note_related_ProjectFlowSubStepNote")
    sub_step_note_user = serializers.SerializerMethodField()
    class Meta:
        model = ProjectFlowSubStepNote
        fields = "__all__"
        read_only_fields = ["id"]

    def get_sub_step_note_user(self, obj):
        request = self.context.get("request")  
        return get_user_data(obj, "sub_step_note_user", request)  

# class ProjectFlowSubStepAttachmentSerializer(serializers.ModelSerializer):

#     class Meta:
#         model = ProjectFlowSubStepAttachment
#         fields = "__all__"
#         read_only_fields = ["id"]



class ProjectFlowSubStepSerializer(serializers.ModelSerializer):
    # files = ProjectFlowSubStepAttachmentSerializer(many=True, read_only=True, source="ProjectFlowSubStepAttachment_sub_step_ProjectFlowSubStep")
    notes = ProjectFlowSubStepNoteSerializer(many=True, read_only=True , source="ProjectFlowSubStepNote_sub_step_related_ProjectFlowSubStep")

    status_logs = serializers.SerializerMethodField()

    can_add_note_by_requester = serializers.SerializerMethodField(read_only=True)
    can_requester_start_step = serializers.SerializerMethodField()
    can_requester_end_step = serializers.SerializerMethodField()

    class Meta:
        model = ProjectFlowSubStep
        fields = "__all__"
        read_only_fields = ["id"]




    def get_can_requester_end_step(self, obj):
        request = self.context.get("request")
        user = getattr(request, "user", None)
 
        if not request or not user:  
            return False   

        if obj.project_flow_sub_step_status != 'in_progress':
            return False


        if obj.allowed_process_by == 'client' and obj.step.project_flow.project_user == user:
            return True

        if obj.allowed_process_by == 'any_staff' and user.is_staff:
            return True
 

        if obj.allowed_process_by == 'specific_project_group' and user.is_staff:
            user_groups = user.groups.all()   
            allowed_groups = obj.allowed_process_groups.all()   
            if allowed_groups.filter(id__in=user_groups.values_list("id", flat=True)).exists():
                return True

        return False 






 
    def get_can_add_note_by_requester(self, obj):
        request = self.context.get('request')
 
        if obj.allowed_process_by == "client"   and obj.start_date_process != None and obj.step.project_flow.project_user == request.user:
            return True        
        return False






    def get_can_requester_start_step(self, obj):
        request = self.context.get("request")
        user = getattr(request, "user", None)
 
        if not request or not user:  
            return False   

        if obj.project_flow_sub_step_status != 'pending':
            return False
 

        if (obj.start_process_sub_step_strategy == 'auto') or \
            (obj.start_process_sub_step_strategy == 'inherit_from_project_flow' and  \
            obj.step.project_flow.default_start_process_step_or_sub_step_strategy == 'auto'):
            return False
        

        step_obj = obj.step
        project_flow_obj = step_obj.project_flow
        if (
            project_flow_obj.manual_start_mode == 'serialized' and (
                obj.start_process_sub_step_strategy == 'manual' or
                (
                    obj.start_process_sub_step_strategy == 'inherit_from_project_flow' and
                    obj.step.project_flow.default_start_process_step_or_sub_step_strategy == 'manual'
                )
            )
        ):
            previous_step_not_completed = ProjectFlowStep.objects.filter(
                project_flow=step_obj.project_flow,
                sorted_weight__lt=step_obj.sorted_weight,
            ).exclude(project_flow_step_status='completed').first()

            if previous_step_not_completed:
               return False



 

        if obj.allowed_process_by == 'client' and obj.step.project_flow.project_user == user:
            return True

        if obj.allowed_process_by == 'any_staff' and user.is_staff:
            return True


        if obj.allowed_process_by == 'specific_project_group' and user.is_staff:
            user_groups = user.groups.all()   
            allowed_groups = obj.allowed_process_groups.all()   
            if allowed_groups.filter(id__in=user_groups.values_list("id", flat=True)).exists():
                return True

        return False 







    def get_status_logs(self, obj):
        is_projectFlow_show_status_log = self.context.get("projectFlow_show_steps_or_sub_steps_status_log_to_client")
        obj_show_status_log = obj.show_status_log_to_client 
        
        if (
            is_projectFlow_show_status_log
            and (obj_show_status_log == "yes" or obj_show_status_log == "inherit_from_project_flow")
            ):

            return ProjectFlowSubStepStatusLogSerializer(
                obj.ProjectFlowSubStepStatusLog_project_flow_sub_step_related_ProjectFlowSubStep.all(),
                many=True,
                read_only=True,
                context=self.context

            ).data
        return []
    





class ProjectFlowStepStatusLogSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    class Meta:
        model = ProjectFlowStepStatusLog
        fields = "__all__"

    def get_user(self, obj):
        request = self.context.get("request")  
        return get_user_data(obj, "user", request)  



class ProjectFlowStepNoteAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectFlowStepNoteAttachment
        fields = "__all__"
        read_only_fields = ["id"]


class ProjectFlowStepNoteSerializer(serializers.ModelSerializer):
    files = ProjectFlowStepNoteAttachmentSerializer(many=True, read_only=True, source="ProjectFlowStepNoteAttachment_project_flow_step_note_related_ProjectFlowStepNote")
    step_note_user = serializers.SerializerMethodField()


    
    class Meta:
        model = ProjectFlowStepNote
        fields = "__all__"
        read_only_fields = ["id"]

    def get_step_note_user(self, obj):
            request = self.context.get("request")  
            return get_user_data(obj, "step_note_user", request)  


# class ProjectFlowStepAttachmentSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = ProjectFlowStepAttachment
#         fields = "__all__"
#         read_only_fields = ["id"]




class ProjectFlowStepSerializer(serializers.ModelSerializer):
    # files = ProjectFlowStepAttachmentSerializer(read_only=True, many=True, source="ProjectFlowStepAttachment_step_related_ProjectFlowStep")
    notes = ProjectFlowStepNoteSerializer(many=True, read_only=True, source="ProjectFlowStepNote_project_step_related_ProjectFlowStep")
    status_logs = serializers.SerializerMethodField(read_only=True)
    sub_steps = serializers.SerializerMethodField()
    step_completed_percentage = serializers.SerializerMethodField()

    can_add_note_by_requester = serializers.SerializerMethodField(read_only=True)

    can_requester_start_step = serializers.SerializerMethodField()
    can_requester_end_step = serializers.SerializerMethodField()


    class Meta:
        model = ProjectFlowStep
        fields = "__all__"
        read_only_fields = ["id"]



    def get_can_requester_end_step(self, obj):
        request = self.context.get("request")
        user = getattr(request, "user", None)
        all_related_project_flow_steps = obj.project_flow.ProjectFlowStep_ProjectFlow_related_ProjectFlow.all()
 
        if not request or not user:  
            return False   

        if obj.project_flow_step_status != 'in_progress':
            return False

        if obj.ProjectFlowSubStep_step_related_ProjectFlowStep.exists():
            return False

       
 
            

        if obj.allowed_process_by == 'client' and obj.project_flow.project_user == user:
            return True

        if obj.allowed_process_by == 'any_staff' and user.is_staff:
            return True


        if obj.allowed_process_by == 'specific_project_group' and user.is_staff:
            user_groups = user.groups.all()   
            allowed_groups = obj.allowed_process_groups.all()   
            if allowed_groups.filter(id__in=user_groups.values_list("id", flat=True)).exists():
                return True

        return False 






 
    def get_can_requester_start_step(self, obj):
        request = self.context.get("request")
        user = getattr(request, "user", None)
        all_related_project_flow_steps = obj.project_flow.ProjectFlowStep_ProjectFlow_related_ProjectFlow.all()
 
        if not request or not user:  
            return False   

        if obj.project_flow_step_status != 'pending':
            return False

        if obj.ProjectFlowSubStep_step_related_ProjectFlowStep.exists():
            return False

        if (obj.start_process_step_strategy == 'auto') or \
            (obj.start_process_step_strategy == 'inherit_from_project_flow' and  \
            obj.project_flow.default_start_process_step_or_sub_step_strategy == 'auto'):
            return False
        
        if obj == all_related_project_flow_steps.first() and \
             obj.project_flow.auto_start_first_step_after_clone == True :
             return False
            

        project_flow_obj = obj.project_flow

        if (
            project_flow_obj.manual_start_mode == 'serialized' and (
                obj.start_process_step_strategy == 'manual' or
                (
                    obj.start_process_step_strategy == 'inherit_from_project_flow' and
                    obj.project_flow.default_start_process_step_or_sub_step_strategy == 'manual'
                )
            )
        ):
            previous_step_not_completed = ProjectFlowStep.objects.filter(
                project_flow=obj.project_flow,
                sorted_weight__lt=obj.sorted_weight,
            ).exclude(project_flow_step_status='completed').first()

            if previous_step_not_completed:
                return False




        if obj.allowed_process_by == 'client' and obj.project_flow.project_user == user:
            return True

        if obj.allowed_process_by == 'any_staff' and user.is_staff:
            return True


        if obj.allowed_process_by == 'specific_project_group' and user.is_staff:
            user_groups = user.groups.all()   
            allowed_groups = obj.allowed_process_groups.all()   
            if allowed_groups.filter(id__in=user_groups.values_list("id", flat=True)).exists():
                return True

        return False 




 

    def get_can_add_note_by_requester(self, obj):
        request = self.context.get('request')

        if obj.allowed_process_by == "client"   and obj.start_date_process != None and obj.project_flow.project_user == request.user:
            return True        
        return False




    def get_step_completed_percentage(self, obj):
        sub_steps = obj.ProjectFlowSubStep_step_related_ProjectFlowStep.filter(show_to_client=True)
        total_sub_steps = sub_steps.count()

        if total_sub_steps == 0 and obj.project_flow_step_status != "completed":
            return 0  # Avoid division by zero
        elif total_sub_steps == 0 and obj.project_flow_step_status == "completed":
            return 100

        completed_sub_steps = sub_steps.filter(project_flow_sub_step_status="completed").count()

        percentage = (completed_sub_steps * 100) // total_sub_steps  # Integer division
        return percentage  # No decimal, returns an integer






 
    def get_sub_steps(self, obj):
        # Only include steps if show_steps_to_client is True

        context = self.context.copy()  # Preserve existing context (including `request`)
        # context["show_steps_or_sub_steps_status_log_to_client"] = obj.show_steps_or_sub_steps_status_log_to_client

        return ProjectFlowSubStepSerializer(
            obj.ProjectFlowSubStep_step_related_ProjectFlowStep.filter(show_to_client=True),  # Filter steps
            many=True,
            context=context
        ).data
 



    def get_status_logs(self, obj):
        is_projectFlow_show_status_log = self.context.get("projectFlow_show_steps_or_sub_steps_status_log_to_client")
        obj_show_status_log = obj.show_status_log_to_client 
 
        if (
            is_projectFlow_show_status_log
            and (obj_show_status_log == "yes" or obj_show_status_log == "inherit_from_project_flow")
            ):

            return ProjectFlowStepStatusLogSerializer(
                obj.ProjectFlowStepStatusLog_project_flow_step_related_ProjectFlowStep.all(),
                many=True,
                read_only=True,
                context=self.context

            ).data
        return []
    



class ProjectFlowNoteAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectFlowNoteAttachment
        fields = "__all__"
        read_only_fields = ["id"]


class ProjectFlowNoteSerializer(serializers.ModelSerializer):
    created_user = serializers.SerializerMethodField(read_only=True)
    files = ProjectFlowNoteAttachmentSerializer(read_only=True, many=True, source="ProjectFlowNoteAttachment_project_flow_note_related_ProjectFlowNote")
    class Meta:
        model = ProjectFlowNote
        fields = "__all__"
      
        read_only_fields = ["id"]

    def get_created_user(self, obj):
        request = self.context.get("request")  
        return get_user_data(obj, "created_user", request)  



class ProjectFlowAttachmentSerializer(serializers.ModelSerializer):
     
     class Meta:
          model = ProjectFlowAttachment
          fields = "__all__"
          read_only_fields = ["id"]



class SiteGetFullProjectFlowSerializer(serializers.ModelSerializer):
    project_user = serializers.SerializerMethodField()
    project_created_user = serializers.SerializerMethodField()
    project_type = serializers.SerializerMethodField()
    steps = serializers.SerializerMethodField()
    files = ProjectFlowAttachmentSerializer(many=True, read_only=True, source="ProjectFlowAttachment_project_flow_related_ProjectFlow")
    # notes = ProjectFlowNoteSerializer(many=True, read_only=True, source="ProjectFlowNote_project_flow_related_ProjectFlow")

    notes = serializers.SerializerMethodField()

    steps_completion_percentage = serializers.SerializerMethodField()
    latest_activity = serializers.SerializerMethodField()  # Add the new field

    class Meta:
        model = ProjectFlow
        fields = "__all__"
 

    def get_notes(self, obj):
        context = self.context.copy()  # Preserve existing context (including `request`)

        return ProjectFlowNoteSerializer(
            obj.ProjectFlowNote_project_flow_related_ProjectFlow.filter(),  # Filter steps
            many=True,
            context=context
        ).data


    def get_project_type(self, obj):
        if obj.project_type:  # Directly access the ForeignKey field
            return {
                "id" : obj.project_type.id,
                "project_name": obj.project_type.project_name,  # Direct access
                "project_name_ar": obj.project_type.project_name_ar,  # Direct access
            }
        return None 

    def get_project_user(self, obj): 
            request = self.context.get("request")  
            return get_user_data(obj, "project_user", request)  

    def get_project_created_user(self, obj):
            request = self.context.get("request")  
            return get_user_data(obj, "project_created_user", request)  

    def get_steps(self, obj):
        # Only include steps if show_steps_to_client is True
        if obj.show_steps_to_client:
            context = self.context.copy()  # Preserve existing context (including `request`)
            context["projectFlow_show_steps_or_sub_steps_status_log_to_client"] = obj.show_steps_or_sub_steps_status_log_to_client

            return ProjectFlowStepSerializer(
                obj.ProjectFlowStep_ProjectFlow_related_ProjectFlow.filter(show_to_client=True),  # Filter steps
                many=True,
                context=context
            ).data
        return []


    def get_steps_completion_percentage(self, obj):
        steps = obj.ProjectFlowStep_ProjectFlow_related_ProjectFlow.filter(show_to_client=True)
        total_steps = steps.count()

        # Count completed steps
        completed_steps = steps.filter(project_flow_step_status="completed").count()

        # Get all substeps related to the steps, filtering by show_to_client=True
        substeps = ProjectFlowSubStep.objects.filter(step__in=steps, show_to_client=True)
        total_substeps = substeps.count()

        # Count completed substeps
        completed_substeps = substeps.filter(project_flow_sub_step_status="completed").count()

        # Total elements to consider (steps + substeps)
        total_elements = total_steps + total_substeps

        if total_elements == 0:
            return 0  # Avoid division by zero

        # Completed elements (steps + substeps)
        completed_elements = completed_steps + completed_substeps

        # Calculate percentage
        percentage = (completed_elements * 100) // total_elements  # Integer division
        return percentage

    def get_latest_activity(self, obj):

        latest_step = ProjectFlowStep.objects.filter(project_flow=obj).aggregate(
            latest=Coalesce(Max('end_date_process'), Max('start_date_process'))
        )['latest']

        latest_sub_step = ProjectFlowSubStep.objects.filter(step__project_flow=obj).aggregate(
            latest=Coalesce(Max('end_date_process'), Max('start_date_process'))
        )['latest']

        if not latest_step and not latest_sub_step:
            return obj.created_date

        return max(filter(None, [latest_step, latest_sub_step]))



    def get_project_user(self, obj): 
        request = self.context.get("request")  
        return get_user_data(obj, "project_user", request)  

    def get_project_created_user(self, obj):
        request = self.context.get("request")  
        return get_user_data(obj, "project_created_user", request)  


