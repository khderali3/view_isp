## staff ticket my_serializers

from rest_framework import serializers

from ticketSystemApp.models import (
    				 Ticket, TicketFiles, validate_file_or_image,
                     TicketReplay, Department, TicketReplyFiles
                     )

    

from django.conf import settings
from rest_framework.exceptions import ValidationError
from rest_framework import fields

def get_client_ip(request):
	try:
		x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
		if x_forwarded_for:
			ip = x_forwarded_for.split(',')[0].strip()
		else:
			ip = request.META.get('REMOTE_ADDR')
		return ip or None
	except :
		return None





class TicketReplyFileStaffSerializer(serializers.ModelSerializer):
	ticket_replay_file = fields.SerializerMethodField()

	class Meta:
		model = TicketReplyFiles
		fields = ['id', 'ticket_replay_file_ticket_replay', 'ticket_replay_file',  'ticket_replay_file_name', 'ticket_replay_file_created_data']
		read_only_fields = ['id', 'ticket_replay_file_name', 'ticket_replay_file_created_data', 'ticket_replay_file']


	def get_ticket_replay_file(self, obj):
		"""
		Generate the full URL for the `ticket_replay_file`.
		"""
		request = self.context.get('request')
		if request:
			return request.build_absolute_uri(obj.ticket_replay_file.url)
		return obj.ticket_replay_file.url




	def validate(self, attrs):
		"""
		Ensure that ticket_files[] is present in the request.
		"""
		request = self.context.get('request')
		files = request.FILES.getlist('ticket_reply_files[]')

		if not files:  # Check if no files are provided
			raise serializers.ValidationError({"ticket_reply_files[]": "This field is required and cannot be empty."})
		
		return attrs


	def create(self, validated_data):
		"""
		Handle creating multiple files for a ticket.
		"""
		# Access the request from the context
		request = self.context['request']

		# Retrieve files from the request's FILES
		files = request.FILES.getlist('ticket_reply_files[]')  # Access the list of files

		# Retrieve the ticket from the URL
		ticket_reply_id = self.context['ticket_reply_id']
		ticket_reply_obj = TicketReplay.objects.get(id=ticket_reply_id)

		# Create ticket file instances
		ticket_reply_files = [
			TicketReplyFiles(
				ticket_replay_file_ticket_replay=ticket_reply_obj,
				ticket_replay_file=file,
				ticket_replay_file_name=file.name
			)
			for file in files
		]

		# Bulk create the files
		created_files = TicketReplyFiles.objects.bulk_create(ticket_reply_files)

		return created_files  # Returning metadata about created files











class TicketReplayStaffSerializer (serializers.ModelSerializer):
	ticket_reply_files = serializers.ListField(
		child=serializers.FileField(validators=[validate_file_or_image]),
		required=False,  # Make this optional
		allow_empty=True,  # Allow empty list
		)
	ticket_slug = serializers.SerializerMethodField()

	class Meta:
		model = TicketReplay
		fields = (
			'id',
			'ticket_slug',
			'ticket_replay_body',
			'ticket_reply_files'
			)
		read_only_fields = ['id', 'ticket_replay_ticket']  # Set id as read-only



	def get_ticket_slug(self, obj):
		return obj.ticket_replay_ticket.ticket_slog


	def update(self, instance, validated_data):
		ticket_reply_files = self.context['request'].FILES.getlist('ticket_reply_files[]')

		# Use the default update method for other fields
		instance = super().update(instance, validated_data)

		# Handle ticket files
		for file in ticket_reply_files:
			TicketReplyFiles.objects.create(
				ticket_replay_file_ticket_replay=instance,
				ticket_replay_file=file,
				ticket_replay_file_name=file.name,
			)

		return instance




