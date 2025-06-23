 

# Create your views here.
from .myserializers import (CreateTicketSerializer,TicketSerializer,
                            CreateTicketReplaySerializer, TicketListSerializer,
                            DepartmentSerializer
                            )


from rest_framework import status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework.pagination import PageNumberPagination
from django.db.models import Q

# from urllib.parse import quote as urlquote  # Use urllib's quote
from .models import TicketFiles, TicketReplyFiles, Ticket, Department, TicketReplay
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.http import HttpResponseForbidden, FileResponse
from mimetypes import guess_type
 















class CloseTicketView(APIView):

	def post(self, request, ticket_id, *args, **kwargs):
		# Get the ticket
		ticket = get_object_or_404(Ticket, id=ticket_id)

		if ticket.ticket_closed_by is not None:
			return Response({"message": "Ticket already closed."}, status=status.HTTP_400_BAD_REQUEST)


		# Update the ticket's status and closed_by fields
		ticket.ticket_status = 'solved'
		ticket.ticket_closed_by = request.user
		ticket.save()

		# Add a reply indicating the ticket was closed
		TicketReplay.objects.create(
			ticket_replay_ticket=ticket,
			ticket_replay_from=request.user,
			ticket_replay_body="This ticket has been closed after being resolved."
		)

		return Response({"message": "Ticket successfully closed."}, status=status.HTTP_200_OK)



class ReopenTicketView(APIView):

	def post(self, request, ticket_id, *args, **kwargs):
		# Get the ticket
		ticket = get_object_or_404(Ticket, id=ticket_id)

		if ticket.ticket_closed_by is None:
			return Response({"message": "Ticket already not closed ."}, status=status.HTTP_400_BAD_REQUEST)
		
		# Update the ticket's status and clear closed_by field
		ticket.ticket_status = 'open'
		ticket.ticket_closed_by = None
		ticket.ticket_assigned_to = request.user
		ticket.save()

		# Add a reply indicating the ticket was reopened
		TicketReplay.objects.create(
			ticket_replay_ticket=ticket,
			ticket_replay_from=request.user,
			ticket_replay_body="This ticket has been re-opened."
		)

		return Response({"message": "Ticket successfully reopened."}, status=status.HTTP_200_OK)








class DepartmentsView(APIView):
    def get(self, request, *args, **kwargs):
        data = Department.objects.all()
        serializer = DepartmentSerializer(data, many=True, context={'request': request})
        return Response(serializer.data)



class TicketReplayView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request, *args, **kwargs):

        serializer = CreateTicketReplaySerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            replay_ticket = serializer.save()  # This will also save ticket files
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




class MyCustomPagination(PageNumberPagination):
    page_size = 5
    page_size_query_param = 'page_size'
               
    def get_current_page_url(self):
        if not self.request:
            return None
        current_page = self.page.number
        request = self.request
        url = request.build_absolute_uri(request.path)
        query_params = request.query_params.copy()
        query_params[self.page_query_param] = current_page

        return f"{url}?{query_params.urlencode()}"

    def get_paginated_response(self, data):
        return Response({
        'page_size': self.page_size,
        'total_objects': self.page.paginator.count,
        'total_objects_in_current_page': len(data),
        'total_pages': self.page.paginator.num_pages,
        'current_page_number': self.page.number,
        'next_page_url': self.get_next_link(),
        'previous_page_url': self.get_previous_link(),
        'current_page_url': self.get_current_page_url(),

        'results': data,
        })



class TicketView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = CreateTicketSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            ticket = serializer.save()  # This will also save ticket files
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self, request, *args, **kwargs):
            # Retrieve a specific ticket by its ID
            ticket_slug = kwargs.get('slug')
            user = request.user


            if ticket_slug:
                ticket = get_object_or_404(Ticket, ticket_slog=ticket_slug, ticket_user=user)
                serializer = TicketSerializer(ticket, context={'request': request})
                return Response(serializer.data, status=status.HTTP_200_OK)


            else:
                tickets = Ticket.objects.filter(ticket_user=user)

 
                search_query = request.query_params.get('search', None)
                status_query = request.query_params.get('status', None) 
                if search_query:
                    tickets = tickets.filter(
                        Q(ticket_subject__icontains=search_query) |
                        Q(ticket_body__icontains=search_query)
                    ) 
                if status_query and status_query != 'all':
                    tickets = tickets.filter(ticket_status=status_query)

                paginator = MyCustomPagination()
                page = paginator.paginate_queryset(tickets, request)

                serializer = TicketListSerializer(page, many=True)
                return paginator.get_paginated_response(serializer.data)            
            
 






class TicketProtectedMediaView(APIView):

    
    def get(self, request, file_name, *args, **kwargs):
        # Ensure the user is authenticated (the permission classes do this)
        if request.user.is_authenticated:
            # Check if the file is from the ticket files or ticket reply files
            if 'ticket_files' in request.path:
                # Lookup for ticket file
                ticket_file = get_object_or_404(TicketFiles, ticket_file_ticket_file__icontains=file_name)
                # ticket_file = get_object_or_404(TicketFiles, ticket_file_name=file_name)


                ticket = ticket_file.ticket_file_ticket
                file_path = ticket_file.ticket_file_ticket_file.path
            elif 'ticket_replay_files' in request.path:
                # Lookup for ticket reply file
                reply_file = get_object_or_404(TicketReplyFiles, ticket_replay_file__icontains=file_name)
                # reply_file = get_object_or_404(TicketReplyFiles, ticket_replay_file_name=file_name)




                ticket = reply_file.ticket_replay_file_ticket_replay.ticket_replay_ticket
                file_path = reply_file.ticket_replay_file.path
            else:
                return HttpResponseForbidden("Invalid file path")

            # Permission check: Only allow access to the file if the user is a superuser, staff, or the ticket owner
            if request.user.is_superuser or request.user.is_staff or ticket.ticket_user == request.user:
                try:
                    # Determine the file's MIME type
                    mime_type, _ = guess_type(file_path)
                    if not mime_type:
                        mime_type = 'application/octet-stream'  # Default if type cannot be guessed
                    
                    # Open the file and send it as a response
                    response = FileResponse(open(file_path, 'rb'))
                    response['Content-Type'] = mime_type  # Set appropriate content type
                    return response
                except FileNotFoundError:
                    return HttpResponseForbidden("File not found")
            else:
                return HttpResponseForbidden("You do not have permission to access this file")
        else:
            return HttpResponseForbidden("Authentication required")









