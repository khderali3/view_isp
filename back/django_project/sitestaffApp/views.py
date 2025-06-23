from django.shortcuts import render
from rest_framework.views import APIView
from siteusersApp.models import (HomeSection, AboutUs,WhyUs, FeatureWhyUs, ProductSection, Product,
                                  OurServicesSection, Service, OurVision, Focus, OurClientSection, OurClient, CompnayIfRight,
                                  Footer, SocialMedia, ProjectTypeSection, ProductExtraImages, ProductAttachment
                                  )
from .my_serializers import (HomeSectionSerializer, AboutUsSectionSerializer,
                              WhyUsSectionSerializer, FeatureWhyUsSectionSerializer, 
                              ProductSectionSerializer, ProductSerializer, OurServicesSectionSerializer, ServiceSerializer,
                              OurVisionSerializer, FocusSecSerializer, OurClientSectionSerializer, OurClientSerializer,
                              CompnayIfRightSecSerializer, FooterSectionSerializer, SocialMediaSerializer, ProjectTypeSectionSerializer,
                              ProductExtraImagesSerializer, ProductAttachmentSerializer
                                )

from rest_framework.response import Response
from rest_framework.permissions import BasePermission
from rest_framework import status

# class IsStaffOrSuperUser(BasePermission):
#     def has_permission(self, request, view):
#         return request.user and (request.user.is_staff or request.user.is_superuser)
    
from ticketSystemStaffApp.my_utils import IsStaffOrSuperUser, HasSiteManagementPermission


class ProductAttachmentView(APIView):
    def post(self, request, product_id):

        data = request.data.copy()
        data['product'] = product_id

        serializer = ProductAttachmentSerializer(data=data, context={'request' : request})
        if serializer.is_valid():
            list_files = serializer.save()
            return Response(ProductAttachmentSerializer(list_files, many=True, context={'request': request}).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    def get(self, request, product_id, id=None):
        if id:
            try:
                obj = ProductAttachment.objects.get(id=id)
                serializer = ProductAttachmentSerializer(obj, context={'request' : request})
                return Response(serializer.data, status=status.HTTP_200_OK)
            except Exception as e :
                return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        else :
            list_obj = ProductAttachment.objects.filter(product=product_id)
            serializer = ProductAttachmentSerializer(list_obj, many=True, context={'request' : request})
            return Response(serializer.data, status=status.HTTP_200_OK)
    

    def delete(self, request,product_id, id):
        try:
            obj = ProductAttachment.objects.get(id=id)
            obj.delete()
            return Response({'message' : 'object has been deleted'}, status=status.HTTP_202_ACCEPTED)
        except Exception as e :
            return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)






