

from rest_framework.serializers import ModelSerializer

from ..models import  (ProjectFlowTemplate, StepTemplate, StepTemplateNote,
                        StepTemplateNoteAttachment,  ProjectFlowTemplateNote, ProjectFlowTemplateNoteAttachment,
                         SubStepTemplate,  SubStepTemplateNote, SubStepTemplateNoteAttachment,
                        
                      )

from rest_framework import serializers



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




class CreateSubStepTemplateNoteAttachmentSerializer(ModelSerializer):
    file = serializers.FileField(required=False)
    class Meta:
      model = SubStepTemplateNoteAttachment
      fields = "__all__"
      read_only_fields = ['id', "created_date" ]

    def validate(self, attrs):

      request = self.context.get('request')
      files = request.FILES.getlist('file[]')

      if not files:  # Check if no files are provided
        raise serializers.ValidationError({"file[]": "This field is required and cannot be empty."})
      return attrs

    def create(self, validated_data):
        request = self.context.get('request')

        files = request.FILES.getlist('file[]')  # Retrieve file list

        attachments = []
        for file in files:
            attachment = SubStepTemplateNoteAttachment.objects.create(**validated_data, file=file)
            attachments.append(attachment)

        return attachments
        # attachment_ids = []
        # for attachment in attachments:
        #     attachment_ids.append(attachment.id)

        # return SubStepTemplateNoteAttachment.objects.filter(id__in=attachment_ids)

    def to_representation(self, instance):
        request = self.context.get("request")  # Get request safely
        representation = super().to_representation(instance)

        if instance.file:
            file_url = instance.file.url
            if request:
                file_url = request.build_absolute_uri(file_url)

            representation["file"] = file_url  # Ensure full URL

        return representation


class SubStepTemplateNoteAttachmentSerializer(ModelSerializer):
 
    class Meta:
      model = SubStepTemplateNoteAttachment
      fields = "__all__"
      read_only_fields = ['id', "created_date" ]
 


class CreateOrGetOrPutObjectSubStepTemplateNoteSerializer(ModelSerializer):
   
    files = SubStepTemplateNoteAttachmentSerializer(many=True, read_only=True, source='SubStepTemplateNoteAttachment_sub_step_template_note_related_SubStepTemplateNote')


    class Meta:
      model = SubStepTemplateNote
      fields = "__all__"
      read_only_fields = ['id', "created_date", "updated_date" ]

    def create(self, validated_data):
        obj = super().create(validated_data)  # Create StepTemplateNote instance
        request = self.context.get("request")
        
        files = request.FILES.getlist("file[]") if request else []

        attachments = []
        for file in files:
            attachment = SubStepTemplateNoteAttachment.objects.create(
                sub_step_template_note=obj, file=file
            )
            attachments.append(attachment)

        obj.files = attachments  # Attach created files
        return obj

    def update(self, obj, validated_data):
        obj = super().update(obj, validated_data)  # Update StepTemplateNote instance
        request = self.context.get("request")
        files = request.FILES.getlist("file[]") if request else []
        for file in files:
            SubStepTemplateNoteAttachment.objects.create(
                sub_step_template_note=obj, file=file
            )
        return obj



class SubStepTemplateNoteSerializer(ModelSerializer):
   
    files = SubStepTemplateNoteAttachmentSerializer(many=True, read_only=True, source='SubStepTemplateNoteAttachment_sub_step_template_note_related_SubStepTemplateNote')
    step_note_user = serializers.SerializerMethodField(read_only=True)

    class Meta:
      model = SubStepTemplateNote
      fields = "__all__"
      read_only_fields = ['id', "created_date", "updated_date" ]

    def get_step_note_user(self, obj):
            request = self.context.get("request")  
            return get_user_data(obj, "sub_step_note_user", request)  






# class CreateSubStepTemplateAttachmentSerializer(ModelSerializer):
#     file = serializers.FileField(required=False)
#     class Meta:
#       model = SubStepTemplateAttachment
#       fields = "__all__"
#       read_only_fields = ['id', "created_date" ]


