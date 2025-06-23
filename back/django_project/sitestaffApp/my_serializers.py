
from siteusersApp.models import (  HomeSection, AboutUs, WhyUs, FeatureWhyUs, ProductSection,
								  Product, OurServicesSection, Service, OurVision , Focus, OurClientSection, OurClient,
								  CompnayIfRight, Footer, SocialMedia, ProjectTypeSection, ProductExtraImages, ProductAttachment
								  )
from rest_framework import serializers



class ProductAttachmentSerializer(serializers.ModelSerializer):
	file = serializers.FileField(required=False)
	
	class Meta:
		model = ProductAttachment
		fields = "__all__"
		read_only_fields = ['id']


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
			attachment = ProductAttachment.objects.create(**validated_data, file=file)
			attachments.append(attachment)

		return attachments




class ProductExtraImagesSerializer(serializers.ModelSerializer):
	file = serializers.FileField(required=False)
	class Meta:
		model = ProductExtraImages
		fields = "__all__"
		read_only_fields = ['id']

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
			attachment = ProductExtraImages.objects.create(**validated_data, file=file)
			attachments.append(attachment)

		return attachments


from django.core.exceptions import ValidationError
from django.db import transaction

class ProductSerializer(serializers.ModelSerializer):
	extra_images = ProductExtraImagesSerializer(many=True, read_only=True, source="ProductExtraImages_product")
	attachments = ProductAttachmentSerializer(many=True, read_only=True,  source="ProductAttachment_product")

 
	class Meta:
		model = Product
		fields =  "__all__"
		read_only_fields  = ['id','prod_slog', 'prod_created_date', 'prod_updated_date' ]	


	def create(self, validated_data):
		request = self.context.get('request')
		extra_image_files = request.FILES.getlist('extra_images[]') if request else []
		attachment_files = request.FILES.getlist("attachment[]") if request else []

		try:
			with transaction.atomic():  # Ensures all operations are either committed or rolled back
				obj = super().create(validated_data)
				
				extra_images_list = []
				for extra_image in extra_image_files:
					extra_image_obj = ProductExtraImages(product=obj, file=extra_image)
					extra_image_obj.full_clean()  # Validate before saving
					extra_image_obj.save()
					extra_images_list.append(extra_image_obj)

				attachment_list = []
				for attachment in attachment_files:
					attachment_obj = ProductAttachment(file=attachment, product=obj)
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
					extra_image_obj = ProductExtraImages(product=obj, file=extra_image)
					extra_image_obj.full_clean()  # Validate before saving
					extra_image_obj.save()
					extra_images_list.append(extra_image_obj)

				attachment_list = []
				for attachment in attachment_files:
					attachment_obj = ProductAttachment(file=attachment, product=obj)
					attachment_obj.full_clean()  # Validate before saving
					attachment_obj.save()
					attachment_list.append(attachment_obj)

				obj.attachments = attachment_list  # Use set() for ManyToMany fields
				obj.extra_images = extra_images_list

				return obj 

		except ValidationError as e:
			raise serializers.ValidationError({'error': str(e)})  # Return error to serializer instead of raising 500 error
			












class ProjectTypeSectionSerializer(serializers.ModelSerializer):
	class Meta:
		model =ProjectTypeSection
		fields = "__all__"
		read_only_fields = ['id']



class FooterSectionSerializer(serializers.ModelSerializer):
	class Meta:
		model = Footer
		fields = '__all__'
		read_only_fields  = ['id']


class SocialMediaSerializer(serializers.ModelSerializer):
	class Meta:
		model = SocialMedia
		fields =  '__all__'
		read_only_fields  = ['id']





class HomeSectionSerializer(serializers.ModelSerializer):
	class Meta:
		model = HomeSection
		fields = ['id', 'home_sec_title', 'home_sec_details', 'home_sec_image', 'home_sec_title_ar', 'home_sec_details_ar' ]
		read_only_fields  = ['id']




class AboutUsSectionSerializer(serializers.ModelSerializer):
	class Meta:
		model = AboutUs
		fields =  "__all__"
		read_only_fields  = ['id','about_us_created_date', 'about_us_updated_date', ]
		


class WhyUsSectionSerializer(serializers.ModelSerializer):
	class Meta:
		model = WhyUs
		fields =  "__all__"
		read_only_fields  = ['id','why_us_created_date', 'why_us_updated_date', ]




class FeatureWhyUsSectionSerializer(serializers.ModelSerializer):
	class Meta:
		model = FeatureWhyUs
		fields =  "__all__"
		read_only_fields  = ['id','feat_whyus_created_date', 'feat_whyus_updated_date', ]




class ProductSectionSerializer(serializers.ModelSerializer):
	class Meta:
		model = ProductSection
		fields =  "__all__"
		read_only_fields  = ['id','prd_sec_created_date', 'prd_sec_updated_date', ]		









class OurServicesSectionSerializer(serializers.ModelSerializer):
	class Meta:
		model = OurServicesSection
		fields =  "__all__"
		read_only_fields  = ['id','servic_sec_created_date', 'servic_sec_updated_date', 'prod_updated_date' ]	





class ServiceSerializer(serializers.ModelSerializer):
	class Meta:
		model = Service
		fields =  "__all__"
		read_only_fields  = ['id','service_created_date', 'service_updated_date' ]	




class OurVisionSerializer(serializers.ModelSerializer):
	class Meta:
		model = OurVision
		fields =  "__all__"
		read_only_fields  = ['id','our_vision_created_date', 'our_vision_updated_date' ]	



class FocusSecSerializer(serializers.ModelSerializer):
	class Meta:
		model = Focus
		fields =  "__all__"
		read_only_fields  = ['id','focus_created_date', 'focus_updated_date' ]	







class OurClientSectionSerializer(serializers.ModelSerializer):
	class Meta:
		model = OurClientSection
		fields =  "__all__"
		read_only_fields  = ['id','our_client_sec_created_date', 'our_client_sec_updated_date' ]



class OurClientSerializer(serializers.ModelSerializer):
	class Meta:
		model = OurClient
		fields =  "__all__"
		read_only_fields  = ['id','our_client_created_date', 'our_client_updated_date' ]








class CompnayIfRightSecSerializer(serializers.ModelSerializer):
	class Meta:
		model = CompnayIfRight
		fields =  "__all__"
		read_only_fields  = ['id','company_if_right_created_date', 'company_if_right_updated_date' ]