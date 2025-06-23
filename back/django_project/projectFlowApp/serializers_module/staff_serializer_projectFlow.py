



from rest_framework import serializers

from django.conf import settings
from ..models.project_flow_models import (
    ProjectFlow, ProjectFlowAttachment, ProjectFlowNote, ProjectFlowNoteAttachment, ProjectFlowStep,
     ProjectFlowStepNote, ProjectFlowStepNoteAttachment, ProjectFlowSubStep, 
    ProjectFlowSubStepNote, ProjectFlowSubStepNoteAttachment , InstalledProduct  , InstalledProductType               
    )

 

from django.contrib.auth import get_user_model
User = get_user_model()


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



class InstalledProductTypeSerializer(serializers.ModelSerializer):

    class Meta:
        model = InstalledProductType
        fields = "__all__"
        read_only_fields = ['id']


class InstalledProductSerializer(serializers.ModelSerializer):

    product_info = serializers.SerializerMethodField()

    class Meta:
        model = InstalledProduct
        fields = "__all__"
        read_only_fields = ['id']


    def get_product_info(self, obj):
        product_type = getattr(obj, 'installed_product_type', None)
        if product_type:
            return {
                'id': getattr(product_type, 'id', None),
                'name': getattr(product_type, 'product_name', None),
                'name_ar': getattr(product_type, 'product_name_ar', None)
            }
        return None


            
            
 



class ProjectFlowSubStepNoteAttachmentSerializer(serializers.ModelSerializer):

    file = serializers.FileField(required=False)

    class Meta:
        model = ProjectFlowSubStepNoteAttachment
        fields = "__all__"
        read_only_fields = ["id", "file_name", "created_data"]


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
            attachment = ProjectFlowSubStepNoteAttachment.objects.create(**validated_data, file=file)
            attachments.append(attachment)

        return attachments





class GetListProjectFlowSubStepNoteSerializer(serializers.ModelSerializer):


    files = ProjectFlowSubStepNoteAttachmentSerializer(many=True, read_only=True, source='ProjectFlowSubStepNoteAttachment_sub_step_note_related_ProjectFlowSubStepNote')
    sub_step_note_user = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = ProjectFlowSubStepNote
        fields = "__all__"
        read_only_fields = [ field.name  for field in ProjectFlowSubStepNote._meta.fields ]
    def get_sub_step_note_user(self, obj):
            request = self.context.get("request")  # Get request from serializer context
            return get_user_data(obj, "sub_step_note_user", request)  # Pass request explicitly



class ProjectFlowSubStepNoteSerializer(serializers.ModelSerializer):


    files = ProjectFlowSubStepNoteAttachmentSerializer(many=True, read_only=True, source='ProjectFlowSubStepNoteAttachment_sub_step_note_related_ProjectFlowSubStepNote')

    class Meta:
        model = ProjectFlowSubStepNote
        fields = "__all__"
        read_only_fields = ['id', "created_date", "updated_date"]


    def create(self, validated_data):
        obj = super().create(validated_data)  # Create StepTemplateNote instance

        request = self.context.get("request")
        
        files = request.FILES.getlist("file[]") if request else []

        attachments = []
        for file in files:
            attachment = ProjectFlowSubStepNoteAttachment.objects.create(
                sub_step_note=obj, file=file
            )
            attachments.append(attachment)

        obj.files = attachments  # Attach created files
        return obj



    def update(self, obj, validated_data):
        obj = super().update(obj, validated_data)  # Update StepTemplateNote instance
        request = self.context.get("request")
        files = request.FILES.getlist("file[]") if request else []
        for file in files:
            ProjectFlowSubStepNoteAttachment.objects.create(
                sub_step_note=obj, file=file
            )
        return obj






class ProjectFlowSubStepSerializer(serializers.ModelSerializer):

 
    class Meta:
        model = ProjectFlowSubStep
        fields = "__all__"
        read_only_fields = ['id', "sorted_weight", "created_date", "updated_date"]