class CreateTicketReplayStaffSerializer(serializers.ModelSerializer):
	ticket_reply_files = serializers.ListField(
		child=serializers.FileField(validators=[validate_file_or_image]),
		required=False,  # Make this optional
		allow_empty=True,  # Allow empty list
	)

	is_wait_customer_reply = serializers.BooleanField(required=False, default=False)

	class Meta:
		model = TicketReplay
		fields = (
			'id',
			'ticket_replay_ticket',
				'ticket_replay_body',
				'ticket_reply_files',
				'is_wait_customer_reply'
			)

		read_only_fields = ['id']  # Set id as read-only



	def validate(self, data):
		# Check if the request user is the same as the ticket_user in the parent Ticket
		request_user = self.context['request'].user
		related_ticket = data.get('ticket_replay_ticket')

		if related_ticket and related_ticket.ticket_assigned_to != request_user:
			raise ValidationError("You are not authorized to reply to this ticket.")

		if related_ticket and related_ticket.ticket_closed_by:
			raise ValidationError("the related ticket is closed your can't reply!")


		if not related_ticket:
			raise ValidationError("related_ticket can't be empty!")


		return data





	def create(self, validated_data):
		validated_data['ticket_replay_from'] = self.context['request'].user



		# Extract is_wait_customer_reply from validated_data
		is_wait_customer_reply = validated_data.pop('is_wait_customer_reply', False)


		ticket_replay_created_ip_address = get_client_ip(self.context['request'])
		validated_data['ticket_replay_created_ip_address'] = ticket_replay_created_ip_address

		# Create the ticket
		ticket_replay_obj = super().create(validated_data)


		# Attach the is_wait_customer_reply value to the ticket_replay_obj for serialization
		ticket_replay_obj.is_wait_customer_reply = is_wait_customer_reply

		
		# Update the status of the related Ticket object
		related_ticket = ticket_replay_obj.ticket_replay_ticket
		if related_ticket:

			if is_wait_customer_reply:
				related_ticket.ticket_status = 'wait_customer_reply'

			else:
				related_ticket.ticket_status = 'replied_by_staff'
			related_ticket.save()

		# Handle the uploaded files and create TicketFiles entries
		ticket_files = self.context['request'].FILES.getlist('ticket_reply_files[]')
		


		for file in ticket_files:
			TicketReplyFiles.objects.create(
				ticket_replay_file_ticket_replay=ticket_replay_obj, 
				ticket_replay_file=file,
				ticket_replay_file_name=file.name  # Save the file name as well
			)

		return ticket_replay_obj


	def to_representation(self, instance):
		"""Customize the response to include the is_wait_customer_reply field."""
		representation = super().to_representation(instance)
		# Include the `is_wait_customer_reply` field in the response
		representation['is_wait_customer_reply'] = getattr(instance, 'is_wait_customer_reply', False)
		return representation








class TicketAssignStaffSerializer(serializers.ModelSerializer):
	class Meta:
		model = Ticket
		fields = ['ticket_assigned_to']




class DepartmentStaffSerializer(serializers.ModelSerializer):
	class Meta:
		model = Department
		fields = '__all__'
		read_only_fields = ['id']   






class TicketListStaffSerializer(serializers.ModelSerializer):
	latest_activity = serializers.SerializerMethodField()
	ticket_assigned_to = serializers.SerializerMethodField()

	class Meta:
		model = Ticket
		fields = '__all__'  # You can specify the fields you want to expose
		
	def get_latest_activity(self, obj):
		# Retrieve the latest TicketReplay for this ticket
		latest_reply = TicketReplay.objects.filter(ticket_replay_ticket=obj).order_by('-ticket_replay_created_date').first()
		if latest_reply:
			return latest_reply.ticket_replay_created_date
		# If no replies, return the ticket creation date
		return obj.ticket_created_date

	def get_ticket_assigned_to(self, obj):
		if obj.ticket_assigned_to:
			full_name = f"{obj.ticket_assigned_to.first_name} {obj.ticket_assigned_to.last_name}".strip()

			return {
				"fullname": full_name,
				"is_staff": obj.ticket_assigned_to.is_staff,
				"is_superuser": obj.ticket_assigned_to.is_superuser,
				"departments": [department.department_name for department in obj.ticket_assigned_to.departments.all()] ,
				"user_id": obj.ticket_assigned_to.id

			}
		return None