#     def validate(self, attrs):

#       request = self.context.get('request')
#       files = request.FILES.getlist('file[]')

#       if not files:  # Check if no files are provided
#         raise serializers.ValidationError({"file[]": "This field is required and cannot be empty."})
#       return attrs

#     def create(self, validated_data):
#         request = self.context.get('request')

#         files = request.FILES.getlist('file[]')  # Retrieve file list

#         attachments = []
#         for file in files:
#             attachment = SubStepTemplateAttachment.objects.create(**validated_data, file=file)
#             attachments.append(attachment)

#         return attachments
#         # attachment_ids = []
#         # for attachment in attachments:
#         #     attachment_ids.append(attachment.id)

#         # return SubStepTemplateAttachment.objects.filter(id__in=attachment_ids)

#     def to_representation(self, instance):
#         request = self.context.get("request")  # Get request safely
#         representation = super().to_representation(instance)

#         if instance.file:
#             file_url = instance.file.url
#             if request:
#                 file_url = request.build_absolute_uri(file_url)

#             representation["file"] = file_url  # Ensure full URL

#         return representation






# class SubStepTemplateAttachmentSerializer(ModelSerializer):
#     class Meta:
#       model = SubStepTemplateAttachment
#       fields = "__all__"
#       read_only_fields = ['id', "created_date" ]






class CreateOrGetOrPutObjectSubStepTemplateSerializer(ModelSerializer):
   

    # files = SubStepTemplateAttachmentSerializer(many=True, read_only=True, source='SubStepTemplateAttachment_sub_step_template_related_SubStepTemplate')
    show_to_client = serializers.BooleanField(default=True)

    class Meta:
      model = SubStepTemplate
      fields = "__all__"
      read_only_fields = ['id', "created_date","updated_date", 'sorted_weight' ]

    # def create(self, validated_data):
    #     obj = super().create(validated_data)  # Create StepTemplateNote instance
    #     request = self.context.get("request")
        
    #     files = request.FILES.getlist("file[]") if request else []

    #     attachments = []
    #     for file in files:
    #         attachment = SubStepTemplateAttachment.objects.create(
    #             sub_step_template=obj, file=file
    #         )
    #         attachments.append(attachment)

    #     obj.files = attachments  # Attach created files
    #     return obj

    # def update(self, obj, validated_data):
    #     obj = super().update(obj, validated_data)  # Update StepTemplateNote instance
    #     request = self.context.get("request")
    #     files = request.FILES.getlist("file[]") if request else []
    #     for file in files:
    #         SubStepTemplateAttachment.objects.create(
    #             sub_step_template=obj, file=file
    #         )
    #     return obj


class SubStepTemplateSerializer(ModelSerializer):
   
    class Meta:
      model = SubStepTemplate
      fields = "__all__"
      read_only_fields = ['id', "created_date","updated_date", 'sorted_weight' ]

 


class ProjectFlowTemplateNoteAttachmentSerializer(ModelSerializer):
 
    class Meta:
      model = ProjectFlowTemplateNoteAttachment
      fields = "__all__"
      read_only_fields = ['id', "created_date" ]
 



class CreateProjectFlowTemplateNoteAttachmentSerializer(ModelSerializer):
 
    file = serializers.FileField(required=False)
 
    class Meta:
      model = ProjectFlowTemplateNoteAttachment
      fields = "__all__"
      read_only_fields = ['id', "created_date" ]

    def validate(self, attrs):

      request = self.context.get('request')
      files = request.FILES.getlist('file[]')

      if not files:  # Check if no files are provided
        raise serializers.ValidationError({"file[]": "This field is required and cannot be empty."})
      return attrs

    def create(self, validated_data):
        request = self.context.get('request')

        files = request.FILES.getlist('file[]')  # Retrieve file list

        attachments = []
        for file in files:
            attachment = ProjectFlowTemplateNoteAttachment.objects.create(**validated_data, file=file)
            attachments.append(attachment)

        return attachments
        # attachment_ids = []
        # for attachment in attachments:
        #     attachment_ids.append(attachment.id)

        # return ProjectFlowTemplateNoteAttachment.objects.filter(id__in=attachment_ids)

    def to_representation(self, instance):
        request = self.context.get("request")  # Get request safely
        representation = super().to_representation(instance)

        if instance.file:
            file_url = instance.file.url
            if request:
                file_url = request.build_absolute_uri(file_url)

            representation["file"] = file_url  # Ensure full URL

        return representation






