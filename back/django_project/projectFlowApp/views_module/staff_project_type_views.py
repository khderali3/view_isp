


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.views import status
from ..serializers_module.staff_serializer_project_type import ProjectTypeSerializer, ProjectTypeExtraImagesSerializer, ProjectTypeAttachmentSerializer, GetListProjectTypeSerializer
from ..models.project_type_models import ProjectType, ProjectTypeExtraImages, ProjectTypeAttachment

 

from projectFlowApp.custom_app_utils import  IsStaffOrSuperUser

from projectFlowApp.extra_modules.license_check.utils import license_required


class ProjectTypeAttachmentView(APIView):
    permission_classes = [IsStaffOrSuperUser]

    serializer_class = ProjectTypeAttachmentSerializer

    def get_serializer(self, *args, **kwargs):
        kwargs.setdefault('context', {'request' : self.request})
        return self.serializer_class(*args, **kwargs)
      
    def post(self, request, project_type):
        data = request.data.copy()
        data['project_type']= project_type

        serializer = self.get_serializer(data=data)
        if serializer.is_valid():
            list_obj = serializer.save()
            return Response(self.get_serializer(list_obj, many=True).data , status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_201_CREATED)

    def get(self, request, project_type, file_id=None):
        if file_id:
            try:
                obj = ProjectTypeAttachment.objects.get(id=file_id)
                serializer = self.get_serializer(obj)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except ProjectTypeAttachment.DoesNotExist:
                return Response({'message': "object not found"}, status=status.HTTP_404_NOT_FOUND)
            except Exception as e :
                return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        else:
            list_obj = ProjectTypeAttachment.objects.filter(project_type=project_type)
            serializer = self.get_serializer(list_obj, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, project_type, file_id):

        try:
            obj = ProjectTypeAttachment.objects.get(id=file_id)

            serializer = self.get_serializer(obj, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
            else :
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except ProjectTypeAttachment.DoesNotExist:
            return Response({'message': "object not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e :
            return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)
 

    def delete(self, request, project_type, file_id):
        try:
            obj = ProjectTypeAttachment.objects.get(id=file_id)
            obj.delete()
            return Response({"message" : "object has been deleted"}, status=status.HTTP_202_ACCEPTED)
        except ProjectTypeAttachment.DoesNotExist:
            return Response({'message': "object not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e :
            return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)





class ProjectTypeExtraImagesView(APIView):
    permission_classes = [IsStaffOrSuperUser]

    serializer_class = ProjectTypeExtraImagesSerializer

    def get_serializer(self, *args, **kwargs):
        kwargs.setdefault("context", {'request': self.request})
        return self.serializer_class(*args, **kwargs)
 
    def post(self, request, project_type):
        data = request.data.copy()
        data['project_type'] = project_type
        serializer = self.get_serializer(data=data)
        if serializer.is_valid():
            list_data = serializer.save()
            return Response(self.get_serializer(list_data, many=True).data, status=status.HTTP_201_CREATED)
        else :
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self, request, project_type, file_id=None):
        if file_id:
            try:
                obj = ProjectTypeExtraImages.objects.get(id=file_id)
                serializer = self.get_serializer(obj)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except ProjectTypeExtraImages.DoesNotExist:
                return Response({"message": "object not fount"}, status=status.HTTP_404_NOT_FOUND)
            except Exception as e :
                return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        else:
            list_obj = ProjectTypeExtraImages.objects.filter(project_type=project_type)
            serializer = self.get_serializer(list_obj, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
    
    def delete(self, request, project_type, file_id):
        try:
            obj = ProjectTypeExtraImages.objects.get(id=file_id)
            obj.delete()
            return Response({"message": "object has been deleted"}, status=status.HTTP_202_ACCEPTED)
        except ProjectTypeExtraImages.DoesNotExist:
            return Response({"message": "object not fount"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e :
            return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)






class ProjectTypeView(APIView):
    permission_classes = [IsStaffOrSuperUser]
    
    @license_required
    def post(self, request):

        serializer = ProjectTypeSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    @license_required
    def get(self, request, project_type=None):
 

        if project_type:
            try:
                obj = ProjectType.objects.get(id=project_type)
                serializer = ProjectTypeSerializer(obj, context={'request': request})
                return Response(serializer.data, status=status.HTTP_200_OK)
            except ProjectType.DoesNotExist:
                return Response({'message' : "object not found"}, status=status.HTTP_404_NOT_FOUND)
            except Exception as e :
                return Response({'message' : str(e)}, status=status.HTTP_400_BAD_REQUEST)
        else:
            list_obj = ProjectType.objects.all()
            serializer = GetListProjectTypeSerializer(list_obj, many=True, context={'request': request})


            # serializer = ProjectTypeSerializer(list_obj, many=True, context={'request': request})


            return Response(serializer.data, status=status.HTTP_200_OK)



    @license_required
    def put(self, request, project_type):
        try:
            obj = ProjectType.objects.get(id=project_type)
            serializer = ProjectTypeSerializer(obj, data=request.data, partial=True,  context={'request': request})
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
            else :
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except ProjectType.DoesNotExist:
            return Response({'message' : "object not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e :
            return Response({'message' : str(e)}, status=status.HTTP_400_BAD_REQUEST)


    @license_required
    def delete(self, request, project_type):
 
        try:
            obj = ProjectType.objects.get(id=project_type)
            obj.delete()
            return Response({"message" : "object has been deleted"}, status=status.HTTP_202_ACCEPTED)
        except ProjectType.DoesNotExist:
            return Response({'message' : "object not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e :
            return Response({'message' : str(e)}, status=status.HTTP_400_BAD_REQUEST)
        

