from django.shortcuts import render
from ..models import ProjectType, ProjectFlow, ProjectFlowStepNote
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny

from projectFlowApp.custom_app_utils import MyCustomPagination
 
from ..serializers_module.site_serializer import (
    ProjectTypeListSerializer, ProjectTypeObjectSerializer,
    CreateProjectFlowSerializer,
    ProjectFlowSerializer,
    ProjectFlowNoteSerializer,
    ProjectFlowNoteAttachmentSerializer,
    GetListProjectFlowNoteSerializer,
    ProjectFlowStepNoteSerializer, GetProjectFlowStepNoteSerializer,
    GetProjectFlowSubStepNoteSerializer, ProjectFlowSubStepNoteSerializer, InstalledProductSerializer
    )

from ..serializers_module.get_full_projectFlow.site_get_full_project_flow import SiteGetFullProjectFlowSerializer 


from rest_framework import status
from rest_framework.response import Response

from ..models.project_flow_models import (ProjectFlow, ProjectFlowNote, ProjectFlowNoteAttachment,
                                        ProjectFlowSubStepNote, ProjectFlowSubStep, ProjectFlowStep, InstalledProduct
                                        ) 

from django.db import transaction



from .mount_template_views import clone_project_flow_template



class StartStepProcess(APIView):
    def post(self, request,project_flow, step_id):


        try:
            obj = ProjectFlowStep.objects.get(id=step_id)      

            if obj.project_flow.project_user != request.user:
                return Response({'message' : "this projectFlow is not related with your user"}, status=status.HTTP_400_BAD_REQUEST)

            elif obj.project_flow.project_flow_status == 'canceled' :
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
    def post(self, request, project_flow, step_id):

        try:
            obj = ProjectFlowStep.objects.get(id=step_id)     

            if obj.project_flow.project_user != request.user:
                return Response({'message' : "this projectFlow is not related with your user"}, status=status.HTTP_400_BAD_REQUEST)

            elif obj.project_flow.project_flow_status == 'canceled' :
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
    def post(self, request, step_id, sub_step_id):

        try:
            obj = ProjectFlowSubStep.objects.get(id=sub_step_id)  

            if obj.step.project_flow.project_user != request.user:
                return Response({'message' : "this projectFlow is not related with your user"}, status=status.HTTP_400_BAD_REQUEST)


            elif obj.step.project_flow.project_flow_status == 'canceled' :
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
    def post(self, request, step_id, sub_step_id):


        try:
            obj = ProjectFlowSubStep.objects.get(id=sub_step_id)     

            if obj.step.project_flow.project_user != request.user:
                return Response({'message' : "this projectFlow is not related with your user"}, status=status.HTTP_400_BAD_REQUEST)

            elif obj.step.project_flow.project_flow_status == 'canceled' :
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













