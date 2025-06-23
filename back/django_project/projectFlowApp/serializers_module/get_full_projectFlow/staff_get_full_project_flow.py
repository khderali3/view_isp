


from rest_framework import serializers

from django.conf import settings
from ...models.project_flow_models import (
    ProjectFlow, ProjectFlowAttachment, ProjectFlowNote, ProjectFlowNoteAttachment, ProjectFlowStep,
     ProjectFlowStepNote, ProjectFlowStepNoteAttachment,ProjectFlowStepStatusLog, ProjectFlowSubStep,
    ProjectFlowSubStepNote, ProjectFlowSubStepNoteAttachment, ProjectFlowSubStepStatusLog               
    )

from django.db.models import Max
from django.db.models.functions import Coalesce



from django.contrib.auth import get_user_model
User = get_user_model()


from django.contrib.auth.models import Group


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['id', 'name']  # Returning id and name


 
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
    user = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = ProjectFlowSubStepStatusLog
        fields = "__all__"
        read_only_fields = [ field.name for field in ProjectFlowSubStepStatusLog._meta.fields ]

 
    def get_user(self, obj):
        request = self.context.get("request")  # Get request from serializer context
        return get_user_data(obj, "user", request)  # Pass request explicitly



class ProjectFlowSubStepNoteAttachmentSerializer(serializers.ModelSerializer):

    class Meta:
        model = ProjectFlowSubStepNoteAttachment
        fields = "__all__"
        read_only_fields = [ field.name for field in  ProjectFlowSubStepNoteAttachment._meta.fields ]



class ProjectFlowSubStepNoteSerializer(serializers.ModelSerializer):

    files = ProjectFlowSubStepNoteAttachmentSerializer(many=True, read_only=True, source="ProjectFlowSubStepNoteAttachment_sub_step_note_related_ProjectFlowSubStepNote")
    sub_step_note_user = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = ProjectFlowSubStepNote
        fields = "__all__"
        read_only_fields = [ field.name  for field in ProjectFlowSubStepNote._meta.fields ]

    def get_sub_step_note_user(self, obj):
            request = self.context.get("request")  # Get request from serializer context
            return get_user_data(obj, "sub_step_note_user", request)  # Pass request explicitly







# class ProjectFlowSubStepAttachmentSerializer(serializers.ModelSerializer):

#     class Meta:
#         model = ProjectFlowSubStepAttachment
#         fields = "__all__"
#         read_only_fields = [ field.name for field in ProjectFlowSubStepAttachment._meta.fields ]



class ProjectFlowSubStepSerializer(serializers.ModelSerializer):
    # files = ProjectFlowSubStepAttachmentSerializer(many=True, read_only=True, source="ProjectFlowSubStepAttachment_sub_step_ProjectFlowSubStep")
    notes = ProjectFlowSubStepNoteSerializer(many=True, read_only=True, source="ProjectFlowSubStepNote_sub_step_related_ProjectFlowSubStep")
    status_logs = ProjectFlowSubStepStatusLogSerializer(many=True, read_only=True, source="ProjectFlowSubStepStatusLog_project_flow_sub_step_related_ProjectFlowSubStep")

    handler_user = serializers.SerializerMethodField(read_only=True)

    allowed_process_groups = GroupSerializer(many=True, read_only=True)  # Use GroupSerializer

    can_requester_handle = serializers.SerializerMethodField()

    can_requester_start_step = serializers.SerializerMethodField()

    can_requester_end_step = serializers.SerializerMethodField()

    class Meta:
        model = ProjectFlowSubStep
        fields = "__all__"
        read_only_fields = [ field.name for field in ProjectFlowSubStep._meta.fields ]

    def get_handler_user(self, obj):
            request = self.context.get("request")  # Get request from serializer context
            return get_user_data(obj, "handler_user", request)  # Pass request explicitly




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









    def get_can_requester_handle(self, obj):
        request = self.context.get("request")
 
        if not request or not request.user:  
            return False   

        user = request.user

        if obj.allowed_process_by == 'client' and obj.step.project_flow.project_user == user:
            return True

        if obj.allowed_process_by == 'any_staff' and user.is_staff:
            return True


        if obj.allowed_process_by == 'specific_project_group' and user.is_staff:
            user_groups = user.groups.all()  # Get all groups for the user
            allowed_groups = obj.allowed_process_groups.all()  # Get allowed groups for this step
            if allowed_groups.filter(id__in=user_groups.values_list("id", flat=True)).exists():
                return True

        return False 

 






class ProjectFlowStepStatusLogSerializer(serializers.ModelSerializer):

    user = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = ProjectFlowStepStatusLog
        fields = "__all__"
        read_only_fields =  [ field.name for field in ProjectFlowStepStatusLog._meta.fields ]


    def get_user(self, obj):
            request = self.context.get("request")  # Get request from serializer context
            return get_user_data(obj, "user", request)  # Pass request explicitly




class ProjectFlowStepNoteAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectFlowStepNoteAttachment
        fields = "__all__"
        read_only_fields = [ field.name for field in ProjectFlowStepNoteAttachment._meta.fields ]


