
 
from ..models import   (ProjectFlowTemplate, StepTemplate,  StepTemplateNote,  StepTemplateNoteAttachment,
                         ProjectFlowTemplateNote, ProjectFlowTemplateNoteAttachment,
                         SubStepTemplate,  SubStepTemplateNote, SubStepTemplateNoteAttachment
                         
                         )
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
import json
 
from ..serializers_module.staff_serializer_projectFlow_Template import ( 
    ProjectFlowTemplateSeriallizer, StepTemplateSerializer,CreateOrGetOrPutObjectStepTemplateSerializer,  StepTemplateNoteSerializer, CreateOrGetOrPutObjectStepTemplateNoteSerializer,
    CreateStepTemplateNoteAttachmentSerializer, StepTemplateNoteAttachmentSerializer, 
     CreateOrGetOrPutObjectProjectFlowTemplateSeriallizer, ProjectFlowTemplateNoteSerializer, CreateProjectFlowTemplateNoteAttachmentSerializer,
    ProjectFlowTemplateNoteAttachmentSerializer, CreateOrGetOrPutObjectProjectFlowTemplateNoteSerializer,  
    SubStepTemplateSerializer,   CreateOrGetOrPutObjectSubStepTemplateSerializer, SubStepTemplateNoteSerializer,
    SubStepTemplateNoteAttachmentSerializer, CreateSubStepTemplateNoteAttachmentSerializer, CreateOrGetOrPutObjectSubStepTemplateNoteSerializer
    )

from ..serializers_module.get_full_projectFlow.staff_get_full_project_flow_template import GetFullProjectFlowTemplateSeriallizer

from django.shortcuts import get_object_or_404

from rest_framework import status
from rest_framework.response import Response
from projectFlowApp.custom_app_utils import MyCustomPagination, IsStaffOrSuperUser
from django.db.models import Q



applied_permissions =  [AllowAny]



def validate_allowed_process_groups(data, field_name="allowed_process_groups"):
    """
    Validates and extracts the `allowed_process_groups` field from the provided data.
    Ensures it's a list of integers.

    :param data: A dictionary (e.g., request.data.copy()).
    :param field_name: The key name of the field in the data (default: "allowed_process_groups").
    :return: A cleaned list of integers if successful, otherwise a Response object.
    """
    allowed_process_groups = data.get(field_name)

    if isinstance(allowed_process_groups, str):
        try:
            allowed_process_groups = json.loads(allowed_process_groups)
        except json.JSONDecodeError:
            return Response(
                {field_name: ["Invalid JSON format. Expected a list of IDs."]},
                status=status.HTTP_400_BAD_REQUEST
            )

    if isinstance(allowed_process_groups, list):
        try:
            allowed_process_groups = [int(i) for i in allowed_process_groups]
            return allowed_process_groups  # Return the cleaned list
        except ValueError:
            return Response(
                {field_name: ["All values must be integers."]},
                status=status.HTTP_400_BAD_REQUEST
            )

    return None  # Return None if validation fails