class ProjectFlowSubStepNoteView(APIView):

    def post(self,request,  sub_step):

        try:
            sub_step_obj = ProjectFlowSubStep.objects.get(id=sub_step)
        except ProjectFlowSubStep.DoesNotExist:
            return Response({"message": "sub_step object not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e :
            return Response({"message" : str(e)}, status=status.HTTP_400_BAD_REQUEST)


        if (
            not (getattr(sub_step_obj.step.project_flow, "project_user", None) == request.user)
            or sub_step_obj.allowed_process_by != "client"
        ):
            return Response(
                {"message": "You are not authorized to add a note for this object!"},
                status=status.HTTP_403_FORBIDDEN,
            )
 





        data = request.data.copy()
        data['sub_step'] = sub_step
        data['sub_step_note_user'] = request.user.id

        try:
            obj = ProjectFlowSubStep.objects.get(id=sub_step)             
            if obj.step.project_flow.project_flow_status == 'canceled' :
                return Response({'message' : "the projectflow status is 'Canceled' you can't add note! "}, status=status.HTTP_400_BAD_REQUEST)
            elif obj.step.project_flow.project_flow_status == 'completed':
                return Response({'message' : "the projectflow status is 'Completed' you can't add note! "}, status=status.HTTP_400_BAD_REQUEST)
               
        except Exception as e :
                return Response({'message' : str(e)}, status=status.HTTP_400_BAD_REQUEST)




        serializer = ProjectFlowSubStepNoteSerializer(data=data, context={'request': request})
        if serializer.is_valid():
            obj = serializer.save()
            return Response(GetProjectFlowSubStepNoteSerializer(obj, context={'request': request}).data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, sub_step, note_id=None):
        if note_id:
            try:
                obj = ProjectFlowSubStepNote.objects.get(id=note_id)
                serializer = GetProjectFlowSubStepNoteSerializer(obj, context={'request': request})
                return Response(serializer.data , status=status.HTTP_200_OK )
            except ProjectFlowSubStepNote.DoesNotExist:
                return Response({'message': 'object not found'} , status=status.HTTP_404_NOT_FOUND )
            except Exception as e:
                return Response({'message': str(e)} , status=status.HTTP_400_BAD_REQUEST )
        else:
            list_obj = ProjectFlowSubStepNote.objects.filter(sub_step=sub_step)
            serializer = GetProjectFlowSubStepNoteSerializer(list_obj, many=True, context={'request': request})
            return Response(serializer.data , status=status.HTTP_200_OK )



class ProjectFlowStepNoteView(APIView):

    def post(self, request, step):

        try:
            step_obj = ProjectFlowStep.objects.get(id=step)
        except ProjectFlowStep.DoesNotExist:
            return Response({"message": "step_obj object not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e :
            return Response({"message" : str(e)}, status=status.HTTP_400_BAD_REQUEST)


        if (
            not (getattr(step_obj.project_flow, "project_user", None) == request.user)
            or step_obj.allowed_process_by != "client"
        ):
            return Response(
                {"message": "You are not authorized to add a note for this object!"},
                status=status.HTTP_403_FORBIDDEN,
            )



        data = request.data.copy()
        data['step_note_user'] = request.user.id
        data['project_step'] = step

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
            res = serializer.save()
            return Response(GetProjectFlowStepNoteSerializer(res, context={'request': request}).data, status=status.HTTP_201_CREATED)
        else :
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    

    def get(self, request, step, note_id=None):
        if note_id:
            try:
                obj =  ProjectFlowStepNote.objects.get(id=note_id)
                serializer = GetProjectFlowStepNoteSerializer(obj, context={'request': request})
                return Response(serializer.data, status=status.HTTP_200_OK)
            except ProjectFlowStepNote.DoesNotExist:
                return Response({'message': 'object not found'}, status=status.HTTP_404_NOT_FOUND)
            except Exception as e :
                return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        else:
            list_obj = ProjectFlowStepNote.objects.filter(project_step=step)
            serializer = GetProjectFlowStepNoteSerializer(list_obj, many=True, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)








class ProjectFlowNoteAttachmentView(APIView):

    def post(self, request, note_id):

        try:
            obj = ProjectFlowNote.objects.get(id=note_id)
        except ProjectFlowNote.DoesNotExist:
            return Response({"message": "object not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e :
            return Response({"message" : str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        if not obj.created_user == request.user:
            return Response({"message" : "you are not authorized to add files for this note !"}, status=status.HTTP_403_FORBIDDEN)

        data = request.data.copy()
        data['project_flow_note'] = note_id
        serializer = ProjectFlowNoteAttachmentSerializer(data=data, context={'request': request})
        if serializer.is_valid():
            list_data = serializer.save()
            return Response(ProjectFlowNoteAttachmentSerializer(list_data,many=True, context={'request': request}).data , status=status.HTTP_201_CREATED)

        else :
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, note_id, file_id=None):
        try:
            obj = ProjectFlowNote.objects.get(id=note_id)
        except ProjectFlowNote.DoesNotExist:
            return Response({"message": "object not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e :
            return Response({"message" : str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        if not obj.created_user == request.user:
            return Response({"message" : "you are not authorized to add files for this note !"}, status=status.HTTP_403_FORBIDDEN)

        if file_id:
            try:
                obj = ProjectFlowNoteAttachment.objects.get(id=file_id, project_flow_note=note_id)
                serializer = ProjectFlowNoteAttachmentSerializer(obj, context={'request': request})
                return Response(serializer.data, status=status.HTTP_200_OK)
            except ProjectFlowNoteAttachment.DoesNotExist:
                return Response({"message": "object not found"}, status=status.HTTP_404_NOT_FOUND)
            except Exception as e :
                return Response({"message" : str(e)}, status=status.HTTP_400_BAD_REQUEST)
        else:
            data = obj.ProjectFlowNoteAttachment_project_flow_note_related_ProjectFlowNote.all()
            serializer = ProjectFlowNoteAttachmentSerializer(data,many=True, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)







class ProjectFlowNoteView(APIView):

    def post(self, request, project_flow_id):

        try:
            project_flow_obj = ProjectFlow.objects.get(id=project_flow_id)
        except ProjectFlow.DoesNotExist:
            return Response({"message": "object not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e :
            return Response({"message" : str(e)}, status=status.HTTP_400_BAD_REQUEST)


        if not project_flow_obj.project_user == request.user:
            return Response({"message" : "you are not authorized to add a note for this project flow !"}, status=status.HTTP_403_FORBIDDEN)




        data = request.data.copy()
        data["created_user"] = request.user.pk
        data["project_flow"] = project_flow_id
        data["show_to_client"] = True


        try:
            obj = ProjectFlow.objects.get(id=project_flow_id)
            if obj.project_flow_status == 'canceled' :
                return Response({'message' : "the projectflow status is 'Canceled' you can't add note! "}, status=status.HTTP_400_BAD_REQUEST)
            elif obj.project_flow_status == 'completed':
                return Response({'message' : "the projectflow status is 'Completed' you can't add note! "}, status=status.HTTP_400_BAD_REQUEST)
               
        except Exception as e :
                return Response({'message' : str(e)}, status=status.HTTP_400_BAD_REQUEST)






        serializer = ProjectFlowNoteSerializer(data=data, context={"request": request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else :
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    def get(self , request,project_flow_id, note_id=None):
        try:
            project_flow_obj = ProjectFlow.objects.get(id=project_flow_id)
        except ProjectFlow.DoesNotExist:
            return Response({"message": "Project flow object not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e :
            return Response({"message" : str(e)}, status=status.HTTP_400_BAD_REQUEST)

        if not project_flow_obj.project_user == request.user:
            return Response({"message" : "you are not authorized to access this information !"}, status=status.HTTP_403_FORBIDDEN)

        if note_id:
            try:
                obj = ProjectFlowNote.objects.get(id=note_id, project_flow=project_flow_id)
                serializer = ProjectFlowNoteSerializer(obj, context={'request': request})
                return Response(serializer.data, status=status.HTTP_200_OK)
            except ProjectFlowNote.DoesNotExist:
                 return Response({"message": "Note object not found"}, status=status.HTTP_404_NOT_FOUND)
            except Exception as e :
                return Response({"message" : str(e)}, status=status.HTTP_400_BAD_REQUEST)
        else:
            list_obj = project_flow_obj.ProjectFlowNote_project_flow_related_ProjectFlow.all()
            serializer = GetListProjectFlowNoteSerializer(list_obj , many=True, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)




# from rest_framework.pagination import PageNumberPagination

# class MyCustomPagination(PageNumberPagination):
#     page_size = 5
#     page_size_query_param = 'page_size'
               
#     def get_current_page_url(self):
#         if not self.request:
#             return None
#         current_page = self.page.number
#         request = self.request
#         url = request.build_absolute_uri(request.path)
#         query_params = request.query_params.copy()
#         query_params[self.page_query_param] = current_page

#         return f"{url}?{query_params.urlencode()}"

#     def get_paginated_response(self, data):
#         return Response({
#         'page_size': self.page_size,
#         'total_objects': self.page.paginator.count,
#         'total_objects_in_current_page': len(data),
#         'total_pages': self.page.paginator.num_pages,
#         'current_page_number': self.page.number,
#         'next_page_url': self.get_next_link(),
#         'previous_page_url': self.get_previous_link(),
#         'current_page_url': self.get_current_page_url(),

#         'results': data,
#         })


from django.db.models import Q

from projectFlowApp.custom_app_utils import get_client_ip


class ProjectFlowView(APIView):
 

    def post(self, request):
        data = request.data.copy()
        data['project_user'] = request.user.pk
        data['project_created_user'] = request.user.pk
        data['created_ip_address'] = get_client_ip(request)

 
        # return Response({"message" : "error x from back"}, status=status.HTTP_400_BAD_REQUEST)

        serializer = CreateProjectFlowSerializer(data=data , context={'request' : request})
        if serializer.is_valid():
            obj = serializer.save()
            # new logic
            if (obj.project_type and 
                obj.project_type.is_auto_clone_template and 
                obj.project_type.default_template_to_clone is not None):
                clone_project_flow_template(request, obj.project_type.default_template_to_clone.id, obj.id)

            # end new logic




            return Response(ProjectFlowSerializer(obj, context={'request': request}).data , status=status.HTTP_201_CREATED )
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    def get(self, request, project_flow_slug=None):
      
        if project_flow_slug:
            try:
                obj = ProjectFlow.objects.get(project_flow_slug=project_flow_slug, project_user=request.user)
                serializer = SiteGetFullProjectFlowSerializer(obj,  context={"request": request})
                return Response(serializer.data, status=status.HTTP_200_OK)

            except ProjectFlow.DoesNotExist:
                return Response({"message" : "object not found"}, status=status.HTTP_404_NOT_FOUND)
        else :
            obj_list = ProjectFlow.objects.filter(project_user=request.user)

            search_query = request.query_params.get('search', None)
            status_query = request.query_params.get('status', None) 
            if search_query:
                obj_list = obj_list.filter(
                    Q(project_type_name__icontains=search_query) |
                    Q(project_type_name_ar__icontains=search_query)
                ) 
            if status_query and status_query != 'all':
                obj_list = obj_list.filter(project_flow_status=status_query)

            paginator = MyCustomPagination()
            page = paginator.paginate_queryset(obj_list, request)
            serializer = ProjectFlowSerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)            





class InstalledProductView(APIView):

    def get(self, request, projectflow ):

        try:
            projectflow_obj =ProjectFlow.objects.get(id=projectflow)
        except ProjectFlow.DoesNotExist: 
            return Response({'message': 'projectflow object not found'}, status=status.HTTP_404_NOT_FOUND)
        list_obj = InstalledProduct.objects.filter(project_flow=projectflow_obj)
        serializer = InstalledProductSerializer(list_obj, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

 
    
 




  

class ProjectTypeView(APIView):
    permission_classes =  [AllowAny]
 
    def get(self, request, project_slog=None ):

        if project_slog:
            try:
                project_obj = ProjectType.objects.get(project_slog=project_slog)
                serializer = ProjectTypeObjectSerializer(project_obj, many=False, context={'request': request})                
                return Response(serializer.data, status=status.HTTP_200_OK)
            except ProjectType.DoesNotExist:
                return Response({"message" : "object not found"},  status=status.HTTP_404_NOT_FOUND)

        else:

            project_list = ProjectType.objects.all()
            serializer = ProjectTypeListSerializer(project_list, many=True, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)
    






    