class ProjectFlowStepNoteSerializer(serializers.ModelSerializer):
    files = ProjectFlowStepNoteAttachmentSerializer(many=True, read_only=True, source="ProjectFlowStepNoteAttachment_project_flow_step_note_related_ProjectFlowStepNote")
    step_note_user = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = ProjectFlowStepNote
        fields = "__all__"
        read_only_fields = [ field.name for field in ProjectFlowStepNote._meta.fields ]


    def get_step_note_user(self, obj):
            request = self.context.get("request")  # Get request from serializer context
            return get_user_data(obj, "step_note_user", request)  # Pass request explicitly







# class ProjectFlowStepAttachmentSerializer(serializers.ModelSerializer):

#     class Meta:
#         model = ProjectFlowStepAttachment
#         fields = "__all__"
#         read_only_fields = [ field.name for field in ProjectFlowStepAttachment._meta.fields ]


class ProjectFlowStepSerializer(serializers.ModelSerializer):
    # files = ProjectFlowStepAttachmentSerializer(many=True, read_only=True, source="ProjectFlowStepAttachment_step_related_ProjectFlowStep")
    notes = ProjectFlowStepNoteSerializer(many=True, read_only=True, source="ProjectFlowStepNote_project_step_related_ProjectFlowStep")
    status_logs = ProjectFlowStepStatusLogSerializer(many=True, read_only=True, source="ProjectFlowStepStatusLog_project_flow_step_related_ProjectFlowStep")
    sub_steps = ProjectFlowSubStepSerializer(many=True, read_only=True, source="ProjectFlowSubStep_step_related_ProjectFlowStep")
    step_completed_percentage = serializers.SerializerMethodField()

    handler_user = serializers.SerializerMethodField(read_only=True)
    allowed_process_groups = GroupSerializer(many=True, read_only=True)  # Use GroupSerializer
    can_requester_handle = serializers.SerializerMethodField()

    can_requester_start_step = serializers.SerializerMethodField()

    can_requester_end_step = serializers.SerializerMethodField()


    class Meta:
        model = ProjectFlowStep
        fields = "__all__"
        read_only_fields = [ field.name for field in ProjectFlowStep._meta.fields ]



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






    def get_can_requester_handle(self, obj):
        request = self.context.get("request")
 
        if not request or not request.user:  
            return False   

        user = request.user

        if obj.allowed_process_by == 'client' and obj.project_flow.project_user == user:
            return True

        if obj.allowed_process_by == 'any_staff' and user.is_staff:
            return True


        if obj.allowed_process_by == 'specific_project_group' and user.is_staff:
            user_groups = user.groups.all()  # Get all groups for the user
            allowed_groups = obj.allowed_process_groups.all()  # Get allowed groups for this step
            if allowed_groups.filter(id__in=user_groups.values_list("id", flat=True)).exists():
                return True

        return False   


    def get_handler_user(self, obj):
            request = self.context.get("request")  # Get request from serializer context
            return get_user_data(obj, "handler_user", request)  # Pass request explicitly

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



class ProjectFlowNoteAttachmentSerializer(serializers.ModelSerializer):

    class Meta:
        model = ProjectFlowNoteAttachment
        fields = "__all__"
        read_only_fields = [fields.name for fields in ProjectFlowNoteAttachment._meta.fields ]



class ProjectFlowNoteSerializer(serializers.ModelSerializer):

    files = ProjectFlowNoteAttachmentSerializer(many=True, read_only=True, source="ProjectFlowNoteAttachment_project_flow_note_related_ProjectFlowNote")
    created_user = serializers.SerializerMethodField(read_only = True)
    class Meta:
        model = ProjectFlowNote
        fields = "__all__"
        read_only_fields = [ field.name  for field in ProjectFlowNote._meta.fields ]

    def get_created_user(self, obj):
            request = self.context.get("request")  # Get request from serializer context
            return get_user_data(obj, "created_user", request)  # Pass request explicitly


class ProjectFlowAttachmentSerializer(serializers.ModelSerializer):

    class Meta:
        model = ProjectFlowAttachment
        fields = "__all__"
        read_only_fields = [field.name for field in ProjectFlowAttachment._meta.fields]
 

class GetFullProjectFlowSeriallizer(serializers.ModelSerializer):

    files = ProjectFlowAttachmentSerializer(many=True, read_only=True,  source="ProjectFlowAttachment_project_flow_related_ProjectFlow")
    notes = ProjectFlowNoteSerializer(many=True, read_only=True, source="ProjectFlowNote_project_flow_related_ProjectFlow")
    steps = ProjectFlowStepSerializer(many=True, read_only=True, source="ProjectFlowStep_ProjectFlow_related_ProjectFlow")
    project_user = serializers.SerializerMethodField(read_only = True)
    project_created_user = serializers.SerializerMethodField(read_only=True)
    steps_completion_percentage = serializers.SerializerMethodField()
    latest_activity = serializers.SerializerMethodField()  # Add the new field

    class Meta:
        model = ProjectFlow
        fields = "__all__"
 
        read_only_fields = [field.name for field in ProjectFlow._meta.fields]

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



    def get_project_user(self, obj):
            request = self.context.get("request")  # Get request from serializer context
            return get_user_data(obj, "project_user", request)  # Pass request explicitly

    def get_project_created_user(self, obj):
            request = self.context.get("request")  # Get request from serializer context
            return get_user_data(obj, "project_created_user", request)  # Pass request explicitly