class CreateTicketStaffSerializer(serializers.ModelSerializer):
	ticket_files = serializers.ListField(
		child=serializers.FileField(validators=[validate_file_or_image]),
		required=False,  # Make this optional
		allow_empty=True,  # Allow empty list
	)

	class Meta:
		model = Ticket
		fields = [
			"id",
			'ticket_subject',
			'ticket_body',
			'ticket_department',
			'ticket_files',  # Add the ticket_files field here
			'ticket_slog',
			'ticket_user',
			'ticket_created_by',
		]
		read_only_fields = ['id', 'ticket_slog', 'ticket_created_by']  # Set id as read-only

	def create(self, validated_data):
		validated_data['ticket_created_by'] = self.context['request'].user
		ticket_created_ip_address = get_client_ip(self.context['request'])
		validated_data['ticket_created_ip_address'] = ticket_created_ip_address

		# Create the ticket
		ticket = super().create(validated_data)

		# Handle the uploaded files and create TicketFiles entries

		ticket_files = self.context['request'].FILES.getlist('ticket_files[]')
		for file in ticket_files:
			TicketFiles.objects.create(
				ticket_file_ticket=ticket, 
				ticket_file_ticket_file=file,
				ticket_file_name=file.name  # Save the file name as well
			)

		return ticket
    

class TicketFileStaffSerializer(serializers.ModelSerializer):


	ticket_file_ticket_file = fields.SerializerMethodField()
	class Meta:
		model = TicketFiles
		fields = ['id', 'ticket_file_ticket', 'ticket_file_ticket_file',  'ticket_file_name', 'ticket_file_created_data']
		read_only_fields = ['id', 'ticket_file_name', 'ticket_file_created_data','ticket_file_ticket_file']


	def get_ticket_file_ticket_file(self, obj):
		"""
		Generate the full URL for the `ticket_replay_file`.
		"""
		request = self.context.get('request')
		if request:
			return request.build_absolute_uri(obj.ticket_file_ticket_file.url)
		return obj.ticket_file_ticket_file.url




	def validate(self, attrs):
		"""
		Ensure that ticket_files[] is present in the request.
		"""
		request = self.context.get('request')
		files = request.FILES.getlist('ticket_files[]')

		if not files:  # Check if no files are provided
			raise serializers.ValidationError({"ticket_files[]": "This field is required and cannot be empty."})
		
		return attrs


	def create(self, validated_data):
		"""
		Handle creating multiple files for a ticket.
		"""
		# Access the request from the context
		request = self.context['request']

		# Retrieve files from the request's FILES
		files = request.FILES.getlist('ticket_files[]')  # Access the list of files

		# Retrieve the ticket from the URL
		ticket_id = self.context['ticket_id']
		ticket = Ticket.objects.get(id=ticket_id)

		# Create ticket file instances
		ticket_files = [
			TicketFiles(
				ticket_file_ticket=ticket,
				ticket_file_ticket_file=file,
				ticket_file_name=file.name
			)
			for file in files
		]

		# Bulk create the files
		created_files = TicketFiles.objects.bulk_create(ticket_files)

		return created_files  # Returning metadata about created files







class ChangeTicketStaffSerializer(serializers.ModelSerializer):
	ticket_files = serializers.ListField(
		child=serializers.FileField(validators=[validate_file_or_image]),
		required=False,  # Make this optional
		allow_empty=True,  # Allow empty list
	)

	class Meta:
		model = Ticket
		fields = [
			"id",
			'ticket_subject',
			'ticket_body',
			'ticket_department',
			'ticket_user',
			'ticket_slog',
			'ticket_files'
		]
		read_only_fields = ['id', 'ticket_slog', 'ticket_user']  

	def update(self, instance, validated_data):
		ticket_files = self.context['request'].FILES.getlist('ticket_files[]')

		# Use the default update method for other fields
		instance = super().update(instance, validated_data)

		# Handle ticket files
		for file in ticket_files:
			TicketFiles.objects.create(
				ticket_file_ticket=instance,
				ticket_file_ticket_file=file,
				ticket_file_name=file.name,
			)

		return instance





 
    