class ProductExtraImagesView(APIView):
    def post(self, request, product_id):

        data = request.data.copy()
        data['product'] = product_id

        serializer = ProductExtraImagesSerializer(data=data, context={'request' : request})
        if serializer.is_valid():
            list_files = serializer.save()
            return Response(ProductExtraImagesSerializer(list_files, many=True, context={'request': request}).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    def get(self, request, product_id, id=None):
        if id:
            try:
                obj = ProductExtraImages.objects.get(id=id)
                serializer = ProductExtraImagesSerializer(obj, context={'request' : request})
                return Response(serializer.data, status=status.HTTP_200_OK)
            except Exception as e :
                return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        else :
            list_obj = ProductExtraImages.objects.filter(product=product_id)
            serializer = ProductExtraImagesSerializer(list_obj, many=True, context={'request' : request})
            return Response(serializer.data, status=status.HTTP_200_OK)
    

    def delete(self, request,product_id, id):
        try:
            obj = ProductExtraImages.objects.get(id=id)
            obj.delete()
            return Response({'message' : 'object has been deleted'}, status=status.HTTP_202_ACCEPTED)
        except Exception as e :
            return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        










class ProjectTypeSectionView(APIView):
    permission_classes = [IsStaffOrSuperUser, HasSiteManagementPermission]

    def get(self, request):
        project_type_sec_obj, created = ProjectTypeSection.objects.get_or_create(id=1)
        serializer = ProjectTypeSectionSerializer(project_type_sec_obj, context={'request':request})
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        project_type_sec_obj, created = ProjectTypeSection.objects.get_or_create(id=1)
        serializer = ProjectTypeSectionSerializer(project_type_sec_obj,data=request.data, context={'request':request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class HomeSectionView(APIView):
    permission_classes = [IsStaffOrSuperUser, HasSiteManagementPermission]

    def get(self, request):
        home_section_obj, created = HomeSection.objects.get_or_create(id=1)
        serializer = HomeSectionSerializer(home_section_obj, context={'request': self.request} )
        return Response(serializer.data)
    
    def post(self, request):
        home_section_obj, created = HomeSection.objects.get_or_create(id=1)
        serializer = HomeSectionSerializer(home_section_obj, data=request.data, context={'request': self.request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class AboutUsSectionView(APIView):
    permission_classes = [IsStaffOrSuperUser, HasSiteManagementPermission]

    def get(self, request):
        home_section_obj, created = AboutUs.objects.get_or_create(id=1)
        serializer = AboutUsSectionSerializer(home_section_obj, context={'request': self.request} )
        return Response(serializer.data)
    
    def post(self, request):
        home_section_obj, created = AboutUs.objects.get_or_create(id=1)
        serializer = AboutUsSectionSerializer(home_section_obj, data=request.data, context={'request': self.request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class WhyUsSectionView(APIView):
    permission_classes = [IsStaffOrSuperUser, HasSiteManagementPermission]

    def get(self, request):
        why_us_section_obj, created = WhyUs.objects.get_or_create(id=1)
        serializer = WhyUsSectionSerializer(why_us_section_obj, context={'request': self.request} )
        return Response(serializer.data)
    
    def post(self, request):
        why_us_section_obj, created = WhyUs.objects.get_or_create(id=1)
        serializer = WhyUsSectionSerializer(why_us_section_obj, data=request.data, context={'request': self.request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    




class FeatureWhyUsSectionView(APIView):
    permission_classes = [IsStaffOrSuperUser, HasSiteManagementPermission]

    def get(self, request, pk=None):

        if pk:
            try:
                feature_why_us = FeatureWhyUs.objects.get(pk=pk)
                serializer = FeatureWhyUsSectionSerializer(feature_why_us, context={'request': self.request})
                return Response(serializer.data)
            except FeatureWhyUs.DoesNotExist:
                return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        else:
            feature_why_us_list = FeatureWhyUs.objects.all()
            serializer = FeatureWhyUsSectionSerializer(feature_why_us_list, many=True, context={'request': self.request} )
            return Response(serializer.data)
    
    def post(self, request):
        serializer = FeatureWhyUsSectionSerializer(data=request.data, context={'request': self.request})
        if serializer.is_valid():
            serializer.save()  # This will save the new object
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        try:
            feature_why_us = FeatureWhyUs.objects.get(pk=pk)
        except FeatureWhyUs.DoesNotExist:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = FeatureWhyUsSectionSerializer(feature_why_us, data=request.data, context={'request': self.request}, partial=False)
        if serializer.is_valid():
            serializer.save()  # This will update the object
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
            try:
                feature_why_us = FeatureWhyUs.objects.get(pk=pk)
            except FeatureWhyUs.DoesNotExist:
                return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

            feature_why_us.delete()  # This will delete the object
            return Response({"detail": "Deleted successfully."}, status=status.HTTP_202_ACCEPTED)
    




class ProductSectionView(APIView):
    permission_classes = [IsStaffOrSuperUser, HasSiteManagementPermission]

    def get(self, request):
        product_section_obj, created = ProductSection.objects.get_or_create(id=1)
        serializer = ProductSectionSerializer(product_section_obj, context={'request': self.request} )
        return Response(serializer.data)
    
    def post(self, request):
        product_section_obj, created = ProductSection.objects.get_or_create(id=1)
        serializer = ProductSectionSerializer(product_section_obj, data=request.data, context={'request': self.request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    










class ProductView(APIView):
    permission_classes = [IsStaffOrSuperUser, HasSiteManagementPermission]

    def get(self, request, pk=None):

        if pk:
            try:
                Product_obj = Product.objects.get(pk=pk)
                serializer = ProductSerializer(Product_obj, context={'request': self.request})
                return Response(serializer.data)
            except Product.DoesNotExist:
                return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        else:
            Product_list = Product.objects.all()
            serializer = ProductSerializer(Product_list, many=True, context={'request': self.request} )
            return Response(serializer.data)
    
    def post(self, request):
        serializer = ProductSerializer(data=request.data, context={'request': self.request})
        if serializer.is_valid():
            serializer.save()  # This will save the new object
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        try:
            product_obj = Product.objects.get(pk=pk)
        except Product.DoesNotExist:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = ProductSerializer(product_obj, data=request.data, context={'request': self.request}, partial=False)
        if serializer.is_valid():
            serializer.save()  # This will update the object
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
            try:
                product_obj = Product.objects.get(pk=pk)
            except Product.DoesNotExist:
                return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

            product_obj.delete()  # This will delete the object
            return Response({"detail": "Deleted successfully."}, status=status.HTTP_202_ACCEPTED)
    





class OurServicesSectionView(APIView):
    permission_classes = [IsStaffOrSuperUser, HasSiteManagementPermission]

    def get(self, request):
        our_services_sec_obj, created = OurServicesSection.objects.get_or_create(id=1)
        serializer = OurServicesSectionSerializer(our_services_sec_obj, context={'request': self.request} )
        return Response(serializer.data)
    
    def post(self, request):
        our_services_sec_obj, created = OurServicesSection.objects.get_or_create(id=1)
        serializer = OurServicesSectionSerializer(our_services_sec_obj, data=request.data, context={'request': self.request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    







class ServiceView(APIView):
    permission_classes = [IsStaffOrSuperUser, HasSiteManagementPermission]

    def get(self, request, pk=None):

        if pk:
            try:
                Service_obj = Service.objects.get(pk=pk)
                serializer = ServiceSerializer(Service_obj, context={'request': self.request})
                return Response(serializer.data)
            except Service.DoesNotExist:
                return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        else:
            Service_lise = Service.objects.all()
            serializer = ServiceSerializer(Service_lise, many=True, context={'request': self.request} )
            return Response(serializer.data)
    
    def post(self, request):
        serializer = ServiceSerializer(data=request.data, context={'request': self.request})
        if serializer.is_valid():
            serializer.save()  # This will save the new object
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        try:
            Service_obj = Service.objects.get(pk=pk)
        except Service.DoesNotExist:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = ServiceSerializer(Service_obj, data=request.data, context={'request': self.request}, partial=False)
        if serializer.is_valid():
            serializer.save()  # This will update the object
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
            try:
                Service_obj = Service.objects.get(pk=pk)
            except Service.DoesNotExist:
                return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

            Service_obj.delete()  # This will delete the object
            return Response({"detail": "Deleted successfully."}, status=status.HTTP_202_ACCEPTED)
    


class OurVisionSectionView(APIView):
    permission_classes = [IsStaffOrSuperUser, HasSiteManagementPermission]

    def get(self, request):
        our_vision_obj, created = OurVision.objects.get_or_create(id=1)
        serializer = OurVisionSerializer(our_vision_obj, context={'request': self.request} )
        return Response(serializer.data)
    
    def post(self, request):
        our_vision_obj, created = OurVision.objects.get_or_create(id=1)
        serializer = OurVisionSerializer(our_vision_obj, data=request.data, context={'request': self.request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    




class FocusSecView(APIView):
    permission_classes = [IsStaffOrSuperUser, HasSiteManagementPermission]

    def get(self, request):
        focus_obj, created = Focus.objects.get_or_create(id=1)
        serializer = FocusSecSerializer(focus_obj, context={'request': self.request} )
        return Response(serializer.data)
    
    def post(self, request):
        focus_obj, created = Focus.objects.get_or_create(id=1)
        serializer = FocusSecSerializer(focus_obj, data=request.data, context={'request': self.request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    



class OurClientSectionView(APIView):
    permission_classes = [IsStaffOrSuperUser, HasSiteManagementPermission]

    def get(self, request):
        our_client_sec_obj, created = OurClientSection.objects.get_or_create(id=1)
        serializer = OurClientSectionSerializer(our_client_sec_obj, context={'request': self.request} )
        return Response(serializer.data)
    
    def post(self, request):
        our_client_sec_obj, created = OurClientSection.objects.get_or_create(id=1)
        serializer = OurClientSectionSerializer(our_client_sec_obj, data=request.data, context={'request': self.request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    









class OurClientView(APIView):
    permission_classes = [IsStaffOrSuperUser, HasSiteManagementPermission]

    def get(self, request, pk=None):

        if pk:
            try:
                our_clients_obj = OurClient.objects.get(pk=pk)
                serializer = OurClientSerializer(our_clients_obj, context={'request': self.request})
                return Response(serializer.data)
            except OurClient.DoesNotExist:
                return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        else:
            our_clients_lise = OurClient.objects.all()
            serializer = OurClientSerializer(our_clients_lise, many=True, context={'request': self.request} )
            return Response(serializer.data)
    
    def post(self, request):
        serializer = OurClientSerializer(data=request.data, context={'request': self.request})
        if serializer.is_valid():
            serializer.save()  # This will save the new object
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        try:
            our_clients_obj = OurClient.objects.get(pk=pk)
        except OurClient.DoesNotExist:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = OurClientSerializer(our_clients_obj, data=request.data, context={'request': self.request}, partial=False)
        if serializer.is_valid():
            serializer.save()  # This will update the object
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
            try:
                our_clients_obj = OurClient.objects.get(pk=pk)
            except OurClient.DoesNotExist:
                return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

            our_clients_obj.delete()  # This will delete the object
            return Response({"detail": "Deleted successfully."}, status=status.HTTP_202_ACCEPTED)
    





class CompnayIfRightSectionView(APIView):
    permission_classes = [IsStaffOrSuperUser, HasSiteManagementPermission]

    def get(self, request):
        company_if_right_sec_obj, created = CompnayIfRight.objects.get_or_create(id=1)
        serializer = CompnayIfRightSecSerializer(company_if_right_sec_obj, context={'request': self.request} )
        return Response(serializer.data)
    
    def post(self, request):
        company_if_right_sec_obj, created = CompnayIfRight.objects.get_or_create(id=1)
        serializer = CompnayIfRightSecSerializer(company_if_right_sec_obj, data=request.data, context={'request': self.request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    


class FooterSectionView(APIView):
    permission_classes = [IsStaffOrSuperUser, HasSiteManagementPermission]

    def get(self, request):
        footer_obj, created = Footer.objects.get_or_create(id=1)
        serializer = FooterSectionSerializer(footer_obj, context={'request': self.request} )
        return Response(serializer.data)
    
    def post(self, request):
        footer_obj, created = Footer.objects.get_or_create(id=1)
        serializer = FooterSectionSerializer(footer_obj, data=request.data, context={'request': self.request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    




class SocialMediaFooterView(APIView):
    permission_classes = [IsStaffOrSuperUser, HasSiteManagementPermission]

    def get(self, request):
        social_media_obj, created = SocialMedia.objects.get_or_create(id=1)
        serializer = SocialMediaSerializer(social_media_obj, context={'request': self.request} )
        return Response(serializer.data)
    
    def post(self, request):
        social_media_obj, created = SocialMedia.objects.get_or_create(id=1)
        serializer = SocialMediaSerializer(social_media_obj, data=request.data, context={'request': self.request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)