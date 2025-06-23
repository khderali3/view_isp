 
from django.shortcuts import get_object_or_404

from rest_framework import status
from rest_framework.response import Response 
from rest_framework.views import APIView
import json
from django.contrib.auth import get_user_model
User = get_user_model()
from ..models.project_flow_models import (
    ProjectFlow, ProjectFlowAttachment, ProjectFlowNote, ProjectFlowNoteAttachment, ProjectFlowStep,  ProjectFlowStepNote, ProjectFlowStepNoteAttachment,
    ProjectFlowSubStep,  ProjectFlowSubStepNote, ProjectFlowSubStepNoteAttachment,InstalledProduct , InstalledProductType
    
    )
from ..serializers_module.staff_serializer_projectFlow import ( 
    GetListProjectFlowSerializer, GetObjectProjectFlowSerializer, CreateOrPutObjectProjectFlowSerializer, ProjectFlowAttachmentSerializer, CreateProjectFlowAttachmentSerializer,
    ProjectFlowNoteSerializer, CreateOrPutProjectFlowNoteSerializer, ProjectFlowNoteAttachmentSerializer, ProjectFlowStepSerializer,  ProjectFlowStepNoteSerializer,
    ProjectFlowStepNoteAttachmentSerializer, ProjectFlowSubStepSerializer,  ProjectFlowSubStepNoteSerializer,
      ProjectFlowSubStepNoteAttachmentSerializer, GetListProjectFlowStepNoteSerializer, GetListProjectFlowSubStepNoteSerializer,
        InstalledProductSerializer, InstalledProductTypeSerializer
)

from ..serializers_module.get_full_projectFlow.staff_get_full_project_flow import GetFullProjectFlowSeriallizer

# from projectFlowApp.custom_app_utils import MyCustomPagination

from django.db import transaction

from projectFlowApp.custom_app_utils import get_client_ip, IsStaffOrSuperUser, MyCustomPagination



from django.db.models import Count


class ProjectFlowStatusCountAPIView(APIView):

    permission_classes = [IsStaffOrSuperUser]


    def get(self, request):
        all_statuses = dict(ProjectFlow.ProjectFlow_status_options)

        # Initialize counts to zero for each status using a simple for loop
        result = {}
        for status in all_statuses.keys():
            result[status] = 0

        # Count how many ProjectFlow objects per status
        counts = ProjectFlow.objects.values('project_flow_status').order_by().annotate(count=Count('id'))

        for item in counts:
            status = item['project_flow_status']
            count = item['count']
            result[status] = count

        # Add total count of all projects
        total_projects = ProjectFlow.objects.count()
        result['all'] = total_projects

        return Response(result)







