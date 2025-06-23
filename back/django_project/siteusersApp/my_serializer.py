from .models import (HomeSection, AboutUs, WhyUs, FeatureWhyUs, ProductSection,
                      Product , Service, OurServicesSection, OurVision, Focus,
					  OurClient, OurClientSection, CompnayIfRight, Footer, SocialMedia , ProductAttachment, ProductExtraImages
                      )


from siteusersApp.models import ProjectTypeSection
from projectFlowApp.models.project_type_models import ProjectType


from rest_framework import serializers



class ProjectTypeSerializer(serializers.ModelSerializer):
	class Meta:
		model = ProjectType
		fields = "__all__"
		read_only_fields = ['id']



class ProjectTypeSectionSerializer(serializers.ModelSerializer):

	class Meta:
		model = ProjectTypeSection
		fields = "__all__"
		read_only_fields = ['id']




class SocialMediaSerializer(serializers.ModelSerializer):
	class Meta:
		model = SocialMedia
		fields = '__all__'



class FooterSerializer(serializers.ModelSerializer):
	class Meta:
		model = Footer
		fields = '__all__'



class CompnayIfRightSerializer(serializers.ModelSerializer):
	class Meta:
		model = CompnayIfRight
		fields = '__all__'

class OurClientSerializer(serializers.ModelSerializer):
	class Meta:
		model = OurClient
		fields = '__all__'



class OurClientSectionSerializer(serializers.ModelSerializer):
	class Meta:
		model = OurClientSection
		fields = '__all__'


class FocusSectionSerializer(serializers.ModelSerializer):
	class Meta:
		model = Focus
		fields = '__all__'
		

class OurVisionSectionSerializer(serializers.ModelSerializer):
	class Meta:
		model = OurVision
		fields = '__all__'


class OurServicesSectionSerializer(serializers.ModelSerializer):
	class Meta:
		model = OurServicesSection
		fields = '__all__'
          

class ServiceSerializer(serializers.ModelSerializer):
	class Meta:
		model = Service
		fields = ('id','service_name', 'service_name_ar')
          



class HomeSectionSerializer(serializers.ModelSerializer):
	class Meta:
		model = HomeSection
		fields = '__all__'

class AboutUsSerializer(serializers.ModelSerializer):
	class Meta:
		model = AboutUs        
		fields = '__all__'            


class FeatureWhyUsSerializer(serializers.ModelSerializer):
   class Meta:
    model=FeatureWhyUs
    fields = '__all__'


class WhyUsSerializer(serializers.ModelSerializer):
    class Meta:
        model = WhyUs        
        fields = '__all__'














class ProductAttachmentSerializer(serializers.ModelSerializer):
	file = serializers.FileField(required=False)
	
	class Meta:
		model = ProductAttachment
		fields = "__all__"
		read_only_fields = ['id']

 

class ProductExtraImagesSerializer(serializers.ModelSerializer):
	file = serializers.FileField(required=False)
	class Meta:
		model = ProductExtraImages
		fields = "__all__"
		read_only_fields = ['id']

 
 





class ProductSerializer(serializers.ModelSerializer):
   
	extra_images = ProductExtraImagesSerializer(many=True, read_only=True, source="ProductExtraImages_product")
	attachments = ProductAttachmentSerializer(many=True, read_only=True,  source="ProductAttachment_product")

	class Meta:
		model=Product
		fields = '__all__'











class ProductSectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductSection        
        fields = '__all__'
  

class TimelineSerializer(serializers.Serializer):
	home_section = HomeSectionSerializer(many=False)
	about_us = AboutUsSerializer(many=False)
	why_us = WhyUsSerializer(many=False)
	produc_sec = ProductSectionSerializer(many=False)
	feature_whayus = FeatureWhyUsSerializer(many=True)
	products = ProductSerializer(many=True)
	services = ServiceSerializer(many=True)
	our_services_section = OurServicesSectionSerializer(many=False)
	our_vision= OurVisionSectionSerializer(many=False)
	focus_section = FocusSectionSerializer(many=False)
	our_client_sec = OurClientSectionSerializer(many=False)
	our_clients = OurClientSerializer(many=True)
	comp_if_right = CompnayIfRightSerializer(many=False)
	projects_type_section = ProjectTypeSectionSerializer(many=False)
	projects_type_list = ProjectTypeSerializer(many=True)