class CreateOrGetOrPutObjectProjectFlowTemplateNoteSerializer(ModelSerializer):
    files = ProjectFlowTemplateNoteAttachmentSerializer(many=True, read_only=True, source='ProjectFlowTemplateNoteAttachment_project_flow_template_note_related_ProjectFlowTemplateNote')

    class Meta:
        model = ProjectFlowTemplateNote
        fields = "__all__"
        read_only_fields = ['id', "created_date", 'updated_date' ]
    def create(self, validated_data):
        obj = super().create(validated_data)  # Create StepTemplateNote instance
        request = self.context.get("request")
        files = request.FILES.getlist("file[]") if request else []

        attachments = []
        for file in files:
            attachment = ProjectFlowTemplateNoteAttachment.objects.create(
                project_flow_template_note=obj, file=file
            )
            attachments.append(attachment)

        obj.files = attachments  # Attach created files
        return obj

    def update(self, obj, validated_data):
        obj = super().update(obj, validated_data)  # Update StepTemplateNote instance
        request = self.context.get("request")
        files = request.FILES.getlist("file[]") if request else []
        for file in files:
            ProjectFlowTemplateNoteAttachment.objects.create(
                project_flow_template_note=obj, file=file
            )
        return obj




class ProjectFlowTemplateNoteSerializer(ModelSerializer):
    files = ProjectFlowTemplateNoteAttachmentSerializer(many=True, read_only=True, source='ProjectFlowTemplateNoteAttachment_project_flow_template_note_related_ProjectFlowTemplateNote')
    created_user = serializers.SerializerMethodField()
    class Meta:
        model = ProjectFlowTemplateNote
        fields = "__all__"
        read_only_fields = ['id', "created_date", 'updated_date' ]

    def get_created_user(self, obj):
        request = self.context.get("request")  
        return get_user_data(obj, "created_user", request)  

# class ProjectFlowTemplateAttachmentSerializer(ModelSerializer):
 
#     class Meta:
#       model = ProjectFlowTemplateAttachment
#       fields = "__all__"
#       read_only_fields = ['id', "created_date" ]





# class CreateProjectFlowTemplateAttachmentSerializer(ModelSerializer):

 
#     file = serializers.FileField(required=False)


#     class Meta:
#       model = ProjectFlowTemplateAttachment
#       fields = "__all__"
#       read_only_fields = ['id', "created_date" ]
 
    
#     def validate(self, attrs):

#       request = self.context.get('request')
#       files = request.FILES.getlist('file[]')

#       if not files:  # Check if no files are provided
#         raise serializers.ValidationError({"file[]": "This field is required and cannot be empty."})
#       return attrs    

#     def create(self, validated_data):
#         request = self.context.get('request')

#         files = request.FILES.getlist('file[]')  # Retrieve file list

#         attachments = [
#             ProjectFlowTemplateAttachment.objects.create(**validated_data, file=file)
#             for file in files
#         ]
#         return attachments
#         # return ProjectFlowTemplateAttachment.objects.filter(id__in=[a.id for a in attachments])  # Return queryset

#     def to_representation(self, instance):
#         request = self.context.get("request")  # Get request safely
#         representation = super().to_representation(instance)

#         if instance.file:
#             file_url = instance.file.url
#             if request:
#                 file_url = request.build_absolute_uri(file_url)

#             representation["file"] = file_url  # Ensure full URL

