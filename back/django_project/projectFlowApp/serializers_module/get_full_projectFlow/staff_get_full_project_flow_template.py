
from rest_framework import serializers

from ...models import  (ProjectFlowTemplate,ProjectFlowTemplateNote,ProjectFlowTemplateNoteAttachment,
                        
                        StepTemplate, StepTemplateNote,StepTemplateNoteAttachment,
                          
                         SubStepTemplate,  SubStepTemplateNote, SubStepTemplateNoteAttachment,
                        
                      )
from django.contrib.auth.models import Group



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


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['id', 'name']  # Returning id and name




class SubStepTemplateNoteAttachmentSerializer(serializers.ModelSerializer):
 
    class Meta:
      model = SubStepTemplateNoteAttachment
      fields = "__all__"
      read_only_fields = ['id', "created_date" ]
 


class SubStepTemplateNoteSerializer(serializers.ModelSerializer):
    files = SubStepTemplateNoteAttachmentSerializer(many=True, read_only=True, source='SubStepTemplateNoteAttachment_sub_step_template_note_related_SubStepTemplateNote')
    step_note_user = serializers.SerializerMethodField(read_only=True)

    class Meta:
      model = SubStepTemplateNote
      fields = "__all__"
      read_only_fields = ['id', "created_date", "updated_date" ]

    def get_step_note_user(self, obj):
            request = self.context.get("request")  
            return get_user_data(obj, "sub_step_note_user", request)  


# class SubStepTemplateAttachmentSerializer(serializers.ModelSerializer):
#     class Meta:
#       model = SubStepTemplateAttachment
#       fields = "__all__"
#       read_only_fields = ['id', "created_date" ]





class SubStepTemplateSerializer(serializers.ModelSerializer):
   
    # files = SubStepTemplateAttachmentSerializer(many=True, read_only=True, source='SubStepTemplateAttachment_sub_step_template_related_SubStepTemplate')
    notes = SubStepTemplateNoteSerializer(many=True, read_only=True, source='SubStepTemplateNote_sub_step_template_related_SubStepTemplate')
    allowed_process_groups = GroupSerializer(many=True, read_only=True)  # Use GroupSerializer



    class Meta:
      model = SubStepTemplate
      fields = "__all__"
      read_only_fields = ['id', "created_date","updated_date", 'sorted_weight' ]

 


class StepTemplateNoteAttachmentSerializer(serializers.ModelSerializer):
 
    class Meta:
      model = StepTemplateNoteAttachment
      fields = "__all__"
      read_only_fields = ['id', "created_date" ]



class StepTemplateNoteSerializer(serializers.ModelSerializer):

    files = StepTemplateNoteAttachmentSerializer(many=True, read_only=True, source='StepTemplateNoteAttachment_step_template_note_StepTemplateNote')
    step_note_user = serializers.SerializerMethodField()

    class Meta:
      model = StepTemplateNote
      fields = "__all__"
      read_only_fields = ['id', "created_date", "updated_date"]

    def get_step_note_user(self, obj):
            request = self.context.get("request")  
            return get_user_data(obj, "step_note_user", request)  



# class StepTemplateAttachmentSerializer(serializers.ModelSerializer):

#     class Meta:
#       model = StepTemplateAttachment
#       fields = "__all__"
#       read_only_fields = ['id', "created_date"]

 


class StepTemplateSerializer(serializers.ModelSerializer):

    # files = StepTemplateAttachmentSerializer(many=True, read_only=True, source='StepTemplateAttachment_step_template_StepTemplate')
    notes = StepTemplateNoteSerializer(many=True, read_only=True, source='StepsTemplateNote_step_template_related_StepTemplate')
    sub_steps = SubStepTemplateSerializer(many=True, read_only=True, source='SubStepTemplate_step_template_StepTemplate')
    allowed_process_groups = GroupSerializer(many=True, read_only=True)  # Use GroupSerializer

    class Meta:
      model = StepTemplate
      fields = "__all__"
      read_only_fields = ['id', "created_date", "updated_date", "sorted_weight"]








class ProjectFlowTemplateNoteAttachmentSerializer(serializers.ModelSerializer):
 
    class Meta:
      model = ProjectFlowTemplateNoteAttachment
      fields = "__all__"
      read_only_fields = ['id', "created_date" ]


class ProjectFlowTemplateNoteSerializer(serializers.ModelSerializer):
    files = ProjectFlowTemplateNoteAttachmentSerializer(many=True, read_only=True, source='ProjectFlowTemplateNoteAttachment_project_flow_template_note_related_ProjectFlowTemplateNote')
    created_user = serializers.SerializerMethodField()
    class Meta:
        model = ProjectFlowTemplateNote
        fields = "__all__"
        read_only_fields = ['id', "created_date", 'updated_date' ]

    def get_created_user(self, obj):
        request = self.context.get("request")  
        return get_user_data(obj, "created_user", request) 

# class ProjectFlowTemplateAttachmentSerializer(serializers.ModelSerializer):
 
#     class Meta:
#       model = ProjectFlowTemplateAttachment
#       fields = "__all__"
#       read_only_fields = ['id', "created_date" ]




class GetFullProjectFlowTemplateSeriallizer(serializers.ModelSerializer):
    # files = ProjectFlowTemplateAttachmentSerializer(many=True, read_only=True, source='ProjectFlowTemplateAttachment_project_flow_template_related_ProjectFlowTemplate')
    notes = ProjectFlowTemplateNoteSerializer(many=True, read_only=True, source='ProjectFlowTemplateNote_project_flow_template_releated_ProjectFlowTemplate')
    steps = StepTemplateSerializer(many=True, read_only=True, source='StepTemplate_project_flow_template_related_ProjectFlowTemplate')
    class Meta:
      model = ProjectFlowTemplate
      fields = "__all__"
      read_only_fields = ['id', "created_date", "updated_date"]