class GetTicketByIdStaffSerializer(serializers.ModelSerializer):
	ticket_files =   serializers.SerializerMethodField() # Use a method to get the related files

	class Meta:
		model = Ticket
		fields = [
			"id",
			'ticket_subject',
			'ticket_body',
			'ticket_department',
			'ticket_user',
			'ticket_slog',
			'ticket_files',
		]
		read_only_fields = ['id', 'ticket_slog', 'ticket_user']  

	def get_ticket_files(self, obj):
		# Get related ticket files for this ticket
		ticket_files = TicketFiles.objects.filter(ticket_file_ticket=obj)
		# Serialize the related TicketFiles objects
		return TicketFilesSerializer(ticket_files, many=True, context=self.context ).data


class DepartmentSerializer(serializers.ModelSerializer):
	class Meta:
		model = Department
		fields = '__all__'




class TicketStaffSerializer(serializers.ModelSerializer):

	# ticket_department = serializers.StringRelatedField()  # Display the department name instead of ID
	ticket_department = serializers.SerializerMethodField()


	ticket_user = serializers.SerializerMethodField()  # Custom field to show both first and last names
	ticket_files =   serializers.SerializerMethodField() # Use a method to get the related files
	ticket_replies = serializers.SerializerMethodField()

	ticket_created_by = serializers.SerializerMethodField()  # Custom field to show both first and last names
	ticket_closed_by = serializers.SerializerMethodField()  # Custom field to show both first and last names

	ticket_assigned_to = serializers.SerializerMethodField()  # Custom field to show both first and last names

	ticket_latest_activity = serializers.SerializerMethodField()
	ticket_pr_support = serializers.SerializerMethodField()

 


	class Meta:
		model = Ticket
		fields = [
			'id',
			'ticket_user',
			'ticket_department',
			'ticket_pr_support',
			'ticket_subject',
			'ticket_body',
			'ticket_assigned_to',
			'ticket_status',
			'ticket_created_by',
			'ticket_closed_by',
			'ticket_slog',
			'ticket_created_date',
			# 'ticket_updated_date',
			'ticket_latest_activity',
			'ticket_files', 
			'ticket_replies',
			'ticket_created_ip_address'


		]    
		read_only_fields = ['id', 'ticket_user', 'ticket_assigned_to', 'ticket_status', 'ticket_created_by','ticket_closed_by', 'ticket_slog', 'ticket_replies', 'ticket_created_ip_address']  # Set id as read-only



	def get_ticket_department(self, obj):
		ticket_department = obj.ticket_department
		return DepartmentSerializer(ticket_department).data



	def get_ticket_pr_support(self, obj):
		if obj.ticket_user:
				return (obj.ticket_user.is_ticket_priority_support)
		return None



	def get_ticket_user(self, obj):

		if obj.ticket_user:
			full_name = f"{obj.ticket_user.first_name} {obj.ticket_user.last_name}".strip()


			PRF_image = None
			if hasattr(obj.ticket_user, 'profile_prf_user_relaed_useraccount'):
				PRF_image = obj.ticket_user.profile_prf_user_relaed_useraccount.PRF_image.url if obj.ticket_user.profile_prf_user_relaed_useraccount.PRF_image else None
				if PRF_image:
					PRF_image = f"{settings.MY_SITE_URL}{PRF_image}"

			return {
				"fullname": full_name,
				"is_staff": obj.ticket_user.is_staff,
				"PRF_image" : PRF_image

			}
		return None
    










	def get_ticket_latest_activity(self, obj):
		# Retrieve the latest TicketReplay for this ticket
		latest_reply = TicketReplay.objects.filter(ticket_replay_ticket=obj).order_by('-ticket_replay_created_date').first()
		if latest_reply:
			return latest_reply.ticket_replay_created_date
		# If no replies, return the ticket creation date
		return obj.ticket_created_date


	def get_ticket_created_by(self, obj):
		if obj.ticket_created_by:
			full_name = f"{obj.ticket_created_by.first_name} {obj.ticket_created_by.last_name}".strip()

			return {
				"fullname": full_name,
				"is_staff": obj.ticket_created_by.is_staff,
				"is_superuser": obj.ticket_created_by.is_superuser,
				"departments": [department.department_name for department in obj.ticket_created_by.departments.all()],
				"user_id": obj.ticket_created_by.id

			}
		return None
    
	def get_ticket_closed_by(self, obj):
		if obj.ticket_closed_by:
			full_name = f"{obj.ticket_closed_by.first_name} {obj.ticket_closed_by.last_name}".strip()
			return {
				"fullname": full_name,
				"is_staff": obj.ticket_closed_by.is_staff,
				"is_superuser": obj.ticket_closed_by.is_superuser,
				"departments": [department.department_name for department in obj.ticket_closed_by.departments.all()] ,
				"user_id": obj.ticket_closed_by.id

			}
		return None

	def get_ticket_assigned_to(self, obj):
		if obj.ticket_assigned_to:
			full_name = f"{obj.ticket_assigned_to.first_name} {obj.ticket_assigned_to.last_name}".strip()

			return {
				"fullname": full_name,
				"is_staff": obj.ticket_assigned_to.is_staff,
				"is_superuser": obj.ticket_assigned_to.is_superuser,
				"departments": [department.department_name for department in obj.ticket_assigned_to.departments.all()] ,
				"user_id": obj.ticket_assigned_to.id

			}
		return None


	def get_ticket_files(self, obj):
		# Get related ticket files for this ticket
		ticket_files = TicketFiles.objects.filter(ticket_file_ticket=obj)
		# Serialize the related TicketFiles objects
		return TicketFilesSerializer(ticket_files, many=True, context=self.context ).data

	def get_ticket_replies(self, obj):
		ticket_replies  = TicketReplay.objects.filter(ticket_replay_ticket=obj)
		return TicketReplaySerializer(ticket_replies, many=True, context=self.context ).data





