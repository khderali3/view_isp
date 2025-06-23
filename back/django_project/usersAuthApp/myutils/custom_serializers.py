from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from djoser.social.serializers import ProviderAuthSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from ..models import Profile
from rest_framework import serializers

from django.conf import settings


class ProfileSerializer(serializers.ModelSerializer):
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



class CustomProviderTokenStrategy:
    @classmethod
    def obtain(cls, user):

        refresh = RefreshToken.for_user(user)

        refresh['first_name'] = user.first_name
        refresh['is_staff'] = user.is_staff
        refresh['is_superuser'] = user.is_superuser


 
        return {
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        }


from django.conf import settings


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['first_name'] = user.first_name
        token['last_name'] = user.last_name
        token['is_staff'] = user.is_staff
        token['is_superuser'] = user.is_superuser


 


        if hasattr(user, 'profile_prf_user_relaed_useraccount'):
            PRF_image = user.profile_prf_user_relaed_useraccount.PRF_image.url if user.profile_prf_user_relaed_useraccount.PRF_image else None
       
            if PRF_image:
                # Construct the full URL for the image
                token['PRF_image'] = f"{settings.MY_SITE_URL}{PRF_image}"
        return token





from djoser.serializers import UserSerializer
from rest_framework import serializers
from ..models import UserAccount, Profile

class ProfileImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['PRF_image']  # Add any other Profile fields you want to include

class CustomUserSerializer(UserSerializer):
    profile = ProfileImageSerializer(source='profile_prf_user_relaed_useraccount', read_only=True)

    is_staff = serializers.BooleanField(read_only=True)  # Make is_staff read-only
    is_superuser = serializers.BooleanField(read_only=True)  # Make is_superuser read-only

    class Meta(UserSerializer.Meta):
        model = UserAccount
        fields = list(UserSerializer.Meta.fields) + ['profile'] + ['is_staff'] + ['is_superuser']




from djoser.serializers import SendEmailResetSerializer
from rest_framework.exceptions import ValidationError
from .public_utils import verify_recaptcha 

class CustomPasswordResetSerializer(SendEmailResetSerializer):
    def validate(self, attrs):
 
        # recaptcha_value = self.context.get('request').data.get('recaptcha_value')
        # if not recaptcha_value:
        #     raise ValidationError({'recaptcha': 'reCAPTCHA value is required.'})
        # if not verify_recaptcha(recaptcha_value):
        #     raise ValidationError({'recaptcha': 'Invalid reCAPTCHA. Please try again.'})


        if getattr(settings, "RECAPTCHA_ENABLED", True):
            recaptcha_value = self.context.get('request').data.get('recaptcha_value5')
            if not recaptcha_value or not verify_recaptcha(recaptcha_value):
                raise ValidationError({'recaptcha': 'Invalid reCAPTCHA. Please try again.'})
 
        return super().validate(attrs)