class GetFullProjectFlowTemplateView(APIView):    
    permission_classes = [IsStaffOrSuperUser]

    def get(self, request, id):
        try:
            obj = ProjectFlowTemplate.objects.get(id=id)
            serializer = GetFullProjectFlowTemplateSeriallizer(obj, context={'request': request} )
            return Response(serializer.data, status=status.HTTP_200_OK) 
        except ProjectFlowTemplate.DoesNotExist:
            return Response({"message": "object not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e :
            return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)
                 
 





class StepTemplateResortMoveUpOrDownView(APIView):
    permission_classes = [IsStaffOrSuperUser]


    def post(self, request, project_flow_template_id, step_id, direction):
        step = get_object_or_404(StepTemplate, id=step_id, project_flow_template_id=project_flow_template_id)

        if direction == "up":
            target_step = StepTemplate.objects.filter(
                project_flow_template_id=project_flow_template_id,
                sorted_weight__lt=step.sorted_weight
            ).order_by('-sorted_weight').first()
            if not target_step:
                return Response({"message": "Already at the top"}, status=status.HTTP_200_OK)

        elif direction == "down":
            target_step = StepTemplate.objects.filter(
                project_flow_template_id=project_flow_template_id,
                sorted_weight__gt=step.sorted_weight
            ).order_by('sorted_weight').first()
            if not target_step:
                return Response({"message": "Already at the bottom"}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Invalid direction"}, status=status.HTTP_400_BAD_REQUEST)

        # Swap weights
        step.sorted_weight, target_step.sorted_weight = target_step.sorted_weight, step.sorted_weight

        # Save both in one query using bulk_update
        StepTemplate.objects.bulk_update([step, target_step], ['sorted_weight'])

        return Response({"message": f"Step moved {direction}"}, status=status.HTTP_200_OK)




class StepTemplateResortByAbsolutePositionView(APIView):
    permission_classes = [IsStaffOrSuperUser]




    def post(self, request, project_flow_template_id, step_id, absolute_position):
        # Get the step
        step = get_object_or_404(StepTemplate, id=step_id, project_flow_template_id=project_flow_template_id)

        # Get all steps in the project_flow_template ordered by sorted_weight
        steps = list(StepTemplate.objects.filter(
            project_flow_template_id=project_flow_template_id
        ).order_by('sorted_weight'))

        total_steps = len(steps)

        # Validate absolute_position
        if absolute_position < 1 or absolute_position > total_steps:
            return Response({"error": f"Invalid absolute position. Must be between 1 and {total_steps}."},
                            status=status.HTTP_400_BAD_REQUEST)



        current_position = steps.index(step) + 1  # +1 because the list is zero-indexed
        if current_position == absolute_position:
            return Response({"message": f"Step is already in position {absolute_position}."},
                            status=status.HTTP_200_OK)






        # Remove the step from its current position
        steps.remove(step)

        # Insert at the new position (list index is absolute_position - 1)
        steps.insert(absolute_position - 1, step)

        # Reassign sorted_weight values
        for index, obj in enumerate(steps, start=1):
            obj.sorted_weight = index

        # Save changes in bulk
        StepTemplate.objects.bulk_update(steps, ['sorted_weight'])

        return Response({"message": f"Step moved to position {absolute_position}"}, status=status.HTTP_200_OK)



class SubStepTemplateResortMoveUpOrDownView(APIView):
    permission_classes = [IsStaffOrSuperUser]


    def post(self, request, step_id, sub_step_id, direction):
        sub_step = get_object_or_404(SubStepTemplate, id=sub_step_id, step_template=step_id)

        step = sub_step

        if direction == "up":
            target_step = SubStepTemplate.objects.filter(
                step_template=step_id,
                sorted_weight__lt=step.sorted_weight
            ).order_by('-sorted_weight').first()
            if not target_step:
                return Response({"message": "Already at the top"}, status=status.HTTP_200_OK)

        elif direction == "down":
            target_step = SubStepTemplate.objects.filter(
                 step_template=step_id,
                sorted_weight__gt=step.sorted_weight
            ).order_by('sorted_weight').first()
            if not target_step:
                return Response({"message": "Already at the bottom"}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Invalid direction"}, status=status.HTTP_400_BAD_REQUEST)

        # Swap weights
        step.sorted_weight, target_step.sorted_weight = target_step.sorted_weight, step.sorted_weight

        # Save both in one query using bulk_update
        SubStepTemplate.objects.bulk_update([step, target_step], ['sorted_weight'])

        return Response({"message": f"Step moved {direction}"}, status=status.HTTP_200_OK)





class SubStepTemplateResortByAbsolutePositionView(APIView):

    permission_classes = [IsStaffOrSuperUser]


    def post(self, request, step_id, sub_step_id, absolute_position):
        # Get the step
        sub_step = get_object_or_404(SubStepTemplate, id=sub_step_id, step_template=step_id)

        step = sub_step


        # Get all steps in the project_flow_template ordered by sorted_weight
        steps = list(SubStepTemplate.objects.filter(
            step_template=step_id
        ).order_by('sorted_weight'))

        total_steps = len(steps)

        # Validate absolute_position
        if absolute_position < 1 or absolute_position > total_steps:
            return Response({"error": f"Invalid absolute position. Must be between 1 and {total_steps}."},
                            status=status.HTTP_400_BAD_REQUEST)




        current_position = steps.index(step) + 1  # +1 because the list is zero-indexed
        if current_position == absolute_position:
            return Response({"message": f"Step is already in position {absolute_position}."},
                            status=status.HTTP_200_OK)


        # Remove the step from its current position
        steps.remove(step)

        # Insert at the new position (list index is absolute_position - 1)
        steps.insert(absolute_position - 1, step)

        # Reassign sorted_weight values
        for index, obj in enumerate(steps, start=1):
            obj.sorted_weight = index

        # Save changes in bulk
        SubStepTemplate.objects.bulk_update(steps, ['sorted_weight'])

        return Response({"message": f"Step moved to position {absolute_position}"}, status=status.HTTP_200_OK)






class SubStepTemplateNoteAttachmentView(APIView):


    permission_classes = [IsStaffOrSuperUser]

    def post(self, request, note_id):

        data = request.data.copy()
        data['sub_step_template_note'] = note_id
        serializer = CreateSubStepTemplateNoteAttachmentSerializer(data=data, context={'request': request})
        if serializer.is_valid():
            list_obj = serializer.save()
            return Response(SubStepTemplateNoteAttachmentSerializer(list_obj, many=True,  context={'request': request}).data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
 
    def get(self, request, note_id, file_id=None):
        if file_id:
            try:
                obj = SubStepTemplateNoteAttachment.objects.get(id=file_id)
                serializer = SubStepTemplateNoteAttachmentSerializer(obj,  context={'request': request})
                return Response(serializer.data, status=status.HTTP_200_OK)

            except SubStepTemplateNoteAttachment.DoesNotExist:
                return Response({'message': "object not found"}, status=status.HTTP_404_NOT_FOUND)
            except Exception as e :
                return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        else:
            list_obj = SubStepTemplateNoteAttachment.objects.filter(sub_step_template_note=note_id)
            serializer = SubStepTemplateNoteAttachmentSerializer(list_obj, many=True, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, note_id, file_id):
        try :
             obj = SubStepTemplateNoteAttachment.objects.get(id=file_id)
             obj.delete()
             return Response({'message': "object has been deleted"}, status=status.HTTP_202_ACCEPTED)
        except SubStepTemplateNoteAttachment.DoesNotExist:
            return Response({'message': "object not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e :
            return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)



class SubStepTemplateNoteView(APIView):
    permission_classes = [IsStaffOrSuperUser]

    def post(self, request, sub_step_id):

        data = request.data.copy()
        data['sub_step_template'] = sub_step_id
        data['sub_step_note_user'] = request.user.id
        

        serializer = CreateOrGetOrPutObjectSubStepTemplateNoteSerializer(data=data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    def get(self, request, sub_step_id, note_id=None):
        if note_id:
            try:
                obj = SubStepTemplateNote.objects.get(id=note_id)
                serializer = CreateOrGetOrPutObjectSubStepTemplateNoteSerializer(obj, context={'request': request})
                return Response(serializer.data, status=status.HTTP_200_OK)
            except SubStepTemplateNote.DoesNotExist:
                return Response({"message": "object not found"}, status=status.HTTP_404_NOT_FOUND)
            except Exception as e :
                return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        else:
            list_obj = SubStepTemplateNote.objects.filter(sub_step_template=sub_step_id)
            serializer = SubStepTemplateNoteSerializer(list_obj, many=True, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, sub_step_id, note_id=None):
        try:
            obj = SubStepTemplateNote.objects.get(id=note_id)
            data = request.data.copy()
            data['sub_step_template'] = sub_step_id
            serializer = CreateOrGetOrPutObjectSubStepTemplateNoteSerializer(obj, data=data,  context={'request': request})
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except SubStepTemplateNote:
            return Response({"message": "object not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e :
            return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, sub_step_id, note_id=None):
        try:
            obj = SubStepTemplateNote.objects.get(id=note_id)
            obj.delete()
            return Response({'message': "object has been deleted"}, status=status.HTTP_202_ACCEPTED)
        except SubStepTemplateNote.DoesNotExist:
            return Response({"message": "object not found"}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)


 

class SubStepTemplateView(APIView):

    permission_classes = [IsStaffOrSuperUser]

    def post(self, request, step_id):
 
        data = request.data.copy()  # Create a mutable copy of request data
        data['step_template'] = step_id

        allowed_process_groups = validate_allowed_process_groups(data)
        if isinstance(allowed_process_groups, Response):
            return allowed_process_groups  # Return validation error if failed
        if allowed_process_groups is not None:
            data.setlist("allowed_process_groups", allowed_process_groups)

        serializer = CreateOrGetOrPutObjectSubStepTemplateSerializer(data=data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else :
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, step_id, sub_step_id=None):
        if sub_step_id:
            try:
                obj = SubStepTemplate.objects.get(id=sub_step_id)
                serializer = CreateOrGetOrPutObjectSubStepTemplateSerializer(obj, context={'request': request})
                return Response(serializer.data, status=status.HTTP_200_OK)
            except SubStepTemplate.DoesNotExist:
                return Response({'message': "object not found"}, status=status.HTTP_404_NOT_FOUND)
            except Exception as e :
                return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)
             
        else:
            list_obj = SubStepTemplate.objects.filter(step_template=step_id)
            serializer = SubStepTemplateSerializer(list_obj, many=True, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        

    def put(self, request, step_id, sub_step_id):
        
        try:
            obj = SubStepTemplate.objects.get(id=sub_step_id)
            data = request.data.copy()

            allowed_process_groups = validate_allowed_process_groups(data)
            if isinstance(allowed_process_groups, Response):
                return allowed_process_groups  # Return validation error if failed
            if allowed_process_groups is not None:
                data.setlist("allowed_process_groups", allowed_process_groups)


            serializer = CreateOrGetOrPutObjectSubStepTemplateSerializer(obj, data=data, context={'request': request})
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        except SubStepTemplate.DoesNotExist:
            return Response({'message': "object not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e :
            return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)


    def delete(self, request, step_id, sub_step_id=None):
        try:
            obj = SubStepTemplate.objects.get(id=sub_step_id)
            obj.delete()
            return Response({'message': "object has been deleted"}, status=status.HTTP_202_ACCEPTED)
        except SubStepTemplate.DoesNotExist:
            return Response({"message": "object not found"}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)



class ProjectFlowTemplateNoteAttachmentView(APIView):

    permission_classes = [IsStaffOrSuperUser]


    def post(self, request, note_id):
        data = request.data.copy()
        data['project_flow_template_note'] =  note_id 
        serializer = CreateProjectFlowTemplateNoteAttachmentSerializer(data=data, context={'request': request})
        if serializer.is_valid():
            list_object = serializer.save()
            return Response( ProjectFlowTemplateNoteAttachmentSerializer(list_object, many=True, context={'request': request}).data, status=status.HTTP_201_CREATED )
        else :
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    def get(self, request, note_id, file_id=None):
        if file_id:
            try:
                obj = ProjectFlowTemplateNoteAttachment.objects.get(id=file_id)
                serializer = ProjectFlowTemplateNoteAttachmentSerializer(obj, context={'request': request})
                return Response(serializer.data, status=status.HTTP_200_OK)
            
            except ProjectFlowTemplateNoteAttachment.DoesNotExist:
                 return Response({"message": "object not found"}, status=status.HTTP_404_NOT_FOUND)
            except Exception as e :
                 return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        else:
            list_objects = ProjectFlowTemplateNoteAttachment.objects.filter(project_flow_template_note=note_id)
            serializer = ProjectFlowTemplateNoteAttachmentSerializer(list_objects, many=True, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request,note_id, file_id):
        try:
            obj = ProjectFlowTemplateNoteAttachment.objects.get(id=file_id)
            obj.delete()
            return Response({'message': "object has been deleted"}, status=status.HTTP_202_ACCEPTED)
        except ProjectFlowTemplateNoteAttachment.DoesNotExist:
            return Response({"message": "object not found"}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)




class ProjectFlowTemplateNoteView(APIView):
    permission_classes = [IsStaffOrSuperUser]

    def post(self, request, project_flow_template_id):
        data = request.data.copy()
        data['project_flow_template'] =  project_flow_template_id 
        data['created_user'] = request.user.id
        serializer = CreateOrGetOrPutObjectProjectFlowTemplateNoteSerializer(data=data, context={'request':request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else :
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



    def get(self, request, project_flow_template_id, note_id=None):
        if note_id:
            try:
                note_obj = ProjectFlowTemplateNote.objects.get(id=note_id)
                serializer = CreateOrGetOrPutObjectProjectFlowTemplateNoteSerializer(note_obj, context={"request": request})
                return Response(serializer.data, status=status.HTTP_200_OK)
            except ProjectFlowTemplateNote.DoesNotExist:
                return Response({'message': "object not found"}, status=status.HTTP_404_NOT_FOUND)
            except Exception as e:
                return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        else:
            data_list = ProjectFlowTemplateNote.objects.filter(project_flow_template=project_flow_template_id)
            serializer =  ProjectFlowTemplateNoteSerializer(data_list, many=True , context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)

        
    def put(self, request, project_flow_template_id, note_id):

        try:
            note_obj = ProjectFlowTemplateNote.objects.get(id=note_id)
            serializer = CreateOrGetOrPutObjectProjectFlowTemplateNoteSerializer(note_obj, data=request.data, partial=True,  context={"request": request} )
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        except ProjectFlowTemplateNote.DoesNotExist:
            return Response({'message': "object not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)
 

    def delete(self, request,  project_flow_template_id, note_id):
        try:
            note_obj = ProjectFlowTemplateNote.objects.get(id=note_id)
            note_obj.delete()
            return Response({'message': "object has been deleted"}, status=status.HTTP_202_ACCEPTED)
        except ProjectFlowTemplateNote.DoesNotExist:
            return Response({"message": "object not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e :
            return Response({'message': str(e)})
        
 
 

class StepTemplateNoteAttachmentView(APIView):
 
    permission_classes = [IsStaffOrSuperUser]


    # post list of files by using "file[]" keyword
    def post(self, request, step_template_note_id):
 

        data = request.data.copy()
 

        data['step_template_note'] = step_template_note_id

        serializer = CreateStepTemplateNoteAttachmentSerializer(data=data, context={"request": request})
        if serializer.is_valid():
            attachments = serializer.save()
            return Response(CreateStepTemplateNoteAttachmentSerializer(attachments, many=True, context={"request": request}).data  , status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    def get (self, request, step_template_note_id, file_id=None):

        if file_id:
            try:
                file_object = StepTemplateNoteAttachment.objects.get(id=file_id)
                serializer = StepTemplateNoteAttachmentSerializer(file_object, context={"request": request})
                return Response(serializer.data, status=status.HTTP_200_OK)

            except StepTemplateNoteAttachment.DoesNotExist:
                return Response({"message": "object not found"}, status=status.HTTP_404_NOT_FOUND)
            
            except Exception as e:            
                return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        else:
            files_list = StepTemplateNoteAttachment.objects.filter(step_template_note=step_template_note_id)
            serializer = StepTemplateNoteAttachmentSerializer(files_list, context={"request": request}, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)


    def delete(self, request, step_template_note_id, file_id):
        try:
            obj = StepTemplateNoteAttachment.objects.get(id=file_id)
            obj.delete()

            return Response({"message": "object has been deleted "}, status=status.HTTP_202_ACCEPTED)
        except StepTemplateNoteAttachment.DoesNotExist:
            return Response({"message": "object not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:            
            return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        


class StepTemplateNoteView(APIView):
    permission_classes = [IsStaffOrSuperUser]

    def post(self, request, step_template_id ):
        data = request.data.copy()
        
        # Add the step_template_id to the data
        data['step_template'] = step_template_id
        data['step_note_user'] = request.user.id

        # Pass the modified data to the serializer
        serializer = CreateOrGetOrPutObjectStepTemplateNoteSerializer(data=data, context={'request': request})

 
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    def get(self, request, step_template_id, step_template_note_id=None ):
 
        if step_template_note_id:
            try:
                note_obj = StepTemplateNote.objects.get(id=step_template_note_id)
                serializer = CreateOrGetOrPutObjectStepTemplateNoteSerializer(note_obj , context={'request': request})
                return Response(serializer.data, status=status.HTTP_200_OK)
            except StepTemplateNote.DoesNotExist:
                  return Response({"message": "object not found"}, status=status.HTTP_404_NOT_FOUND)

        else:
             
            all_notes = StepTemplateNote.objects.filter(step_template=step_template_id)
    
            serializer = StepTemplateNoteSerializer(all_notes, many=True, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)

 


    def put(self, request, step_template_id, step_template_note_id ):

        try:            
            note_obj = StepTemplateNote.objects.get(id=step_template_note_id)
            serializer = CreateOrGetOrPutObjectStepTemplateNoteSerializer(note_obj , data=request.data, partial=True, context={'request': request}) 
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)           
        except StepTemplateNote.DoesNotExist:
            return Response({"message": "object not found"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:            
            return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    
    def delete(self, request, step_template_id, step_template_note_id ):
        try:
            obj = StepTemplateNote.objects.get( id=step_template_note_id)
            obj.delete()
            return Response({"message": "object has been deleted "}, status=status.HTTP_202_ACCEPTED)
        except StepTemplateNote.DoesNotExist:
            return Response({"message": "object not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:            
            return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)


 







class StepTemplateView(APIView):

    permission_classes = [IsStaffOrSuperUser]

    def post(self, request, project_flow_template_id):
        data = request.data.copy()  # Create a mutable copy of request data

        data['project_flow_template'] = project_flow_template_id

 
        allowed_process_groups = validate_allowed_process_groups(data)

        if isinstance(allowed_process_groups, Response):
            return allowed_process_groups  # Return validation error if failed

        if allowed_process_groups is not None:
            data.setlist("allowed_process_groups", allowed_process_groups)

        # Serialize and save
        serializer = CreateOrGetOrPutObjectStepTemplateSerializer(data=data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



    def get(self, request, project_flow_template_id,  step_id=None):
        if step_id:
            try:
                obj = StepTemplate.objects.get(id=step_id)
                serializer = CreateOrGetOrPutObjectStepTemplateSerializer(obj, context={'request': request})
                return Response(serializer.data, status=status.HTTP_200_OK)
                
            except StepTemplate.DoesNotExist:
                 return Response({"message" : "object not found"}, status=status.HTTP_404_NOT_FOUND)
            except Exception as e:
                return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)
            
        else:
            obj_list = StepTemplate.objects.filter(project_flow_template=project_flow_template_id)
            seriallizer = StepTemplateSerializer(obj_list, many=True)
            return Response(seriallizer.data, status=status.HTTP_200_OK)


    def put(self, request, project_flow_template_id,  step_id):
            try:
                instance = StepTemplate.objects.get(id=step_id)
            except StepTemplate.DoesNotExist:
                return Response({"error": "StepTemplate not found."}, status=status.HTTP_404_NOT_FOUND)

            data = request.data.copy()  # Create a mutable copy of request data
 
            allowed_process_groups = validate_allowed_process_groups(data)

            if isinstance(allowed_process_groups, Response):
                return allowed_process_groups  # Return validation error if failed

            if allowed_process_groups is not None:
                data.setlist("allowed_process_groups", allowed_process_groups)


            # Proceed with serializer for partial update
            serializer = CreateOrGetOrPutObjectStepTemplateSerializer(instance, data=data, partial=True,  context={'request': request})
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
 
    def delete(self, request,  project_flow_template_id,  step_id):
        try:
            obj = StepTemplate.objects.get(id=step_id)
            obj.delete()
            return Response({"message": "object has been deleted "}, status=status.HTTP_202_ACCEPTED)
        except StepTemplate.DoesNotExist:
            return Response({"message": "object not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)





class ProjectFlowTemplateView(APIView):
    permission_classes = [IsStaffOrSuperUser]

    def get(self, request, id=None):
        if id:
            try:
                obj = ProjectFlowTemplate.objects.get(id=id)
                serializer = CreateOrGetOrPutObjectProjectFlowTemplateSeriallizer(obj, context={'request': request} )
                return Response(serializer.data, status=status.HTTP_200_OK) 
                           
            except ProjectFlowTemplate.DoesNotExist:
                    return Response({"message": "object not found"}, status=status.HTTP_404_NOT_FOUND)
                 
      
        else:
            obj_list = ProjectFlowTemplate.objects.all()

            template_name_query = request.query_params.get('template_name', None)

            no_pagination = request.query_params.get('no_pagination', None)




            if template_name_query:
                obj_list = obj_list.filter(
                    Q(template_name__icontains=template_name_query)
                ) 

            if no_pagination in ['true', '1']:
                # If 'no_pagination=true' is provided, return all objects without pagination
                serializer = ProjectFlowTemplateSeriallizer(obj_list, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)

            # serializer = ProjectFlowTemplateSeriallizer(obj_list, many=True)
            # return Response(serializer.data, status=status.HTTP_200_OK)
            paginator = MyCustomPagination()
            page = paginator.paginate_queryset(obj_list, request)
            serializer = ProjectFlowTemplateSeriallizer(page, many=True)
            return paginator.get_paginated_response(serializer.data) 







    def post(self, request):
        serializer = CreateOrGetOrPutObjectProjectFlowTemplateSeriallizer(data=request.data, context={"request": request})
        # return Response({'message' : 'error from backend'}, status=status.HTTP_400_BAD_REQUEST)
        print('request.data', request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else :
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        

    def put(self, request, id):
        try:
            obj = ProjectFlowTemplate.objects.get(id=id)
       
        except ProjectFlowTemplate.DoesNotExist:
            return Response({"message": "object not found"}, status=status.HTTP_404_NOT_FOUND)
 
        serializer = CreateOrGetOrPutObjectProjectFlowTemplateSeriallizer(obj, data=request.data, partial=True, context={"request": request}  )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else :
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
 

    def delete(self, request, id):
        try:
            obj = ProjectFlowTemplate.objects.get(id=id)
            obj.delete()
            return Response({"message": "object has been deleted "}, status=status.HTTP_202_ACCEPTED)
        except ProjectFlowTemplate.DoesNotExist:
            return Response({"message": "object not found"}, status=status.HTTP_404_NOT_FOUND)