from projectFlowApp.models.project_flow_models import ( ProjectFlowAttachment, ProjectFlowNoteAttachment, ProjectFlowStepNoteAttachment,
                                                    ProjectFlowSubStepNoteAttachment,
                                                        )





class ProjectFlowProtectedMediaView(APIView):

    
    def get(self, request, file_name, *args, **kwargs):
        # Ensure the user is authenticated (the permission classes do this)
        if request.user.is_authenticated:
            # Check if the file is from the ticket files or ticket reply files
            if 'ProjectFlowAttachment' in request.path:
 
                file_obj = get_object_or_404(ProjectFlowAttachment, file__icontains=file_name)
                try:
                    project_flow_obj = file_obj.project_flow
                except:
                    project_flow_obj =  None                     
                file_path = file_obj.file.path
 
 
            elif 'ProjectFlowNoteAttachment' in request.path:
                file_obj = get_object_or_404(ProjectFlowNoteAttachment, file__icontains=file_name)
                try:
                    project_flow_obj = file_obj.project_flow_note.project_flow
                except :
                    project_flow_obj = None                     
                file_path = file_obj.file.path

 
            elif 'ProjectFlowStepNoteAttachment' in request.path:
                file_obj = get_object_or_404(ProjectFlowStepNoteAttachment, file__icontains=file_name)
                try:
                    project_flow_obj = file_obj.project_flow_step_note.project_step.project_flow
                except :
                    project_flow_obj = None                     
                file_path = file_obj.file.path

            elif 'ProjectFlowSubStepNoteAttachment' in request.path:
                file_obj = get_object_or_404(ProjectFlowSubStepNoteAttachment, file__icontains=file_name)
                try:
                    project_flow_obj = file_obj.sub_step_note.sub_step.step.project_flow
                except :
                    project_flow_obj = None                     
                file_path = file_obj.file.path






            else:
                return HttpResponseForbidden("Invalid file path")

            # Permission check: Only allow access to the file if the user is a superuser, staff, or the ticket owner



            if project_flow_obj is None:
                return HttpResponseForbidden("No associated projectFlow found for this file.")



            if request.user.is_superuser or request.user.is_staff or project_flow_obj.project_user == request.user:
                try:
                    # Determine the file's MIME type
                    mime_type, _ = guess_type(file_path)
                    if not mime_type:
                        mime_type = 'application/octet-stream'  # Default if type cannot be guessed
                    
                    # Open the file and send it as a response
                    response = FileResponse(open(file_path, 'rb'))
                    response['Content-Type'] = mime_type  # Set appropriate content type
                    return response
                except FileNotFoundError:
                    return HttpResponseForbidden("File not found")
            else:
                return HttpResponseForbidden("You do not have permission to access this file")
        else:
            return HttpResponseForbidden("Authentication required")









from projectFlowApp.models.project_flow_template_models import (ProjectFlowTemplateNoteAttachment , StepTemplateNoteAttachment, SubStepTemplateNoteAttachment)




class ProjectFlowTemplateProtectedMediaView(APIView):

    
    def get(self, request, file_name, *args, **kwargs):
        # Ensure the user is authenticated (the permission classes do this)
        if request.user.is_authenticated:
            # Check if the file is from the ticket files or ticket reply files
            if 'ProjectFlowTemplateNoteAttachment' in request.path: 
                file_obj = get_object_or_404(ProjectFlowTemplateNoteAttachment, file__icontains=file_name)                  
                file_path = file_obj.file.path
 

            elif 'StepTemplateNoteAttachment' in request.path: 
                file_obj = get_object_or_404(StepTemplateNoteAttachment, file__icontains=file_name)                  
                file_path = file_obj.file.path

            elif 'SubStepTemplateNoteAttachment' in request.path: 
                file_obj = get_object_or_404(SubStepTemplateNoteAttachment, file__icontains=file_name)                  
                file_path = file_obj.file.path


            else:
                return HttpResponseForbidden("Invalid file path")

            # Permission check: Only allow access to the file if the user is a superuser, staff, or the ticket owner

            if request.user.is_superuser or request.user.is_staff :
                try:
                    # Determine the file's MIME type
                    mime_type, _ = guess_type(file_path)
                    if not mime_type:
                        mime_type = 'application/octet-stream'  # Default if type cannot be guessed
                    
                    # Open the file and send it as a response
                    response = FileResponse(open(file_path, 'rb'))
                    response['Content-Type'] = mime_type  # Set appropriate content type
                    return response
                except FileNotFoundError:
                    return HttpResponseForbidden("File not found")
            else:
                return HttpResponseForbidden("You do not have permission to access this file")
        else:
            return HttpResponseForbidden("Authentication required")

















# elif 'ProjectFlowTemplateNoteAttachment' in request.path:
#     file_obj = get_object_or_404( ProjectFlowTemplateNoteAttachment, file__icontains=file_name)
#     try:
#         project_flow_obj =  
#     except :
#         project_flow_obj = None                     
#     file_path = file_obj.file.path