class InstalledProductTypeView(APIView):



    permission_classes = [IsStaffOrSuperUser]
    def post(self, request):
        serializer = InstalledProductTypeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self, request, id=None):
        if id:
            try:
                obj = InstalledProductType.objects.get(id=id)
            except InstalledProductType.DoesNotExist:
                return Response({'message': 'object not found'}, status=status.HTTP_404_NOT_FOUND)

            serializer = InstalledProductTypeSerializer(obj)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            list_obj = InstalledProductType.objects.all()
            serializer = InstalledProductTypeSerializer(list_obj, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)


    def put(self, request, id):
        try:
            obj = InstalledProductType.objects.get(id=id)
        except InstalledProductType.DoesNotExist:
            return Response({'message': 'object not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = InstalledProductTypeSerializer(obj, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
 
    def delete(self, request, id):
        try:
            obj = InstalledProductType.objects.get(id=id)
        except InstalledProductType.DoesNotExist:
            return Response({'message': 'object not found'}, status=status.HTTP_404_NOT_FOUND)

        obj.delete()
        return Response({'message': 'object has been deleted'}, status=status.HTTP_202_ACCEPTED)



class InstalledProductView(APIView):

    permission_classes = [IsStaffOrSuperUser]




    def post(self, request, projectflow, installed_product_type):
 
        data = request.data.copy()
        data['project_flow'] = projectflow
        data['installed_product_type'] = installed_product_type
        serializer = InstalledProductSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    


    def get(self, request, projectflow ,  id=None):
        if id:
            try:
                obj = InstalledProduct.objects.get(id=id)

            except InstalledProduct.DoesNotExist:
                return Response({'message': 'object not found'}, status=status.HTTP_404_NOT_FOUND)
            except Exception as e :
                return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)

            serializer = InstalledProductSerializer(obj)
            return Response(serializer.data, status=status.HTTP_200_OK)



        else:
 
            try:
                projectflow_obj =ProjectFlow.objects.get(id=projectflow)
            except ProjectFlow.DoesNotExist: 
                return Response({'message': 'projectflow object not found'}, status=status.HTTP_404_NOT_FOUND)

            list_obj = InstalledProduct.objects.filter(project_flow=projectflow_obj)
            serializer = InstalledProductSerializer(list_obj, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, projectflow , id):
        obj = get_object_or_404(InstalledProduct, id=id)
        serializer = InstalledProductSerializer(obj, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, projectflow,  id):
        obj = get_object_or_404(InstalledProduct, id=id)
        obj.delete()
        return Response({'message' : 'object has been deleted'}, status=status.HTTP_202_ACCEPTED)





class CanceleProjectFlow(APIView):

    permission_classes = [IsStaffOrSuperUser]



    def post(self, request, id):

        if not (request.user.is_staff or request.user.is_superuser):
            return Response({'message' : 'you are not authorized to do this operation'}, status=status.HTTP_403_FORBIDDEN)
        try:
            project_flow_obj = ProjectFlow.objects.get(id=id)

            if project_flow_obj.project_flow_status == 'canceled':
                return Response({'message' : "the project already 'canceled' "}, status=status.HTTP_400_BAD_REQUEST)
            
            with transaction.atomic():
                project_flow_obj.project_flow_status_when_canceled = project_flow_obj.project_flow_status
                project_flow_obj.project_flow_status = 'canceled'
                project_flow_obj.save()
                ProjectFlowNote.objects.create(project_flow=project_flow_obj, created_user=request.user, note='this projectFlow has been Closed and marked as "Canceled"')
                return Response({'message': 'projectflow has been canceled'}, status=status.HTTP_202_ACCEPTED)
            
        except ProjectFlow.DoesNotExist:
            return Response({'message': 'object not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e :
            return Response({'message' : str(e)}, status=status.HTTP_400_BAD_REQUEST)



class ReopenProjectFlow(APIView):

    permission_classes = [IsStaffOrSuperUser]




    def post(self, request, id):
        if not (request.user.is_staff or request.user.is_superuser):
            return Response({'message' : 'you are not authorized to do this operation'}, status=status.HTTP_403_FORBIDDEN)
        try:

            project_flow_obj = ProjectFlow.objects.get(id=id)

            if not project_flow_obj.project_flow_status == 'canceled':
                return Response({'message' : "the project already 'not canceled' "}, status=status.HTTP_400_BAD_REQUEST)
            
            with transaction.atomic():
                project_flow_obj.project_flow_status = project_flow_obj.project_flow_status_when_canceled
                project_flow_obj.save()
                ProjectFlowNote.objects.create(project_flow=project_flow_obj, created_user=request.user, note='this projectFlow has been Re-opend')

                return Response({'message': 'projectflow has been re-opened'}, status=status.HTTP_202_ACCEPTED)
        except ProjectFlow.DoesNotExist:
            return Response({'message': 'object not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e :
            return Response({'message' : str(e)}, status=status.HTTP_400_BAD_REQUEST)
    




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




class StartStepProcess(APIView):


    permission_classes = [IsStaffOrSuperUser]




    def post(self, request,project_flow, step_id):


        try:
            obj = ProjectFlowStep.objects.get(id=step_id)             
            if obj.project_flow.project_flow_status == 'canceled' :
                return Response({'message' : "the projectflow status is 'Canceled' you can't do this operation! "}, status=status.HTTP_400_BAD_REQUEST)
            elif obj.project_flow.project_flow_status == 'completed':
                return Response({'message' : "the projectflow status is 'Completed' you can't do this operation!  "}, status=status.HTTP_400_BAD_REQUEST)
               
        except Exception as e :
                return Response({'message' : str(e)}, status=status.HTTP_400_BAD_REQUEST)

        try:
            with transaction.atomic():
                step_obj = ProjectFlowStep.objects.get(id=step_id)

                if step_obj.ProjectFlowSubStep_step_related_ProjectFlowStep.exists():
                    return Response({'message': 'can not change status for step that includes  sub-steps'}, status=status.HTTP_400_BAD_REQUEST)
                
                if step_obj.project_flow_step_status == 'in_progress':
                    return Response({'message': 'the step already "in_progress" '}, status=status.HTTP_400_BAD_REQUEST)
                
                elif step_obj.project_flow_step_status != 'pending':
                    return Response({'message': 'the step shuld be pending status to start it '}, status=status.HTTP_400_BAD_REQUEST)

                project_flow_obj = step_obj.project_flow



 

                if (
                    project_flow_obj.manual_start_mode == 'serialized' and (
                        step_obj.start_process_step_strategy == 'manual' or
                        (
                            step_obj.start_process_step_strategy == 'inherit_from_project_flow' and
                            step_obj.project_flow.default_start_process_step_or_sub_step_strategy == 'manual'
                        )
                    )
                ):
                    previous_step_not_completed = ProjectFlowStep.objects.filter(
                        project_flow=step_obj.project_flow,
                        sorted_weight__lt=step_obj.sorted_weight,
                    ).exclude(project_flow_step_status='completed').first()

                    if previous_step_not_completed:
                        return Response({'message': 'the previous step is not completed yet'}, status=status.HTTP_400_BAD_REQUEST)





                step_obj.project_flow_step_status = 'in_progress'
                step_obj.handler_user = request.user

                step_obj.save()


                if  project_flow_obj.project_flow_status == "pending": 
                    project_flow_obj.project_flow_status = 'in_progress'
                    

                    project_flow_obj.save()



                return Response({'message': 'status has been updated'}, status=status.HTTP_200_OK)
        except ProjectFlowStep.DoesNotExist:
            return Response({'message': 'object not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)





class EndStepProcess(APIView):

    permission_classes = [IsStaffOrSuperUser]



    def post(self, request, project_flow, step_id):

        try:
            obj = ProjectFlowStep.objects.get(id=step_id)             
            if obj.project_flow.project_flow_status == 'canceled' :
                return Response({'message' : "the projectflow status is 'Canceled' you can't do this operation! "}, status=status.HTTP_400_BAD_REQUEST)
            elif obj.project_flow.project_flow_status == 'completed':
                return Response({'message' : "the projectflow status is 'Completed' you can't do this operation!  "}, status=status.HTTP_400_BAD_REQUEST)
               
        except Exception as e :
                return Response({'message' : str(e)}, status=status.HTTP_400_BAD_REQUEST)



        try:
            with transaction.atomic():
                step_obj = ProjectFlowStep.objects.get(id=step_id)

                if step_obj.ProjectFlowSubStep_step_related_ProjectFlowStep.exists():
                    return Response({'message': 'can not change status for step that related with substep directly!'}, status=status.HTTP_400_BAD_REQUEST)

                if step_obj.project_flow_step_status == 'completed':
                    return Response({'message': 'the step already "completed"'}, status=status.HTTP_400_BAD_REQUEST)

                elif step_obj.project_flow_step_status != 'in_progress':
                    return Response({'message': 'the step should be in_progress status to end it'}, status=status.HTTP_400_BAD_REQUEST)

                step_obj.project_flow_step_status = 'completed'
                step_obj.save()

                next_step = ProjectFlowStep.objects.filter(
                    project_flow=step_obj.project_flow,
                    sorted_weight__gt=step_obj.sorted_weight
                ).first()

                if next_step:
                    should_auto_start = (
                        next_step.start_process_step_strategy == 'auto' or
                        (
                            next_step.start_process_step_strategy == 'inherit_from_project_flow' and
                            step_obj.project_flow.default_start_process_step_or_sub_step_strategy == 'auto'
                        )
                    )

                    if should_auto_start:
                        if not next_step.ProjectFlowSubStep_step_related_ProjectFlowStep.exists():
                            next_step.project_flow_step_status = 'in_progress'
                            next_step.save()
                        else:
                            first_sub_step = next_step.ProjectFlowSubStep_step_related_ProjectFlowStep.all().first()
                            should_auto_start_first_sub_step = (
                                first_sub_step.start_process_sub_step_strategy == 'auto' or
                                (
                                    first_sub_step.start_process_sub_step_strategy == 'inherit_from_project_flow' and
                                    first_sub_step.step.project_flow.default_start_process_step_or_sub_step_strategy == 'auto'
                                )
                            )

                            if should_auto_start_first_sub_step:
                                first_sub_step.project_flow_sub_step_status = 'in_progress'
                                first_sub_step.save()
                                next_step.project_flow_step_status = 'in_progress'
                                next_step.save()

                all_project_steps = step_obj.project_flow.ProjectFlowStep_ProjectFlow_related_ProjectFlow.all()
                all_project_steps_completed = not all_project_steps.exclude(project_flow_step_status='completed').exists()
                if all_project_steps_completed:
                    project_flow_object = step_obj.project_flow
                    project_flow_object.project_flow_status = 'completed'
                    project_flow_object.save()

            return Response({'message': 'status has been updated'}, status=status.HTTP_200_OK)

        except ProjectFlowStep.DoesNotExist:
            return Response({'message': 'object not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)




 

class StartSubStepProcess(APIView):

    permission_classes = [IsStaffOrSuperUser]




    def post(self, request, step_id, sub_step_id):

        try:
            obj = ProjectFlowSubStep.objects.get(id=sub_step_id)             
            if obj.step.project_flow.project_flow_status == 'canceled' :
                return Response({'message' : "the projectflow status is 'Canceled' you can't do this operation! "}, status=status.HTTP_400_BAD_REQUEST)
            elif obj.step.project_flow.project_flow_status == 'completed':
                return Response({'message' : "the projectflow status is 'Completed' you can't do this operation!  "}, status=status.HTTP_400_BAD_REQUEST)
               
        except Exception as e :
                return Response({'message' : str(e)}, status=status.HTTP_400_BAD_REQUEST)




        try:
            with transaction.atomic():
                sub_step_obj = ProjectFlowSubStep.objects.get(id=sub_step_id)
                step_obj = sub_step_obj.step  # parent object



                if sub_step_obj.project_flow_sub_step_status == 'in_progress':
                    return Response({'message': 'the sub-step already "in_progress" '}, status=status.HTTP_400_BAD_REQUEST)
                
                elif sub_step_obj.project_flow_sub_step_status != 'pending':
                    return Response({'message': 'the sub-step shuld be pending status to start it '}, status=status.HTTP_400_BAD_REQUEST)



 


                project_flow_obj = step_obj.project_flow
                if (
                    project_flow_obj.manual_start_mode == 'serialized' and (
                        sub_step_obj.start_process_sub_step_strategy == 'manual' or
                        (
                            sub_step_obj.start_process_sub_step_strategy == 'inherit_from_project_flow' and
                            sub_step_obj.step.project_flow.default_start_process_step_or_sub_step_strategy == 'manual'
                        )
                    )
                ):
                    previous_step_not_completed = ProjectFlowStep.objects.filter(
                        project_flow=step_obj.project_flow,
                        sorted_weight__lt=step_obj.sorted_weight,
                    ).exclude(project_flow_step_status='completed').first()

                    if previous_step_not_completed:
                        return Response({'message': 'the previous step is not completed yet'}, status=status.HTTP_400_BAD_REQUEST)





                    previous_sub_step_not_completed = ProjectFlowSubStep.objects.filter(
                        step=step_obj,
                        sorted_weight__lt=sub_step_obj.sorted_weight,
                    ).exclude(project_flow_sub_step_status='completed').first()

                    if previous_sub_step_not_completed:
                        return Response({'message': 'the previous sub step is not completed yet'}, status=status.HTTP_400_BAD_REQUEST)

    
                sub_step_obj.project_flow_sub_step_status = 'in_progress'
                sub_step_obj.save()



                if step_obj.project_flow_step_status == 'pending':
                    step_obj.project_flow_step_status = 'in_progress'
                    step_obj.save()


                project_flow_object = step_obj.project_flow
                if project_flow_object.project_flow_status == 'pending':
                    project_flow_object.project_flow_status = 'in_progress'
                    project_flow_object.save()




                return Response({'message': 'status has been updated'}, status=status.HTTP_200_OK)
        except ProjectFlowSubStep.DoesNotExist:
            return Response({'message': 'object not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)



class EndSubStepProcess(APIView):

    permission_classes = [IsStaffOrSuperUser]




    def post(self, request, step_id, sub_step_id):


        try:
            obj = ProjectFlowSubStep.objects.get(id=sub_step_id)             
            if obj.step.project_flow.project_flow_status == 'canceled' :
                return Response({'message' : "the projectflow status is 'Canceled' you can't do this operation! "}, status=status.HTTP_400_BAD_REQUEST)
            elif obj.step.project_flow.project_flow_status == 'completed':
                return Response({'message' : "the projectflow status is 'Completed' you can't do this operation!  "}, status=status.HTTP_400_BAD_REQUEST)
               
        except Exception as e :
                return Response({'message' : str(e)}, status=status.HTTP_400_BAD_REQUEST)




        try:
            with transaction.atomic():

                sub_step_obj = ProjectFlowSubStep.objects.get(id=sub_step_id)

                if sub_step_obj.project_flow_sub_step_status == 'completed':
                    return Response({'message': 'the sub-step already "completed" '}, status=status.HTTP_400_BAD_REQUEST)
                
                elif sub_step_obj.project_flow_sub_step_status != 'in_progress':
                    return Response({'message': 'the sub-step shuld be in_progress status to end it '}, status=status.HTTP_400_BAD_REQUEST)

                
                sub_step_obj.project_flow_sub_step_status = 'completed'
                sub_step_obj.save()
                # Try to find the next step based on sorted_weight
                next_sub_step = ProjectFlowSubStep.objects.filter(
                    step=sub_step_obj.step,
                    sorted_weight__gt=sub_step_obj.sorted_weight
                ).first()

                if next_sub_step:
                    should_auto_start = (
                        next_sub_step.start_process_sub_step_strategy == 'auto' or
                        (
                            next_sub_step.start_process_sub_step_strategy == 'inherit_from_project_flow' and
                            next_sub_step.step.project_flow.default_start_process_step_or_sub_step_strategy == 'auto'
                        )
                    )
                    if should_auto_start:
                        next_sub_step.project_flow_sub_step_status = 'in_progress'
                        next_sub_step.save()

                all_sub_steps = sub_step_obj.step.ProjectFlowSubStep_step_related_ProjectFlowStep.all()
                all_completed = not all_sub_steps.exclude(project_flow_sub_step_status='completed').exists()
                if all_completed:
                    step_obj = sub_step_obj.step  # parent object

                    if step_obj.project_flow_step_status != 'completed':
                        step_obj.project_flow_step_status = 'completed'
                        step_obj.save()

                        all_project_steps = step_obj.project_flow.ProjectFlowStep_ProjectFlow_related_ProjectFlow.all()
                        all_project_steps_complated =  not all_project_steps.exclude(project_flow_step_status='completed').exists()
                        if all_project_steps_complated:
                            project_flow_object = step_obj.project_flow
                            project_flow_object.project_flow_status = 'completed'
                            project_flow_object.save()



                ## new for next step 'not sub step'
                step_obj = sub_step_obj.step
                next_step = ProjectFlowStep.objects.filter(
                    project_flow=step_obj.project_flow,
                    sorted_weight__gt=step_obj.sorted_weight
                ).first()
                if next_step:
                    should_auto_start = (
                        next_step.start_process_step_strategy == 'auto' or
                        (
                            next_step.start_process_step_strategy == 'inherit_from_project_flow' and
                            step_obj.project_flow.default_start_process_step_or_sub_step_strategy == 'auto'
                        )
                    )

                    if should_auto_start:
                        if not next_step.ProjectFlowSubStep_step_related_ProjectFlowStep.exists():
                            next_step.project_flow_step_status = 'in_progress'
                            next_step.save()
                        else :
                            first_sub_step = next_step.ProjectFlowSubStep_step_related_ProjectFlowStep.all().first()
                            should_auto_start_first_sub_step = (
                                first_sub_step.start_process_sub_step_strategy == 'auto' or
                                (
                                    first_sub_step.start_process_sub_step_strategy == 'inherit_from_project_flow' and
                                    first_sub_step.step.project_flow.default_start_process_step_or_sub_step_strategy == 'auto'
                                )
                            )
    
                            if should_auto_start_first_sub_step:
                                first_sub_step.project_flow_sub_step_status = 'in_progress'
                                first_sub_step.save()
                                next_step.project_flow_step_status = 'in_progress'
                                next_step.save()

    
                return Response({'message': 'status has been updated'}, status=status.HTTP_200_OK)
        except ProjectFlowStep.DoesNotExist:
            return Response({'message': 'object not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)



 

class StepResortMoveUpOrDownView(APIView):

    permission_classes = [IsStaffOrSuperUser]



    def post(self, request, project_flow_id, step_id, direction):
        step = get_object_or_404(ProjectFlowStep, id=step_id, project_flow=project_flow_id)

        if direction == "up":
            target_step = ProjectFlowStep.objects.filter(
                project_flow=project_flow_id,
                sorted_weight__lt=step.sorted_weight
            ).order_by('-sorted_weight').first()
            if not target_step:
                return Response({"message": "Already at the top"}, status=status.HTTP_200_OK)

        elif direction == "down":
            target_step = ProjectFlowStep.objects.filter(
                 project_flow=project_flow_id,
                sorted_weight__gt=step.sorted_weight
            ).order_by('sorted_weight').first()
            if not target_step:
                return Response({"message": "Already at the bottom"}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Invalid direction"}, status=status.HTTP_400_BAD_REQUEST)

        # Swap weights
        step.sorted_weight, target_step.sorted_weight = target_step.sorted_weight, step.sorted_weight

        # Save both in one query using bulk_update
        ProjectFlowStep.objects.bulk_update([step, target_step], ['sorted_weight'])

        return Response({"message": f"Step moved {direction}"}, status=status.HTTP_200_OK)




class StepResortByAbsolutePositionView(APIView):

    permission_classes = [IsStaffOrSuperUser]




    def post(self, request, project_flow_id, step_id, absolute_position):
        # Get the step
        step = get_object_or_404(ProjectFlowStep, id=step_id,  project_flow=project_flow_id)

        # Get all steps in the project_flow_template ordered by sorted_weight
        steps = list(ProjectFlowStep.objects.filter(
           project_flow=project_flow_id
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
        ProjectFlowStep.objects.bulk_update(steps, ['sorted_weight'])

        return Response({"message": f"Step moved to position {absolute_position}"}, status=status.HTTP_200_OK)






class SubStepResortMoveUpOrDownView(APIView):

    permission_classes = [IsStaffOrSuperUser]



    def post(self, request, step_id, sub_step_id, direction):
        sub_step = get_object_or_404(ProjectFlowSubStep, id=sub_step_id, step=step_id)

        step = sub_step

        if direction == "up":
            target_step = ProjectFlowSubStep.objects.filter(
                step=step_id,
                sorted_weight__lt=step.sorted_weight
            ).order_by('-sorted_weight').first()
            if not target_step:
                return Response({"message": "Already at the top"}, status=status.HTTP_200_OK)

        elif direction == "down":
            target_step = ProjectFlowSubStep.objects.filter(
                step=step_id,
                sorted_weight__gt=step.sorted_weight
            ).order_by('sorted_weight').first()
            if not target_step:
                return Response({"message": "Already at the bottom"}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Invalid direction"}, status=status.HTTP_400_BAD_REQUEST)

        # Swap weights
        step.sorted_weight, target_step.sorted_weight = target_step.sorted_weight, step.sorted_weight

        # Save both in one query using bulk_update
        ProjectFlowSubStep.objects.bulk_update([step, target_step], ['sorted_weight'])

        return Response({"message": f"Step moved {direction}"}, status=status.HTTP_200_OK)




class SubStepResortByAbsolutePositionView(APIView):
    permission_classes = [IsStaffOrSuperUser]




    def post(self, request, step_id, sub_step_id, absolute_position):
        # Get the step
        sub_step = get_object_or_404(ProjectFlowSubStep, id=sub_step_id, step=step_id)

        step = sub_step


        # Get all steps in the project_flow_template ordered by sorted_weight
        steps = list(ProjectFlowSubStep.objects.filter(
           step=step_id
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
        ProjectFlowSubStep.objects.bulk_update(steps, ['sorted_weight'])

        return Response({"message": f"Step moved to position {absolute_position}"}, status=status.HTTP_200_OK)


 
class GetFullProjectFlowView(APIView):

    permission_classes = [IsStaffOrSuperUser]

    def get(self, request, id):
        try:
            obj = ProjectFlow.objects.get(id=id)
            serializer = GetFullProjectFlowSeriallizer(obj, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        except ProjectFlow.DoesNotExist:
            return Response({'object not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e :
            return Response({'message': str(e)}, status=status.HTTP_200_OK)






class ProjectFlowSubStepNoteAttachmentView(APIView):
    permission_classes = [IsStaffOrSuperUser]
    serializer_class = ProjectFlowSubStepNoteAttachmentSerializer 

    def get_serializer(self, *args, **kwargs):
        kwargs.setdefault("context", {'request': self.request})
        return self.serializer_class(*args, **kwargs)

    def post(self, request, note):
        data = request.data.copy()
        data['sub_step_note'] = note 

        serializer = self.get_serializer(data=data)
        if serializer.is_valid():
            list_obj = serializer.save()
            return Response(self.get_serializer(list_obj, many=True).data , status=status.HTTP_201_CREATED)
        else :
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        



    def get(self, request, note, file_id=None):
        if file_id:
            try:
                obj = ProjectFlowSubStepNoteAttachment.objects.get(id=file_id)
                serializer = self.get_serializer(obj)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except ProjectFlowSubStepNoteAttachment.DoesNotExist:
                return Response({'message': "object not found"}, status=status.HTTP_404_NOT_FOUND)
            except Exception as e :
                return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        else:
            list_obj = ProjectFlowSubStepNoteAttachment.objects.filter(sub_step_note=note)
            serializer = self.get_serializer(list_obj, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
    def delete(self, request, note, file_id):
        try:
            obj = ProjectFlowSubStepNoteAttachment.objects.get(id=file_id)
            obj.delete()
            return Response({"message": "object has been deleted"}, status=status.HTTP_202_ACCEPTED)
        except ProjectFlowSubStepNoteAttachment.DoesNotExist:
            return Response({'message': "object not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e :
            return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)




class ProjectFlowSubStepNoteView(APIView):
    permission_classes = [IsStaffOrSuperUser]
    serializer_class  = ProjectFlowSubStepNoteSerializer

    def get_serializer(self, *args, **kwargs):
        """Helper method to create the serializer with request context."""
        kwargs.setdefault('context', {'request': self.request})
        return self.serializer_class(*args, **kwargs)


    def post(self, request, sub_step):
        data = request.data.copy()
        data['sub_step'] = sub_step
        data['sub_step_note_user'] = request.user.pk

        try:
            obj = ProjectFlowSubStep.objects.get(id=sub_step)             
            if obj.step.project_flow.project_flow_status == 'canceled' :
                return Response({'message' : "the projectflow status is 'Canceled' you can't add note! "}, status=status.HTTP_400_BAD_REQUEST)
            elif obj.step.project_flow.project_flow_status == 'completed':
                return Response({'message' : "the projectflow status is 'Completed' you can't add note! "}, status=status.HTTP_400_BAD_REQUEST)
               
        except Exception as e :
                return Response({'message' : str(e)}, status=status.HTTP_400_BAD_REQUEST)



        serializer = self.get_serializer(data=data)
   
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    



    def get(self, request, sub_step , note_id=None):
        if note_id:
            try:
                obj = ProjectFlowSubStepNote.objects.get(id=note_id)
                serializer = self.get_serializer(obj)

                return Response(serializer.data, status=status.HTTP_200_OK)
            except ProjectFlowSubStepNote.DoesNotExist:
                return Response({'message': "object not found"})
            except Exception as e:
                return Response({'message' : str(e)}, status=status.HTTP_400_BAD_REQUEST)
        else:
            list_obj = ProjectFlowSubStepNote.objects.filter(sub_step=sub_step)
            serializer = GetListProjectFlowSubStepNoteSerializer(list_obj, many=True, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)

 
    def put(self, request, sub_step , note_id):
        try:
            obj = ProjectFlowSubStepNote.objects.get(id=note_id)
            serializer = self.get_serializer(obj, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        except ProjectFlowSubStepNote.DoesNotExist:
            return Response({'message': "object not found"})
        except Exception as e:
            return Response({'message' : str(e)}, status=status.HTTP_400_BAD_REQUEST)      

    def delete(self, request, sub_step , note_id):
        if not request.user.is_superuser and not request.user.has_perm('usersAuthApp.projectflow_step_note_delete'):
            return Response({"detail": "Permission denied for this operation."}, status=status.HTTP_403_FORBIDDEN)


        try:
            obj = ProjectFlowSubStepNote.objects.get(id=note_id)
 
            obj.delete()
            return Response({"message": "object has been deleted"}, status=status.HTTP_202_ACCEPTED)
        except ProjectFlowSubStepNote.DoesNotExist:
            return Response({'message': "object not found"})
        except Exception as e:
            return Response({'message' : str(e)}, status=status.HTTP_400_BAD_REQUEST)     






class ProjectFlowSubStepView(APIView):
    permission_classes = [IsStaffOrSuperUser]
    def post(self, request, step):
        data = request.data.copy()
        data['step'] = step

        allowed_process_groups = validate_allowed_process_groups(data)

        if isinstance(allowed_process_groups, Response):
            return allowed_process_groups  # Return validation error if failed

        if allowed_process_groups is not None:
            data.setlist("allowed_process_groups", allowed_process_groups)

        serializer = ProjectFlowSubStepSerializer(data=data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else :
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    def get(self, request, step, sub_step_id=None):
        if sub_step_id:
            try:
                obj = ProjectFlowSubStep.objects.get(id=sub_step_id)
                serializer = ProjectFlowSubStepSerializer(obj, context={'request': request})
                return Response(serializer.data, status=status.HTTP_200_OK)
            except ProjectFlowSubStep.DoesNotExist:
                return Response({"message": "object not found"}, status=status.HTTP_404_NOT_FOUND)
            except Exception as e :
                return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        else:
            list_obj = ProjectFlowSubStep.objects.filter(step=step)
            serializer = ProjectFlowSubStepSerializer(list_obj, many=True, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        

    def put(self, request, step, sub_step_id):

        data = request.data.copy()


        allowed_process_groups = validate_allowed_process_groups(data)

        if isinstance(allowed_process_groups, Response):
            return allowed_process_groups  # Return validation error if failed

        if allowed_process_groups is not None:
            data.setlist("allowed_process_groups", allowed_process_groups)

        try:
            obj = ProjectFlowSubStep.objects.get(id=sub_step_id)
            serializer = ProjectFlowSubStepSerializer(obj, data=data, partial=True,  context={'request': request})
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except ProjectFlowSubStep.DoesNotExist:
            return Response({"message": "object not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e :
            return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)


    def delete(self, request, step, sub_step_id):

        if not request.user.is_superuser and not request.user.has_perm('usersAuthApp.projectflow_step_delete'):
            return Response({"detail": "Permission denied for this operation."}, status=status.HTTP_403_FORBIDDEN)


        try:
            obj = ProjectFlowSubStep.objects.get(id=sub_step_id)
            obj.delete()
            return Response({'message' : "object has been delete"}, status=status.HTTP_202_ACCEPTED)
 
        except ProjectFlowSubStep.DoesNotExist:
            return Response({"message": "object not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e :
            return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)







class ProjectFlowStepNoteAttachmentView(APIView):
    permission_classes = [IsStaffOrSuperUser]
    def post(self, request, note_id):
        data= request.data.copy()
        data['project_flow_step_note'] = note_id

        serializer = ProjectFlowStepNoteAttachmentSerializer(data=data, context={'request': request})
        if serializer.is_valid():
            list_obj = serializer.save()
            return Response(ProjectFlowStepNoteAttachmentSerializer(list_obj, many=True, context={'request': request}).data, status=status.HTTP_201_CREATED)
        
        else :
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    def get(self, request, note_id, file_id=None):

        if file_id:
            try:
                obj = ProjectFlowStepNoteAttachment.objects.get(id=file_id)
                serializer = ProjectFlowStepNoteAttachmentSerializer(obj, context={'request': request})
                return Response(serializer.data, status=status.HTTP_200_OK)
            except ProjectFlowStepNoteAttachment.DoesNotExist:
                return Response({'message': "object not found"})
            except Exception as e:
                return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        else:
            list_obj = ProjectFlowStepNoteAttachment.objects.filter(project_flow_step_note=note_id)
            serializer = ProjectFlowStepNoteAttachmentSerializer(list_obj, many=True, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, note_id, file_id):
        try:
            obj = ProjectFlowStepNoteAttachment.objects.get(id=file_id)
            obj.delete()
            return Response({'message': "object has been deleted"}, status=status.HTTP_200_OK)
        except ProjectFlowStepNoteAttachment.DoesNotExist:
            return Response({'message': "object not found"}, )
        except Exception as e:
            return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)




class ProjectFlowStepNoteView(APIView):
    permission_classes = [IsStaffOrSuperUser]


    def post(self, request, step):
        data = request.data.copy()
        data['project_step'] = step
        data['step_note_user'] = request.user.pk


        try:
            obj = ProjectFlowStep.objects.get(id=step)             
            if obj.project_flow.project_flow_status == 'canceled' :
                return Response({'message' : "the projectflow status is 'Canceled' you can't add note! "}, status=status.HTTP_400_BAD_REQUEST)
            elif obj.project_flow.project_flow_status == 'completed':
                return Response({'message' : "the projectflow status is 'Completed' you can't add note! "}, status=status.HTTP_400_BAD_REQUEST)
               
        except Exception as e :
                return Response({'message' : str(e)}, status=status.HTTP_400_BAD_REQUEST)



        serializer = ProjectFlowStepNoteSerializer(data=data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else :
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    def get(self, request, step, note_id=None):
        if note_id:
            try:
                obj = ProjectFlowStepNote.objects.get(id=note_id)
                serializer = ProjectFlowStepNoteSerializer(obj,  context={'request': request})
                return Response(serializer.data, status=status.HTTP_200_OK)

            except ProjectFlowStepNote.DoesNotExist:
                return Response({'message' : "object not found"}, status=status.HTTP_404_NOT_FOUND)
            except Exception as e :
                return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        else:
            list_obj = ProjectFlowStepNote.objects.filter(project_step=step)
            serializer = GetListProjectFlowStepNoteSerializer(list_obj, many=True,  context={'request': request})

            return Response(serializer.data, status=status.HTTP_200_OK)
        

    def put(self, request, step, note_id):

        try:
            obj = ProjectFlowStepNote.objects.get(id=note_id)
            serializer = ProjectFlowStepNoteSerializer(obj, data=request.data, partial=True,   context={'request': request})

            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        except ProjectFlowStepNote.DoesNotExist:
            return Response({'message' : "object not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e :
            return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)



    def delete(self, request, step, note_id):

        if not request.user.is_superuser and not request.user.has_perm('usersAuthApp.projectflow_step_note_delete'):
            return Response({"detail": "Permission denied for this operation."}, status=status.HTTP_403_FORBIDDEN)




        try:
            obj = ProjectFlowStepNote.objects.get(id=note_id)
            obj.delete()
            return Response({"message": "object has been deleted"}, status=status.HTTP_202_ACCEPTED)

        except ProjectFlowStepNote.DoesNotExist:
            return Response({'message' : "object not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e :
            return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)




class ProjectFlowStepView(APIView):
 
    permission_classes = [IsStaffOrSuperUser]


    def post(self, request, project_flow):
        data = request.data.copy()
        data['project_flow']=  project_flow

        allowed_process_groups = validate_allowed_process_groups(data)

        if isinstance(allowed_process_groups, Response):
            return allowed_process_groups  # Return validation error if failed

        if allowed_process_groups is not None:
            data.setlist("allowed_process_groups", allowed_process_groups)

        serializer = ProjectFlowStepSerializer(data=data, context={'request': request})
        if serializer.is_valid():
            data = serializer.save()
            return Response( ProjectFlowStepSerializer(data, context={'request': request}).data, status=status.HTTP_201_CREATED)
        else :
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, project_flow, step_id=None ) :

        if step_id:
            try:
                obj = ProjectFlowStep.objects.get(id=step_id)
                serializer = ProjectFlowStepSerializer(obj, context={'request': request})
                return Response(serializer.data, status=status.HTTP_200_OK)
            except ProjectFlowStep.DoesNotExist:
                return Response({'message': "object not found"}, status=status.HTTP_404_NOT_FOUND)
            except Exception as e :
                return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        else:
            list_obj = ProjectFlowStep.objects.filter(project_flow=project_flow)
            serializer = ProjectFlowStepSerializer(list_obj, many=True,  context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        

    def put(self, request, project_flow, step_id ):
        try:
            obj = ProjectFlowStep.objects.get(id=step_id)
            data= request.data.copy()

            allowed_process_groups = validate_allowed_process_groups(data)

            if isinstance(allowed_process_groups, Response):
                return allowed_process_groups  # Return validation error if failed

            if allowed_process_groups is not None:
                data.setlist("allowed_process_groups", allowed_process_groups)

            serializer = ProjectFlowStepSerializer(obj, data=data, partial=True,   context={'request': request})
            if serializer.is_valid():
                data = serializer.save()
                return Response(ProjectFlowStepSerializer(data, context={'request': request}).data, status=status.HTTP_202_ACCEPTED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        except ProjectFlowStep.DoesNotExist:
            return Response({'message': "object not found"}, status=status.HTTP_404_NOT_FOUND)
        
        except Exception as e :
            return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)


    def delete(self, request, project_flow, step_id):

        if not request.user.is_superuser and not request.user.has_perm('usersAuthApp.projectflow_step_delete'):
            return Response({"detail": "Permission denied for this operation."}, status=status.HTTP_403_FORBIDDEN)


        try:
            obj = ProjectFlowStep.objects.get(id=step_id)
            obj.delete()
            return Response({'message': "object has been deleted"}, status=status.HTTP_202_ACCEPTED)
            
        except ProjectFlowStep.DoesNotExist:
            return Response({'message': "object not found"}, status=status.HTTP_404_NOT_FOUND)
        
        except Exception as e :
            return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)


 
class ProjectFlowNoteAttachmentView(APIView):

    permission_classes = [IsStaffOrSuperUser]




    def post(self, request, note_id):
        data = request.data.copy()
        data['project_flow_note'] = note_id
        serializer = ProjectFlowNoteAttachmentSerializer(data=data, context={'request': request})
        if serializer.is_valid():
            list_obj = serializer.save()
            return Response( ProjectFlowNoteAttachmentSerializer(list_obj, many=True, context={'request': request}).data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self, request, note_id, file_id=None):
        if file_id:
            try:
                obj = ProjectFlowNoteAttachment.objects.get(id=file_id)
                serializer = ProjectFlowNoteAttachmentSerializer(obj,  context={"request": request})
                return Response(serializer.data, status=status.HTTP_200_OK)
            except ProjectFlowNoteAttachment.DoesNotExist:
                return Response({'message': "object not found"}, status=status.HTTP_404_NOT_FOUND)
            except Exception as e :
                return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        else:
            list_obj = ProjectFlowNoteAttachment.objects.filter(project_flow_note=note_id)
            serializer = ProjectFlowNoteAttachmentSerializer(list_obj, many=True, context={"request": request})
            return Response(serializer.data, status=status.HTTP_200_OK)


    def delete(self, request, note_id, file_id=None):
        try:
            obj = ProjectFlowNoteAttachment.objects.get(id=file_id)
            obj.delete()
            return Response({'message': "object has been deleted"}, status=status.HTTP_202_ACCEPTED)
        except ProjectFlowNoteAttachment.DoesNotExist:
            return Response({'message': "object not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e :
            return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)    



class ProjectFlowNoteView(APIView):

    permission_classes = [IsStaffOrSuperUser]



    def post(self, request, project_flow):
        data = request.data.copy()
        data['project_flow'] = project_flow
        data['created_user'] = request.user.id

        try:
            obj = ProjectFlow.objects.get(id=project_flow)
            if obj.project_flow_status == 'canceled' :
                return Response({'message' : "the projectflow status is 'Canceled' you can't add note! "}, status=status.HTTP_400_BAD_REQUEST)
            elif obj.project_flow_status == 'completed':
                return Response({'message' : "the projectflow status is 'Completed' you can't add note! "}, status=status.HTTP_400_BAD_REQUEST)
               
        except Exception as e :
                return Response({'message' : str(e)}, status=status.HTTP_400_BAD_REQUEST)

        serializer = CreateOrPutProjectFlowNoteSerializer(data=data, context={'request': request})
        if serializer.is_valid():
            obj = serializer.save()
            return Response(ProjectFlowNoteSerializer(obj, context={'request': request}).data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        

    def get(self, request, project_flow , note_id=None):
        if note_id:
            try:
                obj = ProjectFlowNote.objects.get(id=note_id)
                serializer = ProjectFlowNoteSerializer(obj , context={'request': request})
                return Response(serializer.data, status=status.HTTP_200_OK)
            except ProjectFlowNote.DoesNotExist:
                return Response({'message': "object not found"}, status=status.HTTP_404_NOT_FOUND)
            except Exception as e:
                return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        else:
            list_obj = ProjectFlowNote.objects.filter(project_flow=project_flow)
            serializer = ProjectFlowNoteSerializer(list_obj, many=True,  context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        

    def put(self, request,  project_flow , note_id):
        try:
            obj = ProjectFlowNote.objects.get(id=note_id)
            serializer = CreateOrPutProjectFlowNoteSerializer(obj, data=request.data,  context={'request': request}, partial=True)
            if serializer.is_valid():
                obj = serializer.save()
                return Response(ProjectFlowNoteSerializer(obj, context={'request': request}).data, status=status.HTTP_202_ACCEPTED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except ProjectFlowNote.DoesNotExist:
            return Response({'message': "object not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)


    def delete(self, request,  project_flow , note_id):
        if not request.user.is_superuser and not request.user.has_perm('usersAuthApp.projectflow_note_delete'):
            return Response({"detail": "Permission denied for this operation."}, status=status.HTTP_403_FORBIDDEN)

        try:
            obj = ProjectFlowNote.objects.get(id=note_id)
            obj.delete()
            return Response({'message': "object has been deleted"}, status=status.HTTP_202_ACCEPTED)
        except ProjectFlowNote.DoesNotExist:
            return Response({'message': "object not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)

 
from django.db.models import Q
from .mount_template_views import clone_project_flow_template

class ProjectFlowView(APIView):


    permission_classes = [IsStaffOrSuperUser]



    def post(self, request):
 

        if not request.user.is_superuser and not request.user.has_perm('usersAuthApp.projectflow_create_behalf_client'):
            return Response({"detail": "Permission denied for this operation."}, status=status.HTTP_403_FORBIDDEN)





        data = request.data.copy()
        data['project_user'] =  request.data.get("project_user", None)
        data['created_ip_address'] = get_client_ip(request)

        serializer = CreateOrPutObjectProjectFlowSerializer(data=data , context={'request': request})

        if serializer.is_valid():

            obj_data =  serializer.save( project_created_user = request.user)

            #new logic 

            if (obj_data.project_type and 
                obj_data.project_type.is_auto_clone_template and 
                obj_data.project_type.default_template_to_clone is not None):
                    clone_project_flow_template(request, obj_data.project_type.default_template_to_clone.id, obj_data.id)



            # end new logic


            return Response(GetObjectProjectFlowSerializer(obj_data,  context={'request': request} ).data , status=status.HTTP_201_CREATED)
            # return Response(serializer.data , status=status.HTTP_201_CREATED)

        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
 
        
    def get(self, request, id=None):
        if id:
            try:
                obj = ProjectFlow.objects.get(id=id)
                serializer = GetObjectProjectFlowSerializer(obj, context={'request':request}) 
                return Response(serializer.data, status=status.HTTP_200_OK)
            
            except ProjectFlow.DoesNotExist:
                return Response({'message': "object not found"}, status=status.HTTP_404_NOT_FOUND)
            except Exception as e :
                return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)
            
        else:
            list_obj = ProjectFlow.objects.all()


            ProjectType_Name = request.query_params.get('ProjectType_Name', None)
            status_query = request.query_params.get('status', None)
            user_id_query = request.query_params.get('userId', None)
            project_id_query = request.query_params.get('projectId', None)





            if ProjectType_Name:
                list_obj = list_obj.filter(
                    Q(project_type_name__icontains=ProjectType_Name) |
                    Q(project_type__project_name_ar__icontains=ProjectType_Name)
                
                ) 


            # start new search
            if status_query and status_query != 'all':
                list_obj = list_obj.filter(project_flow_status=status_query)

            if user_id_query and user_id_query != 'all':
                list_obj = list_obj.filter(project_user=user_id_query)

                
            if project_id_query :
                list_obj = list_obj.filter(id=project_id_query)


            # end new search

 
            paginator = MyCustomPagination()
            page = paginator.paginate_queryset(list_obj, request)
            serializer = GetListProjectFlowSerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data) 
       

    def put(self, request, id):
        try:
            obj = ProjectFlow.objects.get(id=id)
            serializer = CreateOrPutObjectProjectFlowSerializer(obj, data=request.data, context={'request':request}, partial=True) 
            if serializer.is_valid():
                obj = serializer.save()
                return Response(GetObjectProjectFlowSerializer(obj, context={'request':request}).data , status=status.HTTP_202_ACCEPTED)
            else :
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except ProjectFlow.DoesNotExist:
            return Response({'message': "object not found"}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, id):


        if not request.user.is_superuser and not request.user.has_perm('usersAuthApp.projectflow_delete'):
            return Response({"detail": "Permission denied for this operation."}, status=status.HTTP_403_FORBIDDEN)







        try:
            obj = ProjectFlow.objects.get(id=id)
            obj.delete()
            return Response({'message': "object has been deleted"}, status=status.HTTP_202_ACCEPTED)
        except ProjectFlow.DoesNotExist:
            return Response({'message': "object not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e :
            return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)


 

class ProjectFlowAttachmentView(APIView):

    permission_classes = [IsStaffOrSuperUser]





    def post(self, request, project_flow ):
        data = request.data.copy()
        data['project_flow'] = project_flow

        serializer = CreateProjectFlowAttachmentSerializer(data=data, context={'request': request})
        
        if serializer.is_valid():
            list_obj = serializer.save()
            return Response(ProjectFlowAttachmentSerializer(list_obj, many=True, context={'request': request}).data, status=status.HTTP_201_CREATED)
        else :
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    def get(self, request, project_flow,  file_id=None):

        if file_id:

            try:
                obj = ProjectFlowAttachment.objects.get(id=file_id)
                serializer =  ProjectFlowAttachmentSerializer(obj, context={'request': request})
                return Response(serializer.data,status=status.HTTP_200_OK)
            except ProjectFlowAttachment.DoesNotExist:
                return Response({'message': "object not found"}, status=status.HTTP_404_NOT_FOUND)
            except Exception as e:
                return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        else:
            list_obj = ProjectFlowAttachment.objects.filter(project_flow=project_flow)
            serializer = ProjectFlowAttachmentSerializer(list_obj, many=True, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)


    def delete(self, request, project_flow,  file_id):
        try:
            obj = ProjectFlowAttachment.objects.get(id=file_id)
            obj.delete()
            return Response({'message': "object has been deleted"})
        
        except ProjectFlowAttachment.DoesNotExist:
            return Response({'message': "object not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)        


 