class TicketFilesSerializer(serializers.ModelSerializer):
	class Meta:
		model = TicketFiles
		fields = ['id', 'ticket_file_name', 'ticket_file_ticket_file', 'ticket_file_created_data']


 
class TicketReplaySerializer(serializers.ModelSerializer):
	ticket_reply_files = serializers.SerializerMethodField()
	ticket_replay_from = serializers.SerializerMethodField()  # Custom field to show both first and last names

	class Meta:
		model = TicketReplay
		# fields = '__all__'
		exclude = ['ticket_replay_ticket']

	def get_ticket_reply_files(self, obj):
		files = TicketReplyFiles.objects.filter(ticket_replay_file_ticket_replay=obj)
		return TicketReplyFilesSerializer( files,  many=True, context=self.context).data

	def get_ticket_replay_from(self, obj):
		if obj.ticket_replay_from:
			full_name = f"{obj.ticket_replay_from.first_name} {obj.ticket_replay_from.last_name}".strip()



			PRF_image = None
			if hasattr(obj.ticket_replay_from, 'profile_prf_user_relaed_useraccount'):
				PRF_image = obj.ticket_replay_from.profile_prf_user_relaed_useraccount.PRF_image.url if obj.ticket_replay_from.profile_prf_user_relaed_useraccount.PRF_image else None
				if PRF_image:
					PRF_image = f"{settings.MY_SITE_URL}{PRF_image}"




			return {
				"fullname": full_name,
				"is_staff": obj.ticket_replay_from.is_staff,
				"PRF_image": PRF_image,
			}
		return None

class TicketReplyFilesSerializer(serializers.ModelSerializer):

	class Meta:
		model = TicketReplyFiles
		fields = '__all__'