from django.shortcuts import render
from .models import (HomeSection, AboutUs, WhyUs, FeatureWhyUs, ProductSection, Product,
                      OurServicesSection, Service, OurVision, Focus, OurClient, OurClientSection,
                      CompnayIfRight, Footer, SocialMedia
                    )
from rest_framework.response import Response
from rest_framework import viewsets
from collections import namedtuple
from .my_serializer import TimelineSerializer, ProductSerializer
from rest_framework.exceptions import NotFound
from rest_framework.views import APIView
from rest_framework import status

from .my_serializer import (FooterSerializer, SocialMediaSerializer)


from projectFlowApp.models.project_type_models import ProjectType
from siteusersApp.models import ProjectTypeSection




class FooterView(APIView):
    permission_classes = []
    def get(self, request):
        footer_obj, created = Footer.objects.get_or_create(id=1)


        serializer = FooterSerializer(footer_obj, many=False,  context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)


class SocialMediaView(APIView):
    permission_classes = []
    def get(self, request):
        socialmedia_obj, create = SocialMedia.objects.get_or_create(id=1)
        serializer = SocialMediaSerializer(socialmedia_obj, many=False,  context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)



class ProductDetailView(APIView):
    permission_classes = []
    def get(self, request, slug, format=None):
        try:
            product = Product.objects.get(prod_slog=slug)
        except Product.DoesNotExist:
            raise NotFound(detail="Product not found")

        serializer = ProductSerializer(product,  context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)








Timeline = namedtuple('Timeline', ('home_section',
                                    'about_us',
                                    'why_us',
                                    'produc_sec',
                                    'feature_whayus',
                                    'products',
                                    'services',
                                    'our_services_section',   
                                    'our_vision',
                                    'focus_section',
                                    'our_clients',
                                    'our_client_sec',
                                    'comp_if_right',
                                    'projects_type_section', 
                                    'projects_type_list',
                                    ))



class Index(viewsets.ViewSet):
    permission_classes = []
    def retrieve(self, request):
        home_section_obj, created = HomeSection.objects.get_or_create(id=1)
        about_us_obj , created = AboutUs.objects.get_or_create(id=1)
        why_us_obj , created = WhyUs.objects.get_or_create(id=1)
        produc_sec_obj , created = ProductSection.objects.get_or_create(id=1)
        features_why_us_list = FeatureWhyUs.objects.all()
        products_list = Product.objects.all()
        services_list = Service.objects.all()
        services_sections_obj, created = OurServicesSection.objects.get_or_create(id=1)
        our_vision_obj, created = OurVision.objects.get_or_create(id=1)
        focus_section_obj , created = Focus.objects.get_or_create(id=1)
        our_client_sec_obj , created = OurClientSection.objects.get_or_create(id=1)
        our_clients_list = OurClient.objects.all()
        comp_if_right_obj , created = CompnayIfRight.objects.get_or_create(id=1)
        projects_type_section_obj , created = ProjectTypeSection.objects.get_or_create(id=1)
        projects_type_list_qs = ProjectType.objects.filter(is_published=True)

        timeline = Timeline(
            home_section=home_section_obj,    
            about_us=about_us_obj,            
            why_us=why_us_obj,
            produc_sec=produc_sec_obj,
            feature_whayus=features_why_us_list,	
            products = products_list,
            services = services_list,
            our_services_section = services_sections_obj,
            our_vision = our_vision_obj,
            focus_section  = focus_section_obj,
            our_client_sec = our_client_sec_obj,
            our_clients = our_clients_list,
            comp_if_right = comp_if_right_obj,
            projects_type_section = projects_type_section_obj,
            projects_type_list = projects_type_list_qs,
        )
        serializer = TimelineSerializer(timeline, context={'request': request})
        return Response(serializer.data)