class ProjectFlowStepNoteAttachmentSerializer(serializers.ModelSerializer):

    file = serializers.FileField(required=False)

    class Meta:
        model = ProjectFlowStepNoteAttachment
        fields = "__all__"
        read_only_fields = ['id', 'file_name', 'created_data']

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
            attachment = ProjectFlowStepNoteAttachment.objects.create(**validated_data, file=file)
            attachments.append(attachment)

        return attachments


    def to_representation(self, instance):
        request = self.context.get("request")  # Get request safely
        representation = super().to_representation(instance)

        if instance.file:
            file_url = instance.file.url
            if request:
                file_url = request.build_absolute_uri(file_url)

            representation["file"] = file_url  # Ensure full URL

        return representation



 




class GetListProjectFlowStepNoteSerializer(serializers.ModelSerializer):

    files = ProjectFlowStepNoteAttachmentSerializer(many=True, read_only=True, source='ProjectFlowStepNoteAttachment_project_flow_step_note_related_ProjectFlowStepNote')
    step_note_user = serializers.SerializerMethodField(read_only=True)

    def get_step_note_user(self, obj):
            request = self.context.get("request")  # Get request from serializer context
            return get_user_data(obj, "step_note_user", request)  # Pass request explicitly

    class Meta:
        model = ProjectFlowStepNote
        fields = "__all__"
        read_only_fields = ["id", "created_date", "updated_date"]






class ProjectFlowStepNoteSerializer(serializers.ModelSerializer):

    files = ProjectFlowStepNoteAttachmentSerializer(many=True, read_only=True, source='ProjectFlowStepNoteAttachment_project_flow_step_note_related_ProjectFlowStepNote')


    class Meta:
        model = ProjectFlowStepNote
        fields = "__all__"
        read_only_fields = ["id", "created_date", "updated_date"]
 

    def create(self, validated_data):
        obj = super().create(validated_data)  # Create StepTemplateNote instance
        request = self.context.get("request")
        
        files = request.FILES.getlist("file[]") if request else []

        attachments = []
        for file in files:
            attachment = ProjectFlowStepNoteAttachment.objects.create(
                project_flow_step_note=obj, file=file
            )
            attachments.append(attachment)

        obj.files = attachments  # Attach created files
        return obj

    def update(self, obj, validated_data):
        obj = super().update(obj, validated_data)  # Update StepTemplateNote instance
        request = self.context.get("request")
        files = request.FILES.getlist("file[]") if request else []
        for file in files:
            ProjectFlowStepNoteAttachment.objects.create(
                project_flow_step_note=obj, file=file
            )
        return obj

 


class ProjectFlowStepSerializer(serializers.ModelSerializer):

    class Meta:
        model = ProjectFlowStep
        fields = "__all__"
        read_only_fields = ['id', "sorted_weight", "created_date", "updated_date"]

  



class ProjectFlowNoteAttachmentSerializer(serializers.ModelSerializer):

    file = serializers.FileField(required=False)

    class Meta:
        model = ProjectFlowNoteAttachment

        fields = "__all__"
        read_only_fields = ["id", "file_name", "created_data"]


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
            attachment = ProjectFlowNoteAttachment.objects.create(**validated_data, file=file)
            attachments.append(attachment)

        return attachments


    def to_representation(self, instance):
        request = self.context.get("request")  # Get request safely
        representation = super().to_representation(instance)

        if instance.file:
            file_url = instance.file.url
            if request:
                file_url = request.build_absolute_uri(file_url)

            representation["file"] = file_url  # Ensure full URL

        return representation





class CreateOrPutProjectFlowNoteSerializer(serializers.ModelSerializer):

    class Meta:
        model = ProjectFlowNote
        fields = "__all__"
        read_only_fields = ['id', "created_date", "updated_date"]


 
    def create(self, validated_data):
        obj = super().create(validated_data)  
        request = self.context.get("request")
        
        files = request.FILES.getlist("file[]") if request else []

        attachments = []
        for file in files:
            attachment = ProjectFlowNoteAttachment.objects.create(
                project_flow_note=obj, file=file
            )
            attachments.append(attachment)

        obj.files = attachments  # Attach created files
        return obj

    def update(self, obj, validated_data):
        obj = super().update(obj, validated_data)  # Update StepTemplateNote instance
        request = self.context.get("request")
        files = request.FILES.getlist("file[]") if request else []
        for file in files:
            ProjectFlowNoteAttachment.objects.create(
                project_flow_note=obj, file=file
            )
        return obj


 
