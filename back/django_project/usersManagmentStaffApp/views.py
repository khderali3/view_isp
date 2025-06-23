from django.shortcuts import render

# Create your views here.





from django.contrib.auth import get_user_model
from .my_serializers import (UsersListSerializer, StaffUsersListSerializer,
							UserObjectSerializer, ProfileSerializer,
							UserCreateSerializer, CreateProfileSerializer, GroupSerializer,
							PermissionSerializer, AssignOrRemoveGroupSerializer, AssignOrRemovePermissionSerializer,
							SetPasswordSerializer, DepartmentSerializer
							)

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ticketSystemStaffApp.my_utils import IsStaffOrSuperUser, HasUserManagementPermission
from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import Group, Permission 
from django.contrib.contenttypes.models import ContentType
from ticketSystemApp.models import Department


User = get_user_model()
from usersAuthApp.models import Profile, CustomPermission  
from rest_framework.parsers import MultiPartParser, FormParser

from rest_framework.permissions import IsAdminUser  # Use your preferred permission class
from django.contrib.auth.hashers import make_password










class SetPasswordAPIView(APIView):
	permission_classes = [IsStaffOrSuperUser, HasUserManagementPermission]  # Only admin can assign/remove groups

	def post(self, request, id):
		serializer = SetPasswordSerializer(data=request.data)
		if not serializer.is_valid():
			return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
		try:
			user = User.objects.get(id=id)
			user.password = make_password(serializer.validated_data['new_password'])
			user.save()
			return Response( {'message': 'Password updated successfully.'}, status=status.HTTP_202_ACCEPTED)
		except User.DoesNotExist:
			return Response({'error': 'User not found.'},status=status.HTTP_404_NOT_FOUND)
		except Exception as e:
			return Response({'error': str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)





class UserDepartmnetsView(APIView):
	permission_classes = [IsStaffOrSuperUser, HasUserManagementPermission ]  # Only admin can assign/remove departments

	def get(self, request, user_id):
		try:
			user = User.objects.get(id=user_id)
			departments = user.departments.all()
			serializer = DepartmentSerializer(departments, many=True)
			return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
		except User.DoesNotExist:
			return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
		except Exception as e:
			return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)




	def post(self, request, user_id):
		try:
			department_ids = request.data.getlist('department[]', [])
		except:
			department_ids = []
		valid_department_ids = []
		for dept_id in department_ids:
			if dept_id.strip():  # Ensure no empty strings
				valid_department_ids.append(dept_id)
		try:
			user = User.objects.get(id=user_id)
			if not valid_department_ids:
				# If no departments are provided, clear the user's departments
				user.departments.clear()
				departments = user.departments.all()
				serializer = DepartmentSerializer(departments, many=True)
				return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
			departments = Department.objects.filter(id__in=valid_department_ids)
			user.departments.set(departments)  # Assign departments to the user
			departments = user.departments.all()  # Get updated departments
			serializer = DepartmentSerializer(departments, many=True)
			return Response(serializer.data, status=status.HTTP_202_ACCEPTED)

		except User.DoesNotExist:
			return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
		except Department.DoesNotExist:
			return Response({'error': 'One or more departments not found.'}, status=status.HTTP_404_NOT_FOUND)
		except Exception as e:
			return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)





