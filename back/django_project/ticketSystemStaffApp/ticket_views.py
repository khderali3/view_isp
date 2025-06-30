## staff ticket view

from django.shortcuts import render
from ticketSystemApp.models import Department, Ticket, TicketFiles, TicketReplay
from rest_framework.views import APIView
from .my_serializers import (DepartmentStaffSerializer, CreateTicketStaffSerializer, ChangeTicketStaffSerializer,
							 TicketStaffSerializer, TicketListStaffSerializer, TicketFileStaffSerializer,
							  TicketAssignStaffSerializer, GetTicketByIdStaffSerializer
                             
							 
							 )
from rest_framework.response import Response

from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.db.models import BooleanField, Case, Value, When

from .my_utils import IsStaffOrSuperUser, HasUserManagementPermission, license_required





from django.db.models import Count

class TicketStatusCountAPIView(APIView):
	def get(self, request):
		all_statuses = dict(Ticket.ticket_status_options)


		result = {}
		for status in all_statuses.keys():
			result[status] = 0


		counts = Ticket.objects.values('ticket_status').order_by().annotate(count=Count('id'))

		for item in counts:
			status = item['ticket_status']
			count = item['count']
			result[status] = count

		# Add total count of all tickets cts
		total_projects = Ticket.objects.count()
		result['all'] = total_projects

		return Response(result)








class AssignTicketToMeStaffView(APIView):
	permission_classes = [IsStaffOrSuperUser]


	@license_required
	def post(self, request, ticket_id, *args, **kwargs):
		try:
			ticket = Ticket.objects.get(id=ticket_id)
		except Ticket.DoesNotExist:
			return Response({"message": "Ticket not found."}, status=status.HTTP_404_NOT_FOUND)

		# Assign the ticket to the current user
		ticket.ticket_assigned_to = request.user
		ticket.save()

		return Response({"message": "Ticket assigned to you successfully."}, status=status.HTTP_200_OK)


class AssignReassignTicketStaffView(APIView):
	def post(self, request, ticket_id, *args, **kwargs):
		try:
			ticket = Ticket.objects.get(id=ticket_id)
		except Ticket.DoesNotExist:
			return Response({"message": "Ticket not found."}, status=status.HTTP_404_NOT_FOUND)

		# Use the serializer to validate the data from the request body
		serializer = TicketAssignStaffSerializer(ticket, data=request.data)

		if serializer.is_valid():
			# The save method will update the ticket_assigned_to field and save the ticket
			serializer.save()

			return Response({"message": "Ticket assigned successfully."}, status=status.HTTP_200_OK)
		else:
			return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)







class CloseTicketStaffView(APIView):
	permission_classes = [IsStaffOrSuperUser]

	@license_required
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



class ReopenTicketStaffView(APIView):
	permission_classes = [IsStaffOrSuperUser]

	@license_required
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




class DepartmentsStaffView(APIView):

	# permission_classes = [IsStaffOrSuperUser, HasUserManagementPermission]


	def get_permissions(self):
		"""
		Override this method to customize permissions based on the HTTP method.
		"""
		if self.request.method != 'GET':
			# Apply HasUserManagementPermission for all methods except GET
			return [IsStaffOrSuperUser(), HasUserManagementPermission()]
		# For GET, only use IsStaffOrSuperUser
		return [IsStaffOrSuperUser()]






	def get(self, request, *args, **kwargs):
		department_id = kwargs.get('id')
		if department_id:
			try:
				department = Department.objects.get(id=department_id)
			except Department.DoesNotExist:
				return Response({"detail": "Department not found."}, status=status.HTTP_404_NOT_FOUND)
			serializer = DepartmentStaffSerializer(department, context={'request': request})
			return Response(serializer.data)
		else:
			departments = Department.objects.all()
			serializer = DepartmentStaffSerializer(departments, many=True, context={'request': request})
			return Response(serializer.data)

	def post(self, request, *args, **kwargs):
		serializer = DepartmentStaffSerializer(data=request.data, context={'request': request})
		if serializer.is_valid():
			serializer.save()  # This will create a new department
			return Response(serializer.data, status=status.HTTP_201_CREATED)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

	def put(self, request, *args, **kwargs):
			department_id = kwargs.get('id')
			try:
				department = Department.objects.get(id=department_id)
			except Department.DoesNotExist:
				return Response({"detail": "Department not found."}, status=status.HTTP_404_NOT_FOUND)
			
			serializer = DepartmentStaffSerializer(department, data=request.data, partial=True, context={'request': request})
			if serializer.is_valid():
				serializer.save()
				return Response(serializer.data)
			return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
	

	def delete(self, request, *args, **kwargs):
			department_id = kwargs.get('id')
			try:
				department = Department.objects.get(id=department_id)
			except Department.DoesNotExist:
				return Response({"detail": "Department not found."}, status=status.HTTP_404_NOT_FOUND)
			department.delete()
			return Response({"detail": "Department deleted successfully."}, status=status.HTTP_202_ACCEPTED)
	
 

class MyCustomStaffPagination(PageNumberPagination):
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





class GetTicketByIdStaff(APIView):
	def get(self, request, *args, **kwargs):
			ticket_id = kwargs.get('id')
			if ticket_id:
				ticket = get_object_or_404(Ticket, id=ticket_id )
				serializer = GetTicketByIdStaffSerializer(ticket, context={'request': request})
				return Response(serializer.data, status=status.HTTP_200_OK)

			return Response({"error": "Ticket ID is required."}, status=status.HTTP_400_BAD_REQUEST)