#         return representation


class StepTemplateNoteAttachmentSerializer(ModelSerializer):
 
    class Meta:
      model = StepTemplateNoteAttachment
      fields = "__all__"
      read_only_fields = ['id', "created_date" ]



class CreateStepTemplateNoteAttachmentSerializer(ModelSerializer):

 
    file = serializers.FileField(required=False)


    class Meta:
      model = StepTemplateNoteAttachment
      fields = "__all__"
      read_only_fields = ['id', "created_date" ]



    def validate(self, attrs):

      request = self.context.get('request')
      files = request.FILES.getlist('file[]')

      if not files:  # Check if no files are provided
        raise serializers.ValidationError({"file[]": "This field is required and cannot be empty."})
      return attrs
    
 

    def create(self, validated_data):
        request = self.context.get('request')

        files = request.FILES.getlist('file[]')  # Retrieve file list

        attachments = [
            StepTemplateNoteAttachment.objects.create(**validated_data, file=file)
            for file in files
        ]

        return attachments
        # return StepTemplateNoteAttachment.objects.filter(id__in=[a.id for a in attachments])  # Return queryset


    def to_representation(self, instance):
        request = self.context.get("request")  # Get request safely
        representation = super().to_representation(instance)

        if instance.file:
            file_url = instance.file.url
            if request:
                file_url = request.build_absolute_uri(file_url)

            representation["file"] = file_url  # Ensure full URL

        return representation



class CreateOrGetOrPutObjectStepTemplateNoteSerializer(ModelSerializer):
    files = StepTemplateNoteAttachmentSerializer(many=True, read_only=True, source='StepTemplateNoteAttachment_step_template_note_StepTemplateNote')
                                                                                    
    class Meta:
      model = StepTemplateNote
      fields = "__all__"
      read_only_fields = ['id', "created_date", "updated_date"]

    def create(self, validated_data):
        obj = super().create(validated_data)  # Create StepTemplateNote instance
        file_list = self.context["request"].FILES.getlist("file[]")  # Get file list

        created_files = []  # To hold the created attachments

        if file_list:
            for file in file_list:
                attachment = StepTemplateNoteAttachment.objects.create(
                    step_template_note=obj,
                    file=file,
                )
                created_files.append(attachment)

        # Manually set the attachments field to return only the created attachments
        obj.files = created_files
        return obj
 
    def update(self, obj, validated_data):
        obj = super().update(obj, validated_data)  # Update StepTemplateNote instance
        request = self.context.get("request")
        files = request.FILES.getlist("file[]") if request else []
        for file in files:
            StepTemplateNoteAttachment.objects.create(
                step_template_note=obj, file=file
            )
        return obj
    

class StepTemplateNoteSerializer(ModelSerializer):
    files = StepTemplateNoteAttachmentSerializer(many=True, read_only=True, source='StepTemplateNoteAttachment_step_template_note_StepTemplateNote')
    step_note_user = serializers.SerializerMethodField()

    class Meta:
      model = StepTemplateNote
      fields = "__all__"
      read_only_fields = ['id', "created_date", "updated_date"]


    def get_step_note_user(self, obj):
            request = self.context.get("request")  
            return get_user_data(obj, "step_note_user", request)  


class CreateOrGetOrPutObjectProjectFlowTemplateSeriallizer(ModelSerializer):
    # files = ProjectFlowTemplateAttachmentSerializer(many=True, read_only=True, source='ProjectFlowTemplateAttachment_project_flow_template_related_ProjectFlowTemplate')

    class Meta:
      model = ProjectFlowTemplate
      fields = "__all__"
      read_only_fields = ['id', "created_date"]


    # def create(self, validated_data):
    #     obj = super().create(validated_data)  # Create StepTemplateNote instance
    #     file_list = self.context["request"].FILES.getlist("file[]")  # Get file list

    #     created_files = []  # To hold the created attachments

    #     if file_list:
    #         for file in file_list:
    #             attachment = ProjectFlowTemplateAttachment.objects.create(
    #                 project_flow_template=obj,
    #                 file=file,
    #             )
    #             created_files.append(attachment)

    #     # Manually set the attachments field to return only the created attachments
    #     obj.files = created_files
    #     return obj

    # def update(self, obj, validated_data):
    #     obj = super().update(obj, validated_data)  # Update StepTemplateNote instance
    #     request = self.context.get("request")
    #     files = request.FILES.getlist("file[]") if request else []
    #     for file in files:
    #         ProjectFlowTemplateAttachment.objects.create(
    #             project_flow_template=obj, file=file
    #         )
    #     return obj




