from .my_serializers import ( 
	CreateTicketReplayStaffSerializer, TicketReplayStaffSerializer, TicketReplyFileStaffSerializer
	) 

from rest_framework.response import Response
from .my_utils import IsStaffOrSuperUser
from rest_framework.views import APIView
from rest_framework import status
from ticketSystemApp.models import (TicketReplay, TicketReplyFiles)
from django.shortcuts import get_object_or_404


class TicketReplayStaffView(APIView):
	permission_classes = [IsStaffOrSuperUser]
      
	def delete(self, request, *args, **kwargs):
			ticket_reply_id = kwargs.get('id')  # Get the ID from the URL

			if not request.user.is_superuser and not request.user.has_perm('usersAuthApp.ticket_reply_delete'):
				return Response({"detail": "Permission denied for this operation."}, status=status.HTTP_403_FORBIDDEN)

			if ticket_reply_id:
				try:
					ticket_reply_obj = get_object_or_404(TicketReplay, id=ticket_reply_id)
					ticket_reply_obj.delete()
					return Response({"message": "Ticket reply deleted successfully."}, status=status.HTTP_202_ACCEPTED)
				except Exception as e:
					return Response({"error": f"An error occurred: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

			return Response({"error": "Ticket Reply ID is required."}, status=status.HTTP_400_BAD_REQUEST)


	def post(self, request, *args, **kwargs):

		serializer = CreateTicketReplayStaffSerializer(data=request.data, context={'request': request})
		if serializer.is_valid():
			replay_ticket = serializer.save()  # This will also save ticket files
			return Response(serializer.data, status=status.HTTP_201_CREATED)
		else:
			return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


	def get(self, request, *args, **kwargs):
			ticket_reply_id = kwargs.get('id')
			if ticket_reply_id:
				ticket_reply_obj = get_object_or_404(TicketReplay, id=ticket_reply_id )
				serializer = TicketReplayStaffSerializer(ticket_reply_obj, context={'request': request})
				return Response(serializer.data, status=status.HTTP_200_OK)

			return Response({"error": "Ticket Reply ID is required."}, status=status.HTTP_400_BAD_REQUEST)



	def put(self , request, *args, **kwargs):
		ticket_reply_id = kwargs.get('id')

		if not request.user.is_superuser and not request.user.has_perm('usersAuthApp.ticket_reply_change'):
			return Response({"detail": "Permission denied for this operation."}, status=status.HTTP_403_FORBIDDEN)
		
		try:
			ticket_reply_object = TicketReplay.objects.get(id=ticket_reply_id)
		except TicketReplay.DoesNotExist:
			return Response({"detail": "Ticket not found."}, status=status.HTTP_404_NOT_FOUND)


		# if ticket_reply_object.ticket_replay_ticket.ticket_closed_by:
		# 	return Response({"detail": "Ticket closed, you can't reply!"}, status=status.HTTP_400_BAD_REQUEST)

		if not request.data.get('ticket_replay_body'):
			return Response(
				{"detail": "The ticket_replay_body field cannot be empty."},
				status=status.HTTP_400_BAD_REQUEST
			)


		serializer = TicketReplayStaffSerializer(ticket_reply_object, data=request.data, partial=True , context={'request': request} )
		if serializer.is_valid():
			serializer.save()
			return Response(serializer.data)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
	





class TicketReplyFileStaffView(APIView):
	def get(self, request, ticket_reply_id, *args, **kwargs):
		"""
		Get all files related to a specific ticket
		"""
		ticket_files = TicketReplyFiles.objects.filter(ticket_replay_file_ticket_replay=ticket_reply_id)
		serializer = TicketReplyFileStaffSerializer(ticket_files, many=True, context={'request': request})
		return Response(serializer.data, status=status.HTTP_200_OK)

	# def post(self, request, ticket_reply_id, *args, **kwargs):

	# 	serializer = TicketReplyFileStaffSerializer(data=request.data, context={'request': request, 'ticket_reply_id': ticket_reply_id})

	# 	if serializer.is_valid():
	# 		created_files = serializer.save()  # Returns the created file instances
	# 		response_data = TicketReplyFileStaffSerializer(created_files, many=True, context={'request': request}).data
	# 		return Response(response_data, status=status.HTTP_201_CREATED)


	# 	return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


	def delete(self, request, file_id, *args, **kwargs):
		"""
		Delete a file by its file_id
		"""
		if not request.user.is_superuser and not request.user.has_perm('usersAuthApp.ticket_reply_attachment_delete_after_submited'):
			return Response({"detail": "Permission denied for this operation."}, status=status.HTTP_403_FORBIDDEN)
		try:
			ticket_reply_file = TicketReplyFiles.objects.get(id=file_id)
			ticket_reply_file.delete()
			return Response({"detail": "File deleted successfully."}, status=status.HTTP_202_ACCEPTED)
		except TicketReplyFiles.DoesNotExist:
			return Response({"detail": "File not found."}, status=status.HTTP_404_NOT_FOUND)
