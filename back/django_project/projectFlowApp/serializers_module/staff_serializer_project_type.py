

from ..models.project_type_models import ProjectType , ProjectTypeExtraImages, ProjectTypeAttachment
from rest_framework import serializers











class ProjectTypeAttachmentSerializer(serializers.ModelSerializer):
    file = serializers.FileField(required=False)
    class Meta:
        model = ProjectTypeAttachment
        fields = "__all__"
        read_only_fields = ["id", "file_name"]


    def validate(self, attrs):
        request = self.context.get("request")
        files = request.FILES.getlist("file[]") 

        if not files:
            raise serializers.ValidationError({"file[]" : "this field is required!"})
        return attrs

    def create(self, validated_data):
        request = self.context.get("request") 
        files = request.FILES.getlist("file[]") if request else []

        attachments = []
        for file in files:
            obj = ProjectTypeAttachment.objects.create(**validated_data, file=file)
            attachments.append(obj)
        return attachments
    
        # attachment_ids = []
        # for obj in attachments:
        #     attachment_ids.append(obj.id)

        # return ProjectTypeAttachment.objects.filter(id__in=attachment_ids)
    




class ProjectTypeExtraImagesSerializer(serializers.ModelSerializer):
    file = serializers.FileField(required=False)
    class Meta:
        model = ProjectTypeExtraImages
        fields = "__all__"
        read_only_fields = ["id", "file_name"]


    def validate(self, attrs):
        request = self.context.get('request')
        files = request.FILES.getlist('file[]')
        if not files:
            raise serializers.ValidationError({"file[]": "This field is required and cannot be empty."}) 

        return attrs
    

    def create(self, validated_data):
        request = self.context.get('request')
        files = request.FILES.getlist('file[]') if request else []

        attachments = []
        for file in files:
            attachment = ProjectTypeExtraImages.objects.create(**validated_data, file=file)
            attachments.append(attachment)

        return attachments
        # attachment_ids = []
        # for obj in attachments:
        #     attachment_ids.append(obj.id)

        # return  ProjectTypeExtraImages.objects.filter(id__in=attachment_ids)


from django.core.exceptions import ValidationError
from django.db import transaction


class ProjectTypeSerializer(serializers.ModelSerializer):
    extra_images = ProjectTypeExtraImagesSerializer(many=True, read_only=True, source="ProjectTypeExtraImages_project_type_related_ProjectType")
    attachments = ProjectTypeAttachmentSerializer(many=True, read_only=True,  source="ProjectTypeAttachment_project_name")

    class Meta:
        model = ProjectType
        fields = "__all__"
        read_only_fields = ["id", "project_slog", "created_date", "updated_date"]





    def create(self, validated_data):
        request = self.context.get('request')
        extra_image_files = request.FILES.getlist('extra_images[]') if request else []
        attachment_files = request.FILES.getlist("attachment[]") if request else []

        try:
            with transaction.atomic():  # Ensures all operations are either committed or rolled back
                obj = super().create(validated_data)
                
                extra_images_list = []
                for extra_image in extra_image_files:
                    extra_image_obj = ProjectTypeExtraImages(project_type=obj, file=extra_image)
                    extra_image_obj.full_clean()  # Validate before saving
                    extra_image_obj.save()
                    extra_images_list.append(extra_image_obj)

                attachment_list = []
                for attachment in attachment_files:
                    attachment_obj = ProjectTypeAttachment(file=attachment, project_type=obj)
                    attachment_obj.full_clean()  # Validate before saving
                    attachment_obj.save()
                    attachment_list.append(attachment_obj)

                obj.attachments = attachment_list  # Use set() for ManyToMany fields
                obj.extra_images = extra_images_list

                return obj  # Successfully return object after all operations

        except ValidationError as e:
            raise serializers.ValidationError({'error': str(e)})  # Return error to serializer instead of raising 500 error
        

 




    def update(self, obj, validated_data):

        request = self.context.get('request')
        extra_image_files = request.FILES.getlist('extra_images[]') if request else []
        attachment_files = request.FILES.getlist("attachment[]") if request else []

        try:
            with transaction.atomic():  # Ensures all operations are either committed or rolled back
                obj = super().update(obj, validated_data)
                
                extra_images_list = []
                for extra_image in extra_image_files:
                    extra_image_obj = ProjectTypeExtraImages(project_type=obj, file=extra_image)
                    extra_image_obj.full_clean()  # Validate before saving
                    extra_image_obj.save()
                    extra_images_list.append(extra_image_obj)

                attachment_list = []
                for attachment in attachment_files:
                    attachment_obj = ProjectTypeAttachment(file=attachment, project_type=obj)
                    attachment_obj.full_clean()  # Validate before saving
                    attachment_obj.save()
                    attachment_list.append(attachment_obj)

                obj.attachments = attachment_list  # Use set() for ManyToMany fields
                obj.extra_images = extra_images_list

                return obj  # Successfully return object after all operations

        except ValidationError as e:
            raise serializers.ValidationError({'error': str(e)})  # Return error to serializer instead of raising 500 error
           


    
class GetListProjectTypeSerializer(serializers.ModelSerializer):
 
    class Meta:
        model = ProjectType
        fields = "__all__"
        read_only_fields = ["id", "project_slog", "created_date", "updated_date"]


 
    
 