class ProjectFlowTemplateSeriallizer(ModelSerializer):

    class Meta:
      model = ProjectFlowTemplate
      fields = "__all__"
      read_only_fields = ['id', "created_date", "updated_date"]



 
 


# class createStepTemplateAttachmentSerializer(ModelSerializer):

#     file = serializers.FileField( required=False )


#     class Meta:
#       model = StepTemplateAttachment
#       fields = "__all__"
#       read_only_fields = ['id', "created_date"]


#     def validate(self, attrs):

#       request = self.context.get('request')
#       files = request.FILES.getlist('file[]')

#       if not files:  # Check if no files are provided
#         raise serializers.ValidationError({"file[]": "This field is required and cannot be empty."})
#       return attrs

#     def create(self, validated_data):
#         request = self.context.get('request')

#         files = request.FILES.getlist('file[]')  # Retrieve file list

#         attachments = []
#         for file in files:
#             attachment = StepTemplateAttachment.objects.create(**validated_data, file=file)
#             attachments.append(attachment)

#         return attachments
#         # attachment_ids = []
#         # for attachment in attachments:
#         #     attachment_ids.append(attachment.id)

#         # return StepTemplateAttachment.objects.filter(id__in=attachment_ids)

#     def to_representation(self, instance):
#         request = self.context.get("request")  # Get request safely
#         representation = super().to_representation(instance)

#         if instance.file:
#             file_url = instance.file.url
#             if request:
#                 file_url = request.build_absolute_uri(file_url)

#             representation["file"] = file_url  # Ensure full URL

#         return representation





# class StepTemplateAttachmentSerializer(ModelSerializer):
 
#     class Meta:
#       model = StepTemplateAttachment
#       fields = "__all__"
#       read_only_fields = ['id', "created_date"]

 




class CreateOrGetOrPutObjectStepTemplateSerializer(ModelSerializer):

    # files = StepTemplateAttachmentSerializer(many=True, read_only=True, source='StepTemplateAttachment_step_template_StepTemplate')
    show_to_client = serializers.BooleanField(default=True)

    class Meta:
      model = StepTemplate
      fields = "__all__"
      read_only_fields = ['id', "created_date", "updated_date", "sorted_weight"]

 
    # def create(self, validated_data):
    #     obj = super().create(validated_data)  # Create StepTemplateNote instance
    #     file_list = self.context["request"].FILES.getlist("file[]")  # Get file list

    #     created_files = []  # To hold the created attachments

    #     if file_list:
    #         for file in file_list:
    #             attachment = StepTemplateAttachment.objects.create(
    #                 step_template=obj,
    #                 file=file,
    #             )
    #             created_files.append(attachment)

    #     # Manually set the attachments field to return only the created attachments
    #     obj.files = created_files
    #     return obj

    # def update(self, obj, validated_data):
    #     obj = super().update(obj, validated_data)  # Update StepTemplateNote instance
    #     request = self.context.get("request")
    #     files = request.FILES.getlist("file[]") if request else []
    #     for file in files:
    #         StepTemplateAttachment.objects.create(
    #             step_template=obj, file=file
    #         )
    #     return obj



 

class StepTemplateSerializer(ModelSerializer):

    class Meta:
      model = StepTemplate
      fields = "__all__"
      read_only_fields = ['id', "created_date", "updated_date", "sorted_weight"]

 