class TicketStaffView(APIView):
	permission_classes = [IsStaffOrSuperUser]



	@license_required
	def post(self, request, *args, **kwargs):
		if not request.user.is_superuser and not request.user.has_perm('usersAuthApp.ticket_create_behalf_client'):
			return Response({"detail": "Permission denied for this operation."}, status=status.HTTP_403_FORBIDDEN)



		serializer = CreateTicketStaffSerializer(data=request.data, context={'request': request})
		if serializer.is_valid():
			ticket = serializer.save()  # This will also save ticket files
			return Response(serializer.data, status=status.HTTP_201_CREATED)
		else:
			return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

	@license_required
	def put(self, request, *args, **kwargs):
			
			if not request.user.is_superuser and not request.user.has_perm('usersAuthApp.ticket_change'):
				return Response({"detail": "Permission denied for this operation."}, status=status.HTTP_403_FORBIDDEN)

			ticket_id = kwargs.get('id')
			try:
				ticket_object = Ticket.objects.get(id=ticket_id)
			except Ticket.DoesNotExist:
				return Response({"detail": "Ticket not found."}, status=status.HTTP_404_NOT_FOUND)
			serializer = ChangeTicketStaffSerializer(ticket_object, data=request.data, partial=True, context={'request': request})
			if serializer.is_valid():
				serializer.save()
				return Response(serializer.data)
			return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


	@license_required
	def delete(self, request, *args, **kwargs):
			ticket_id = kwargs.get('id')

			if not request.user.is_superuser and not request.user.has_perm('usersAuthApp.ticket_delete'):
				return Response({"detail": "Permission denied for this operation."}, status=status.HTTP_403_FORBIDDEN)
			
			try:
				ticket_object = Ticket.objects.get(id=ticket_id)
			except Ticket.DoesNotExist:
				return Response({"detail": "Ticket not found."}, status=status.HTTP_404_NOT_FOUND)
			ticket_object.delete()
			return Response({"detail": "ticket deleted successfully."}, status=status.HTTP_202_ACCEPTED)
	

	@license_required
	def get(self, request, *args, **kwargs):
			ticket_id = kwargs.get('id')
			if ticket_id:
				return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

				
			# Retrieve a specific ticket by its ID
			ticket_slug = kwargs.get('slug')

			if ticket_slug:
				ticket = get_object_or_404(Ticket, ticket_slog=ticket_slug )
				serializer = TicketStaffSerializer(ticket, context={'request': request})
				return Response(serializer.data, status=status.HTTP_200_OK)

			else:
				if request.resolver_match.view_name == 'get_my_ticket_list':
					tickets = Ticket.objects.filter(ticket_assigned_to=request.user)
				else:
					# tickets = Ticket.objects.all()
					if request.user.is_superuser:
						tickets = Ticket.objects.all()
					else:
						tickets = Ticket.objects.filter(ticket_department__users=request.user)




				# Annotate with priority flag and sort by it
				tickets = tickets.annotate(
					is_priority=Case(
						When(ticket_user__is_ticket_priority_support=True, then=Value(True)),
						default=Value(False),
						output_field=BooleanField(),
					)
				).order_by('-is_priority', '-id')  # First by priority, then by ID (descending)




				# Retrieve search and status parameters from the query string
				search_query = request.query_params.get('search', None)
				status_query = request.query_params.get('status', None)
				user_id_query = request.query_params.get('userId', None)

				# Apply filtering based on search query (if provided)
				if search_query:
					tickets = tickets.filter(
						Q(ticket_subject__icontains=search_query) |
						Q(ticket_body__icontains=search_query)  
					)
				# Apply filtering based on status (if provided)
				if status_query and status_query != 'all':
					tickets = tickets.filter(ticket_status=status_query)

				if user_id_query and user_id_query != 'all':
					tickets = tickets.filter(ticket_user=user_id_query)





				paginator = MyCustomStaffPagination()
				page = paginator.paginate_queryset(tickets, request)
				serializer = TicketListStaffSerializer(page, many=True)
				return paginator.get_paginated_response(serializer.data)            
			




class TicketFileStaffView(APIView):
	def get(self, request, ticket_id, *args, **kwargs):
		"""
		Get all files related to a specific ticket
		"""
		ticket_files = TicketFiles.objects.filter(ticket_file_ticket_id=ticket_id)
		serializer = TicketFileStaffSerializer(ticket_files, many=True, context={'request': request})
		return Response(serializer.data, status=status.HTTP_200_OK)

	# def post(self, request, ticket_id, *args, **kwargs):

	# 	serializer = TicketFileStaffSerializer(data=request.data, context={'request': request, 'ticket_id': ticket_id})

	# 	if serializer.is_valid():
	# 		created_files = serializer.save()  # Returns the created file instances
	# 		response_data = TicketFileStaffSerializer(created_files, many=True, context={'request': request}).data
	# 		return Response(response_data, status=status.HTTP_201_CREATED)


	# 	return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

 

	def delete(self, request, file_id, *args, **kwargs):
		"""
		Delete a file by its file_id
		"""
		if not request.user.is_superuser and not request.user.has_perm('usersAuthApp.ticket_attachment_delete_after_submited'):
			return Response({"detail": "Permission denied for this operation."}, status=status.HTTP_403_FORBIDDEN)


		try:
			ticket_file = TicketFiles.objects.get(id=file_id)
			ticket_file.delete()
			return Response({"detail": "File deleted successfully."}, status=status.HTTP_202_ACCEPTED)
		except TicketFiles.DoesNotExist:
			return Response({"detail": "File not found."}, status=status.HTTP_404_NOT_FOUND)
