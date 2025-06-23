
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from djoser.social.views import ProviderAuthView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView
)

from .myutils.custom_serializers import ProfileSerializer

from .models import Profile
from rest_framework.parsers import MultiPartParser, FormParser

from .myutils.public_utils import verify_recaptcha
from django.conf import settings

from django_project.middleware import  get_current_ip_address

from logSystemApp.models import Log

from django.utils import timezone
from rest_framework_simplejwt.tokens import AccessToken
from django.contrib.auth import get_user_model

User = get_user_model()





# Create your views here.
# AUTH_COOKIE = 'access'  # not used 
# AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 365 * 2
# AUTH_COOKIE_SECURE =  'True'
# AUTH_COOKIE_HTTP_ONLY = True
# AUTH_COOKIE_PATH = '/'
# AUTH_COOKIE_SAMESITE = 'None'


# AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 365 * 2 
# AUTH_COOKIE_SECURE =  True
# AUTH_COOKIE_HTTP_ONLY = True
# AUTH_COOKIE_PATH = '/'
# AUTH_COOKIE_SAMESITE = 'None'

 

AUTH_COOKIE_MAX_AGE = settings.AUTH_COOKIE_MAX_AGE
AUTH_COOKIE_SECURE =  settings.AUTH_COOKIE_SECURE
AUTH_COOKIE_HTTP_ONLY = settings.AUTH_COOKIE_HTTP_ONLY
AUTH_COOKIE_PATH = settings.AUTH_COOKIE_PATH
AUTH_COOKIE_SAMESITE = settings.AUTH_COOKIE_SAMESITE




from rest_framework.exceptions import ValidationError
from djoser.views import UserViewSet
from djoser.serializers import SendEmailResetSerializer
 


# use for register new site user on main urls.py "router.register(r'users', CustomUserViewSet, basename='user')""
class CustomUserViewSet(UserViewSet):
    def create(self, request, *args, **kwargs):
            if getattr(settings, "RECAPTCHA_ENABLED", True):
                recaptcha_value = request.data.get("recaptcha_value")
                if not recaptcha_value or not verify_recaptcha(recaptcha_value):

                    return Response({"detail": "Invalid reCAPTCHA. Please try again."}, status=status.HTTP_400_BAD_REQUEST)
 
            return super().create(request, *args, **kwargs)

 
 



class ProfileView(APIView):
    parser_classes = [MultiPartParser, FormParser]  # For handling image uploads

    def get(self, request, *args, **kwargs):
        profile , created = Profile.objects.get_or_create(PRF_user= self.request.user)
        serializer = ProfileSerializer(profile, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        profile, created = Profile.objects.get_or_create(PRF_user=self.request.user)
        serializer = ProfileSerializer(profile, data=request.data, partial=True, context={'request': request})

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)






class CustomProviderAuthView(ProviderAuthView):

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        if response.status_code == 201:
            access_token = response.data.get('access')
            refresh_token = response.data.get('refresh')

            response.set_cookie(
                'access',
                access_token,
                max_age=AUTH_COOKIE_MAX_AGE,
                path=AUTH_COOKIE_PATH,
                secure=AUTH_COOKIE_SECURE,
                httponly=AUTH_COOKIE_HTTP_ONLY,
                samesite=AUTH_COOKIE_SAMESITE,

            )
            response.set_cookie(
                'refresh',
                refresh_token,
                max_age=AUTH_COOKIE_MAX_AGE,
                path=AUTH_COOKIE_PATH,
                secure=AUTH_COOKIE_SECURE,
                httponly=AUTH_COOKIE_HTTP_ONLY,
                samesite=AUTH_COOKIE_SAMESITE,

            )

            
            user = None
            try:
                # access_token = response.data.get('access')
                token = AccessToken(access_token)
                user_id = token['user_id']
                user = User.objects.get(id=user_id)
            except:
                pass
            if user:
                try:
                    Log.objects.create(
                        user=user,
                        action_type=Log.LOGIN,
                        model_name='User',
                        object_id=user.pk,
                        object_description=str(user),
                        timestamp=timezone.now(),
                        changes={
                            "status": "User logged in with google account",
                            "first_name": user.first_name,
                            "last_name": user.last_name,
                            "email": user.email,
                        },
                        ip_address=get_current_ip_address(),
                    )
                except:
                    pass
 
        return response