class ProjectFlowNoteSerializer(serializers.ModelSerializer):
    created_user = serializers.SerializerMethodField()
    files = ProjectFlowNoteAttachmentSerializer(many=True, read_only=True, source='ProjectFlowNoteAttachment_project_flow_note_related_ProjectFlowNote')

    class Meta:
        model = ProjectFlowNote
        fields = "__all__"
        read_only_fields = ['id', "created_date", "updated_date"]

    def get_created_user(self, obj):
        request = self.context.get('request')  # Get the request object from serializer context

        if obj.created_user:
            PRF_image = None

            if hasattr(obj.created_user, 'profile_prf_user_relaed_useraccount'):
                profile = obj.created_user.profile_prf_user_relaed_useraccount
                if profile.PRF_image:
                    PRF_image = profile.PRF_image.url
                    if request:
                        PRF_image = request.build_absolute_uri(PRF_image)  # Get full URL dynamically

            return {
                "is_staff": obj.created_user.is_staff,
                "full_name": f"{obj.created_user.first_name} {obj.created_user.last_name}",
                "id": obj.created_user.id,
                'PRF_image': PRF_image
            }
 
        return None
 



class CreateProjectFlowAttachmentSerializer(serializers.ModelSerializer):
    file = serializers.FileField(required=False)

    class Meta:
        model = ProjectFlowAttachment
        fields = "__all__"
        read_only_fields = ['id', 'created_data', 'file_name']

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
            attachment = ProjectFlowAttachment.objects.create(**validated_data, file=file)
            attachments.append(attachment)

        return attachments


    def to_representation(self, instance):
        request = self.context.get("request")  # Get request safely
        representation = super().to_representation(instance)

        if instance.file:
            file_url = instance.file.url
            if request:
                file_url = request.build_absolute_uri(file_url)

            representation["file"] = file_url  # Ensure full URL

        return representation


 

class ProjectFlowAttachmentSerializer(serializers.ModelSerializer):

    class Meta:
        model = ProjectFlowAttachment
        fields = "__all__"
        read_only_fields = ['id', 'created_data', 'file_name']




class CreateOrPutObjectProjectFlowSerializer(serializers.ModelSerializer):

    files = ProjectFlowAttachmentSerializer(many=True, read_only=True, source='ProjectFlowAttachment_project_flow_related_ProjectFlow')

    class Meta:
        model = ProjectFlow
        fields = "__all__"
        read_only_fields = ["project_type_name", "project_type_name_ar", "created_date", "updated_date", "project_flow_slug", "project_created_user"  ]
 
    def create(self, validated_data):
        obj = super().create(validated_data)  # Create StepTemplateNote instance
        request = self.context.get("request")
        
        files = request.FILES.getlist("file[]") if request else []

        attachments = []
        for file in files:
            attachment = ProjectFlowAttachment.objects.create(
                project_flow=obj, file=file
            )
            attachments.append(attachment)

        obj.files = attachments  # Attach created files
        return obj

    def update(self, obj, validated_data):
        obj = super().update(obj, validated_data)  # Update StepTemplateNote instance
        request = self.context.get("request")
        files = request.FILES.getlist("file[]") if request else []
        for file in files:
            ProjectFlowAttachment.objects.create(
                project_flow=obj, file=file
            )
        return obj

from django.db.models import Max
from django.db.models.functions import Coalesce


