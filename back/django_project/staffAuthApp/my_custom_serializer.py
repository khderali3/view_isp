from rest_framework_simplejwt.serializers import TokenObtainPairSerializer, TokenRefreshSerializer
from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.conf import settings
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import UntypedToken
from usersAuthApp.models import Profile
User = get_user_model()


class StaffCustomTokenRefreshSerializer(TokenRefreshSerializer):
    def validate(self, attrs):
        # Call the parent validation method
        data = super().validate(attrs)
        
        # Example: Add custom fields to the response
        data['message'] = "Token successfully refreshed."
        
        if self.context['request'].user.is_authenticated:
            user = self.context['request'].user
        
            data["user_id"] = user.id
            data["email"] = user.email
            data["firstname"] = user.first_name
            data["lastname"] = user.last_name
            data["is_staff"] = user.is_staff
            data["is_superuser"] = user.is_superuser
            data["permissions"] = list(user.get_all_permissions())
            data["groups"] = list(user.groups.values('id', 'name'))
            # Handle profile image with the full URL
            if hasattr(user, 'profile_prf_user_relaed_useraccount') and user.profile_prf_user_relaed_useraccount.PRF_image:
                PRF_image = user.profile_prf_user_relaed_useraccount.PRF_image
                # Build full URL using request.build_absolute_uri
                data['PRF_image'] = self.context['request'].build_absolute_uri(PRF_image.url) if PRF_image else None
            else:
                data['PRF_image'] = None


        return data




class StaffProfileSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source='PRF_user.first_name', read_only=False)
    last_name = serializers.CharField(source='PRF_user.last_name', read_only=False)
    PRF_image_delete = serializers.BooleanField(required=False, write_only=True)
    class Meta:
        model = Profile
        fields = '__all__'
        read_only_fields = ['id', 'PRF_slug', 'PRF_user']  # as read-only

    def to_representation(self, instance):
            data = super().to_representation(instance)
            data['first_name'] = instance.PRF_user.first_name
            data['last_name'] = instance.PRF_user.last_name
            return data

    def update(self, instance, validated_data):
            
            # Step 1: Check if 'PRF_image_delete' is present and is True (handle string 'true')
            image_delete = validated_data.get('PRF_image_delete', False)           
            if image_delete:
                # Step 2: Delete the current profile image if it exists
                if instance.PRF_image:
                    instance.PRF_image.delete(save=False)
                # Step 3: Set 'PRF_image' to None in validated_data
                validated_data['PRF_image'] = None

            # Remove 'PRF_image_delete' from validated_data since it's not a field in the model
            validated_data.pop('PRF_image_delete', None)

            """Handle updates to the nested UserAccount fields."""
            user_data = validated_data.pop('PRF_user', {})
            instance = super().update(instance, validated_data)


            # Update first_name and last_name in the associated UserAccount
            user = instance.PRF_user
            user.first_name = user_data.get('first_name', user.first_name)
            user.last_name = user_data.get('last_name', user.last_name)
            user.save()
            return instance




class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):

    def validate(self, attrs):
        # Custom validation logic, for example, check if the user is active
        data = super().validate(attrs)
        user = get_user_model().objects.get(email=attrs['email'])
        
        if not user.is_active:
            raise serializers.ValidationError('User account is not active.')
        
        if not user.is_staff and not  user.is_superuser:
            raise serializers.ValidationError("you don't have permission to access this site!")
        


        # Add any extra claims if necessary
        data['firstname'] = user.first_name  # or any other info you want to include in the token
        data['lastname'] = user.last_name  # or any other info you want to include in the token
        data['user_id'] = user.id  # or any other info you want to include in the token


        data['is_staff'] = user.is_staff  # or any other info you want to include in the token
        data['is_superuser'] = user.is_superuser  # or any other info you want to include in the token

        data['permissions'] = list(user.get_all_permissions()) 
        data['groups'] = list(user.groups.values('id', 'name'))
        data['departments'] = list(user.departments.values('id', 'department_name'))




        # Handle profile image with the full URL
        if hasattr(user, 'profile_prf_user_relaed_useraccount') and user.profile_prf_user_relaed_useraccount.PRF_image:
            PRF_image = user.profile_prf_user_relaed_useraccount.PRF_image
            # Build full URL using request.build_absolute_uri
            data['PRF_image'] = self.context['request'].build_absolute_uri(PRF_image.url) if PRF_image else None
        else:
            data['PRF_image'] = None
        return data






class CustomUserSerializer(serializers.ModelSerializer):
    profile_image = serializers.SerializerMethodField()
    groups = serializers.SerializerMethodField()
    permissions = serializers.SerializerMethodField()


    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'is_staff','is_superuser', 'profile_image', 'groups', 'permissions']  # Add any other fields

    def get_profile_image(self, obj):
        # Access the request object passed through context
        request = self.context.get('request')
        
        # Check if the user has a related profile and a profile image
        if hasattr(obj, 'profile_prf_user_relaed_useraccount'):
            profile_account = obj.profile_prf_user_relaed_useraccount
            if profile_account.PRF_image:
                if request:
                    # Manually construct the full URL for the profile image
                    return request.build_absolute_uri(profile_account.PRF_image.url)
                return profile_account.PRF_image.url
        return None
    
    def get_groups(self, obj):
        # Get the groups for the user and return a list of dictionaries with group id and name
        groups = obj.groups.all()
        return [{'id': group.id, 'name': group.name} for group in groups]

    def get_permissions(self, obj):
        # Get the permissions for the user and return a list of dictionaries with permission id, name, and codename
        permissions = obj.user_permissions.all()
        return [{'id': perm.id, 'name': perm.name, 'codename': perm.codename} for perm in permissions]




class StaffPasswordChangeSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, validators=[validate_password])
    confirm_password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = self.context.get('request').user  # Get the authenticated user from the request
        
        # Check if the old password is correct
        if not user.check_password(data['old_password']):
            raise serializers.ValidationError({"old_password": "Old password is incorrect."})

        # Check if the new password and confirm password match
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError({"confirm_password": "New passwords do not match."})

        return data

    def save(self):
        user = self.context.get('request').user  # Get the authenticated user from the request
        new_password = self.validated_data['new_password']
        user.set_password(new_password)  # Set the new password
        user.save()  # Save the user with the new password
        return user



# serializers.py


class StaffCustomTokenVerifySerializer(serializers.Serializer):
    token = serializers.CharField(write_only=True)

    def validate_token(self, value):
        try:
            # Decode the token from the cookie
            UntypedToken(value)
        except Exception as e:
            raise ValidationError('Invalid or expired token.')

        return value
