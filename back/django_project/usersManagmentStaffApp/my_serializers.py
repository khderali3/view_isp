

from rest_framework import serializers

from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group, Permission
from ticketSystemApp.models import Department
from usersAuthApp.models import Profile
User = get_user_model()



class SetPasswordSerializer(serializers.Serializer):
    new_password = serializers.CharField(write_only=True, required=True, min_length=8)
    re_new_password = serializers.CharField(write_only=True, required=True, min_length=8)

    def validate(self, data):
        if data['new_password'] != data['re_new_password']:
            raise serializers.ValidationError({'re_new_password': 'Passwords do not match.'})
        return data





class AssignOrRemoveGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = "__all__"
        read_only_fields = ['id' ]


class AssignOrRemovePermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = "__all__"
        read_only_fields = ['id' ]







 



class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = "__all__"
        read_only_fields = ['id', 'permissions' ]



class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = "__all__"
        read_only_fields = ['id' ]






class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['id', 'department_name', 'department_name_ar']


class UsersListSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email',
                  'is_active', 'is_staff', 'is_superuser' ,'is_ticket_priority_support'
                ]

class ProfileSerializer(serializers.ModelSerializer):
    PRF_image_delete = serializers.BooleanField(write_only=True, required=False)  # Add delete flag

    class Meta:
        model = Profile
        fields = ('PRF_company', 'PRF_country', 'PRF_city', 'PRF_address',  'PRF_phone_number', 'PRF_image', 'PRF_image_delete')

    def update(self, instance, validated_data):
        # Check if PRF_image_delete flag is set to True
        delete_image = validated_data.pop('PRF_image_delete', False)

        # If the delete flag is True, delete the image
        if delete_image:
            # Delete the current image if it exists
            if instance.PRF_image:
                instance.PRF_image.delete()
            # Don't include PRF_image in the update data, so it won't be saved
            validated_data.pop('PRF_image', None)

        # Update other fields
        return super().update(instance, validated_data)




class CreateProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = [
            'id', 'PRF_company', 'PRF_country', 'PRF_city','PRF_user', 
            'PRF_address', 'PRF_phone_number', 'PRF_image'
        ]
        read_only_fields = ['id','PRF_user' ]


class UserCreateSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = [
            'id', 'email', 'first_name', 'last_name', 'password', 'confirm_password',
            'is_active', 'is_staff', 'is_superuser', 'is_ticket_priority_support'
        ]
        extra_kwargs = {'password': {'write_only': True}}
        read_only_fields = ['id' ]

    def validate(self, attrs):
        password = attrs.get('password')
        confirm_password = attrs.pop('confirm_password')

        # Check if password and confirm password match
        if password != confirm_password:
            raise serializers.ValidationError({"confirm_password": "Password fields must match."})

        # Validate password
        # password_validation.validate_password(password)

        return attrs

    def create(self, validated_data):
        # Create the user using the create_user method (which hashes the password)
        user = User.objects.create_user(**validated_data)
        return user



class UserObjectSerializer(serializers.ModelSerializer):
    groups = GroupSerializer(many=True)  # Nested serializer for groups
    user_permissions = PermissionSerializer(many=True)  # Nested serializer for permissions
    departments = DepartmentSerializer(many=True)  # Nested serializer for departments

    profile = ProfileSerializer(source='profile_prf_user_relaed_useraccount', allow_null=True)
    class Meta:
        model = User
        fields = [
            'id',
            'email',
            'first_name',
            'last_name',
            'is_active',
            'is_staff',
            'is_superuser',
            'groups',
            'user_permissions',
            'departments',
            'is_ticket_priority_support',
            'last_login',
            'profile',
        ]
        read_only_fields = ['id' ]

    


class StaffUsersListSerializer(serializers.ModelSerializer):
    departments = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email', 'is_active', 'is_staff', 'is_superuser' ,'is_ticket_priority_support', 'departments']

    def get_departments(self, obj):
        # Get all related department names
        return obj.departments.values_list('department_name', flat=True)