class CustomTokenObtainPairView(TokenObtainPairView):

    def post(self, request, *args, **kwargs):


        if getattr(settings, "RECAPTCHA_ENABLED", True):  # Default to True if not found
            recaptcha_value = request.data.get("recaptcha_value")
            if not recaptcha_value or not verify_recaptcha(recaptcha_value):
                return Response({"detail": "Invalid reCAPTCHA. Please try again."}, status=status.HTTP_400_BAD_REQUEST)

        response = super().post(request, *args, **kwargs)

        if response.status_code == 200:
            access_token = response.data.get('access')
            refresh_token = response.data.get('refresh')

            response.set_cookie(
                'access',
                access_token,
                max_age=AUTH_COOKIE_MAX_AGE,
                path=AUTH_COOKIE_PATH,
                secure=AUTH_COOKIE_SECURE,
                httponly=AUTH_COOKIE_HTTP_ONLY,
                samesite=AUTH_COOKIE_SAMESITE,

            )
            response.set_cookie(
                'refresh',
                refresh_token,
                max_age=AUTH_COOKIE_MAX_AGE,
                path=AUTH_COOKIE_PATH,
                secure=AUTH_COOKIE_SECURE,
                httponly=AUTH_COOKIE_HTTP_ONLY,
                samesite=AUTH_COOKIE_SAMESITE,

            )


            user = None
            try:
                # access_token = response.data.get('access')
                token = AccessToken(access_token)
                user_id = token['user_id']
                user = User.objects.get(id=user_id)
            except:
                pass
            if user:
                try:
                    Log.objects.create(
                        user=user,
                        action_type=Log.LOGIN,
                        model_name='User',
                        object_id=user.pk,
                        object_description=str(user),
                        timestamp=timezone.now(),
                        changes={
                            "status": "User logged in",
                            "first_name": user.first_name,
                            "last_name": user.last_name,
                            "email": user.email,
                        },
                        ip_address=get_current_ip_address(),
                    )
                except:
                    pass


        return response













class CustomTokenRefreshView(TokenRefreshView):

    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get('refresh')

        if refresh_token:
            request.data['refresh'] = refresh_token

        response = super().post(request, *args, **kwargs)

        if response.status_code == 200:
            access_token = response.data.get('access')

            response.set_cookie(
                'access',
                access_token,
                max_age=AUTH_COOKIE_MAX_AGE,
                path=AUTH_COOKIE_PATH,
                secure=AUTH_COOKIE_SECURE,
                httponly=AUTH_COOKIE_HTTP_ONLY,
                samesite=AUTH_COOKIE_SAMESITE,

            )

        return response


class CustomTokenVerifyView(TokenVerifyView):
    def post(self, request, *args, **kwargs):
        access_token = request.COOKIES.get('access')

        if access_token:
            request.data['token'] = access_token

        return super().post(request, *args, **kwargs)


class LogoutView(APIView):
    def post(self, request, *args, **kwargs):

        user = None
        try:
            access_token = request.COOKIES.get('access')
            token = AccessToken(access_token)
            user_id = token['user_id']
            user = User.objects.get(id=user_id)
        except :
            pass

        if user:

            try:
                Log.objects.create(
                    user=user,
                    action_type=Log.LOGOUT,
                    model_name='User',
                    object_id=user.pk,
                    object_description=str(user),
                    timestamp=timezone.now(),
                    changes={
                        "status": "User logged out",
                        "first_name": user.first_name,
                        "last_name": user.last_name,
                        "email": user.email,
                    },
                    ip_address=get_current_ip_address(),
                )
            except:
                pass


        response = Response(status=status.HTTP_204_NO_CONTENT)
        response.delete_cookie('access')
        response.delete_cookie('refresh')

        return response