class GroupPermissionView(APIView):
    permission_classes = [IsStaffOrSuperUser, HasUserManagementPermission ]  # Only admin can assign/remove groups

    def get(self, request, group_id):
        try:
            group = Group.objects.get(id=group_id)
            permissions = group.permissions.all()
            serializer = AssignOrRemovePermissionSerializer(permissions, many=True)
            # return Response(serializer.data, status=status.HTTP_202_ACCEPTED)

            return Response({
                'group_name': group.name,
                'permissions': serializer.data
            }, status=status.HTTP_202_ACCEPTED)


        except Group.DoesNotExist:
            return Response({'error': 'Group not found.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request, group_id):
        try:
            permission_ids = request.data.getlist('permission[]', [])
        except:
            permission_ids = []

        if not permission_ids:
            try:
                group = Group.objects.get(id=group_id)
                group.permissions.clear()  # Clear all permissions
                permissions = group.permissions.all()
                serializer = AssignOrRemovePermissionSerializer(permissions, many=True)
                return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
            except Group.DoesNotExist:
                return Response({'error': 'Group not found.'}, status=status.HTTP_404_NOT_FOUND)
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Initialize a list for valid permission IDs
        valid_permission_ids = []
        for permission_id in permission_ids:
            if permission_id:
                valid_permission_ids.append(permission_id)

        try:
            # Get the group by ID
            group = Group.objects.get(id=group_id)
            
            # Get the ContentType for CustomPermission model
            custom_permission_content_type = ContentType.objects.get_for_model(CustomPermission)
            
            # If no valid permission IDs, clear the group's permissions
            if not valid_permission_ids:
                group.permissions.clear()
                permissions = group.permissions.filter(content_type=custom_permission_content_type)
                serializer = AssignOrRemovePermissionSerializer(permissions, many=True)
                return Response(serializer.data, status=status.HTTP_202_ACCEPTED)

            # Get the permissions from valid_permission_ids that belong to the CustomPermission model
            permissions = Permission.objects.filter(
                id__in=valid_permission_ids,
                content_type=custom_permission_content_type
            )

            # If no permissions are found or they don't belong to CustomPermission, return an error
            if not permissions.exists():
                return Response({'error': 'One or more permissions not found or do not belong to the CustomPermission model.'}, 
                                status=status.HTTP_404_NOT_FOUND)

            # Set the permissions for the group
            group.permissions.set(permissions)

            # Fetch the updated list of permissions for the group
            permissions = group.permissions.filter(content_type=custom_permission_content_type)
            serializer = AssignOrRemovePermissionSerializer(permissions, many=True)
            
            # Return the updated permissions in the response
            return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
        
        except Group.DoesNotExist:
            return Response({'error': 'Group not found.'}, status=status.HTTP_404_NOT_FOUND)
        except Permission.DoesNotExist:
            return Response({'error': 'One or more permissions not found.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)








class UserGroupView(APIView):
	permission_classes = [IsStaffOrSuperUser, HasUserManagementPermission ]  # Only admin can assign/remove groups


	def get(self, request, user_id):
		try:
			user = User.objects.get(id=user_id)
			departments = user.groups.all()
			serializer = AssignOrRemoveGroupSerializer(departments, many=True)
			return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
		except User.DoesNotExist:
			return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
		except Exception as e:
			return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)






	def post(self, request, user_id):
		try:
			group_ids = request.data.getlist('group[]', [])
		except:
			group_ids = []

		valid_group_ids = []
		for group_id in group_ids:
			if group_id:
				valid_group_ids.append(group_id)
		try:
			user = User.objects.get(id=user_id)
			if not valid_group_ids:
				user.groups.clear()
				groups = user.groups.all()
				serializer = AssignOrRemoveGroupSerializer(groups, many=True)
				return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
			groups = Group.objects.filter(id__in=valid_group_ids)
			user.groups.set(groups)
			groups = user.groups.all()
			serializer = AssignOrRemoveGroupSerializer(groups, many=True)
			return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
		except User.DoesNotExist:
			return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
		except Group.DoesNotExist:
			return Response({'error': 'One or more groups not found.'}, status=status.HTTP_404_NOT_FOUND)



class UserPermissionView(APIView):
	permission_classes = [IsStaffOrSuperUser, HasUserManagementPermission]  # Only admin can assign/remove permissions


	def get(self, request, user_id):
		try:
			user = User.objects.get(id=user_id)
			permissions = user.user_permissions.all()
			serializer = AssignOrRemovePermissionSerializer(permissions, many=True)
			return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
		except User.DoesNotExist:
			return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
		except Exception as e:
			return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

 

	def post(self, request, user_id):
 
		try:
			permission_ids = request.data.getlist('permission[]', [])
		except:
			permission_ids = []

 

		if not permission_ids:
			try:
				user = User.objects.get(id=user_id)
				user.user_permissions.clear()  # Clear all permissions
				permissions = user.user_permissions.all()
				serializer = AssignOrRemovePermissionSerializer(permissions, many=True)
				return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
			except User.DoesNotExist:
				return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
			except Exception as e:
				return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

 

		# Initialize a list for valid permission IDs
		valid_permission_ids = []
		print('permission_ids', permission_ids)
		for permission_id in permission_ids:
			if permission_id:
				valid_permission_ids.append(permission_id)

		try:
			# Get the user by ID
			user = User.objects.get(id=user_id)
			
			# Get the ContentType for CustomPermission model
			custom_permission_content_type = ContentType.objects.get_for_model(CustomPermission)
			
			# If no valid permission IDs, clear the user's permissions
			if not valid_permission_ids:
				user.user_permissions.clear()
				permissions = user.user_permissions.filter(content_type=custom_permission_content_type)
				serializer = AssignOrRemovePermissionSerializer(permissions, many=True)
				return Response(serializer.data, status=status.HTTP_202_ACCEPTED)

			# Get the permissions from valid_permission_ids that belong to the CustomPermission model
			permissions = Permission.objects.filter(
				id__in=valid_permission_ids,
				content_type=custom_permission_content_type
			)

			# If no permissions are found or they don't belong to CustomPermission, return an error
			if not permissions.exists():
				return Response({'error': 'One or more permissions not found or do not belong to the CustomPermission model.'}, 
								status=status.HTTP_404_NOT_FOUND)

			# Set the permissions for the user
			user.user_permissions.set(permissions)

			# Fetch the updated list of permissions for the user
			permissions = user.user_permissions.filter(content_type=custom_permission_content_type)
			serializer = AssignOrRemovePermissionSerializer(permissions, many=True)
			
			# Return the updated permissions in the response
			return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
		
		except User.DoesNotExist:
			return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
		except Permission.DoesNotExist:
			return Response({'error': 'One or more permissions not found.'}, status=status.HTTP_404_NOT_FOUND)
		except Exception as e:
			return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)







class PermissionAPIView(APIView):
 
    def get(self, request, pk=None):
        """
        Retrieve a single permission (if `pk` is provided) or list all custom permissions.
        """
        # Get ContentType for CustomPermission model
        custom_permission_content_type = ContentType.objects.get_for_model(CustomPermission)
        
        if pk:
            try:
                # Retrieve a permission for the CustomPermission model
                permission = Permission.objects.filter(content_type=custom_permission_content_type, codename=pk).first()
                if permission:
                    serializer = PermissionSerializer(permission)
                    return Response(serializer.data, status=status.HTTP_200_OK)
                else:
                    return Response({'error': 'Permission not found or not a custom permission.'}, status=status.HTTP_404_NOT_FOUND)
            except Permission.DoesNotExist:
                return Response({'error': 'Permission not found or not a custom permission.'}, status=status.HTTP_404_NOT_FOUND)
        else:
            # List all permissions for the CustomPermission model
            permissions = Permission.objects.filter(content_type=custom_permission_content_type)
            serializer = PermissionSerializer(permissions, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

 





class GroupAPIView(APIView):
	permission_classes = [IsStaffOrSuperUser, HasUserManagementPermission]

	def get(self, request, pk=None):
		if pk:
			try:
				group = Group.objects.get(pk=pk)
				serializer = GroupSerializer(group)
				return Response(serializer.data, status=status.HTTP_200_OK)
			except Group.DoesNotExist:
				return Response({'error': 'Group not found.'}, status=status.HTTP_404_NOT_FOUND)
		else:
			groups = Group.objects.all()
			serializer = GroupSerializer(groups, many=True)
			return Response(serializer.data, status=status.HTTP_200_OK)

	def post(self, request):
		"""
		Create a new group.
		"""
		serializer = GroupSerializer(data=request.data)
		if serializer.is_valid():
			serializer.save()
			return Response(serializer.data, status=status.HTTP_201_CREATED)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

	def put(self, request, pk): 
		try:
			group = Group.objects.get(pk=pk)
		except Group.DoesNotExist:
			return Response({'error': 'Group not found.'}, status=status.HTTP_404_NOT_FOUND)
		
		serializer = GroupSerializer(group, data=request.data, partial=True)
		if serializer.is_valid():
			serializer.save()
			return Response(serializer.data, status=status.HTTP_200_OK)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

	def delete(self, request, pk):
		"""
		Delete a group.
		"""
		try:
			group = Group.objects.get(pk=pk)
			group.delete()
			return Response({'message': 'Group deleted successfully.'}, status=status.HTTP_202_ACCEPTED)
		except Group.DoesNotExist:
			return Response({'error': 'Group not found.'}, status=status.HTTP_404_NOT_FOUND)
		
		except Exception as e:
			return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)





# all users
class UsersView(APIView):
	# permission_classes = [IsStaffOrSuperUser, HasUserManagementPermission]
	parser_classes = [MultiPartParser, FormParser]  # Allow handling of file uploads


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
		# users_list = User.objects.all() 
		search_query = request.query_params.get('q', '')  # Get the search query from URL parameters

		if search_query:
			# Filter users based on first name, last name, or email containing the search query
			users_list = User.objects.filter(
				Q(first_name__icontains=search_query) |
				Q(last_name__icontains=search_query) |
				Q(email__icontains=search_query)
			)
		else:
			# If no search query, return all users
			users_list = User.objects.all()



		serializer = UsersListSerializer(users_list, many=True) 
		return Response(serializer.data, status=status.HTTP_200_OK)
	
	def post(self, request, *args, **kwargs):
			# Separate user data from profile data
			user_data = {
				key.split('user.')[1]: value 
				for key, value in request.data.items() if key.startswith('user.')
			}
			
			profile_data = {
				key.split('profile.')[1]: value 
				for key, value in request.data.items() if key.startswith('profile.')
			}
			
			# Validate and create user
			user_serializer = UserCreateSerializer(data=user_data)
			if user_serializer.is_valid():
				user = user_serializer.save()
				
				# Handle profile creation separately
				profile_data['PRF_user'] = user.id  # Associate the profile with the user

				profile_obj, created = Profile.objects.update_or_create(PRF_user=user)
				profile_serializer = CreateProfileSerializer(profile_obj, data=profile_data, context={'request': request})
				if profile_serializer.is_valid():
					profile_serializer.save()  # Update the profile

					user_serializer_data = user_serializer.data
					profile_serializer_data = profile_serializer.data
					data_to_response = {
						'user': user_serializer_data,
						'profile': profile_serializer_data
					}
					# return Response(user_serializer.data, status=status.HTTP_200_OK)
					return Response(data_to_response , status=status.HTTP_200_OK)
				

				else:
					return Response(profile_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

			return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)






class UserobjectView(APIView):
	permission_classes = [IsStaffOrSuperUser, HasUserManagementPermission]
	parser_classes = [MultiPartParser, FormParser]  # Enable handling of form-data and file uploads

	def get(self, request, *args, **kwargs):
		user_id = kwargs.get('id')
		user = get_object_or_404(User, id=user_id)
		serializer = UserObjectSerializer(user, context={'request': request})
		user_data = {key: value for key, value in serializer.data.items() if key != "profile"}

		# Structure the response
		response_data = {
			"user": user_data,
			"profile": serializer.data.get("profile"),
		}

		return Response(response_data, status=200)

		# return Response(serializer.data, status=200)

	def delete(self, request, *args, **kwargs):
			user_id = kwargs.get('id')
			user = get_object_or_404(User, id=user_id)
			
			# Prevent deletion of superusers for safety
			if user.is_superuser:
				return Response({"error": "Cannot delete a superuser."}, status=status.HTTP_403_FORBIDDEN)
			try:
				user.delete()
			except Exception as e :
				return Response({'message' : str(e)}, status=status.HTTP_400_BAD_REQUEST)
			return Response({"message": "User deleted successfully."}, status=status.HTTP_202_ACCEPTED)



	def put(self, request, *args, **kwargs):
			user_id = kwargs.get('id')
			user = get_object_or_404(User, id=user_id)
			if user:
				## jsut to avoid error if not profile created for some resones
				profile_obj, created = Profile.objects.update_or_create(PRF_user=user)

 
			# Extract user and profile data
			user_data = {
				key.split('user.')[1]: value 
				for key, value in request.data.items() if key.startswith('user.')
			}
			profile_data = {
				key.split('profile.')[1]: value 
				for key, value in request.data.items() if key.startswith('profile.')
			}

			# Update User
			user_serializer = UserObjectSerializer(instance=user, data=user_data, partial=True)
			if user_serializer.is_valid():
				user_serializer.save()
			else:
				return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

			# Update Profile


			profile = getattr(user, 'profile_prf_user_relaed_useraccount', None)
			if profile:
				profile_serializer = ProfileSerializer(instance=profile, data=profile_data, partial=True)
				if profile_serializer.is_valid():
					profile_serializer.save()
				else:
					return Response(profile_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
			elif profile_data:


				profile_data['PRF_user'] = user.id


				profile_serializer = ProfileSerializer(data=profile_data)
				if profile_serializer.is_valid():
					profile_serializer.save()
				else:
					return Response(profile_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

			return Response({"message": "User and profile updated successfully."}, status=status.HTTP_200_OK)


# only staff users
class StaffUsersView(APIView):
	permission_classes = [IsStaffOrSuperUser]

	def get(self, request, *args, **kwargs):
		# Fetch all users who are not superusers or staff
		# users = User.objects.filter(is_superuser=False, is_staff=False)
		users = User.objects.filter(Q(is_staff=True) | Q(is_superuser=True))

		# Serialize the queryset
		serializer = StaffUsersListSerializer(users, many=True)
		# Return the response
		return Response(serializer.data, status=status.HTTP_200_OK)