class GetObjectProjectFlowSerializer(serializers.ModelSerializer):

    project_created_user = serializers.SerializerMethodField()
    project_user = serializers.SerializerMethodField()
    files = ProjectFlowAttachmentSerializer(many=True, read_only=True, source='ProjectFlowAttachment_project_flow_related_ProjectFlow')
    project_type = serializers.SerializerMethodField()
    latest_activity = serializers.SerializerMethodField()  # Add the new field

    class Meta:
        model = ProjectFlow
        fields = "__all__"
        read_only_fields = ["project_type_name", "project_type_name_ar", "created_date", "updated_date", "project_flow_slug", "project_created_user"  ]
 


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
        if obj.project_user:  # Ensure user exists


            PRF_image = None
            if hasattr(obj.project_user, 'profile_prf_user_relaed_useraccount'):
                profile = obj.project_user.profile_prf_user_relaed_useraccount
                if profile.PRF_image:
                    request = self.context.get('request')  # Get the request object from serializer context

                    PRF_image = profile.PRF_image.url
                    if request:
                        PRF_image = request.build_absolute_uri(PRF_image)  # Get full URL dynamically



            return {
                "is_staff": obj.project_user.is_staff,
                "full_name": f"{obj.project_user.first_name} {obj.project_user.last_name}",
                "id": obj.project_user.id,
                'PRF_image': PRF_image

            }
        return None
    

    def get_project_created_user(self, obj):
        if obj.project_created_user:  # Ensure user exists

            PRF_image = None
            if hasattr(obj.project_created_user, 'profile_prf_user_relaed_useraccount'):
                profile = obj.project_created_user.profile_prf_user_relaed_useraccount
                if profile.PRF_image:
                    request = self.context.get('request')  # Get the request object from serializer context

                    PRF_image = profile.PRF_image.url
                    if request:
                        PRF_image = request.build_absolute_uri(PRF_image)  # Get full URL dynamically

            return {
                "is_staff": obj.project_created_user.is_staff,
                "full_name": f"{obj.project_created_user.first_name} {obj.project_created_user.last_name}",
                "id": obj.project_created_user.id,
                'PRF_image': PRF_image
            }
        return None



    
    def get_project_type(self, obj):
        if obj.project_type:
            return{
                'project_type_id' : obj.project_type.id,
                "project_type_name" : obj.project_type.project_name,
                "project_type_name_ar" :  obj.project_type.project_name_ar
            }


        return None







class GetListProjectFlowSerializer(serializers.ModelSerializer):

    project_created_user = serializers.SerializerMethodField()
    project_user = serializers.SerializerMethodField()
    project_type = serializers.SerializerMethodField()
    latest_activity = serializers.SerializerMethodField()  # Add the new field

    class Meta:
        model = ProjectFlow
        fields = "__all__"
        read_only_fields = ["project_type_name", "project_type_name_ar", "created_date", "updated_date", "project_flow_slug", "project_created_user"  ]

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
        if obj.project_user:  # Ensure user exists


            PRF_image = None
            if hasattr(obj.project_user, 'profile_prf_user_relaed_useraccount'):
                profile = obj.project_user.profile_prf_user_relaed_useraccount
                if profile.PRF_image:
                    request = self.context.get('request')  # Get the request object from serializer context

                    PRF_image = profile.PRF_image.url
                    if request:
                        PRF_image = request.build_absolute_uri(PRF_image)  # Get full URL dynamically



            return {
                "is_staff": obj.project_user.is_staff,
                "full_name": f"{obj.project_user.first_name} {obj.project_user.last_name}",
                "id": obj.project_user.id,
                'PRF_image': PRF_image

            }
        return None
    

    def get_project_created_user(self, obj):
        if obj.project_created_user:  # Ensure user exists

            PRF_image = None
            if hasattr(obj.project_created_user, 'profile_prf_user_relaed_useraccount'):
                profile = obj.project_created_user.profile_prf_user_relaed_useraccount
                if profile.PRF_image:
                    request = self.context.get('request')  # Get the request object from serializer context

                    PRF_image = profile.PRF_image.url
                    if request:
                        PRF_image = request.build_absolute_uri(PRF_image)  # Get full URL dynamically

            return {
                "is_staff": obj.project_created_user.is_staff,
                "full_name": f"{obj.project_created_user.first_name} {obj.project_created_user.last_name}",
                "id": obj.project_created_user.id,
                'PRF_image': PRF_image
            }
        return None




    def get_project_type(self, obj):
        if obj.project_type:

            return{
                'project_type_id' : obj.project_type.id,
                "project_type_name" : obj.project_type.project_name,
                "project_type_name_ar" :  obj.project_type.project_name_ar
            }
        return None
