from django.shortcuts import render

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
)
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.views import APIView


from usersAuthApp.models import Profile

from rest_framework.exceptions import AuthenticationFailed

from rest_framework_simplejwt.tokens import UntypedToken
from .my_custom_serializer import (CustomTokenObtainPairSerializer,
                                    CustomUserSerializer, StaffPasswordChangeSerializer,
                                    StaffCustomTokenVerifySerializer,
                                    StaffProfileSerializer,
                                    StaffCustomTokenRefreshSerializer
                                    )
from django.contrib.auth import get_user_model

from usersAuthApp.myutils.public_utils import verify_recaptcha






from django_project.middleware import  get_current_ip_address

from logSystemApp.models import Log

from django.utils import timezone
from rest_framework_simplejwt.tokens import AccessToken
from django.contrib.auth import get_user_model

User = get_user_model()






 

# AUTH_COOKIE_MAX_AGE = 60 * 60 * 24
# AUTH_COOKIE_SECURE =  'True'
# AUTH_COOKIE_HTTP_ONLY = True
# AUTH_COOKIE_PATH = '/'
# AUTH_COOKIE_SAMESITE = 'None'


from django.conf import settings

AUTH_COOKIE_MAX_AGE = settings.AUTH_COOKIE_MAX_AGE
AUTH_COOKIE_SECURE =  settings.AUTH_COOKIE_SECURE
AUTH_COOKIE_HTTP_ONLY = settings.AUTH_COOKIE_HTTP_ONLY
AUTH_COOKIE_PATH = settings.AUTH_COOKIE_PATH
AUTH_COOKIE_SAMESITE = settings.AUTH_COOKIE_SAMESITE





from rest_framework.parsers import MultiPartParser, FormParser


class StaffCustomTokenRefreshView(APIView):
    permission_classes = []  # No permissions required for this view

    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get('refresh')

        if not refresh_token:
            return Response({"detail": "Refresh token not found in cookies."}, status=status.HTTP_400_BAD_REQUEST)
        
        # Inject the token into request data for validation
        request.data['refresh'] = refresh_token

        serializer = StaffCustomTokenRefreshSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            access_token = serializer.validated_data['access']
            response = Response(serializer.validated_data, status=status.HTTP_200_OK)
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
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)





class StffProfileView(APIView):
    parser_classes = [MultiPartParser, FormParser]  # For handling image uploads

    def get(self, request, *args, **kwargs):
        profile , created = Profile.objects.get_or_create(PRF_user= self.request.user)
        serializer = StaffProfileSerializer(profile, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        profile, created = Profile.objects.get_or_create(PRF_user=self.request.user)
        serializer = StaffProfileSerializer(profile, data=request.data, partial=True, context={'request': request})

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)







from django.conf import settings


class StaffCustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):

        # recaptcha_value = request.data.get("recaptcha_value")
        # if not recaptcha_value or not verify_recaptcha(recaptcha_value):
        #     return Response({"detail": "Invalid reCAPTCHA. Please try again."}, status=status.HTTP_400_BAD_REQUEST)
 
        if getattr(settings, "RECAPTCHA_ENABLED", True):  # Default to True if not found
            recaptcha_value = request.data.get("recaptcha_value")
            if not recaptcha_value or not verify_recaptcha(recaptcha_value):
                return Response({"detail": "Invalid reCAPTCHA. Please try again."}, status=status.HTTP_400_BAD_REQUEST)




        # Manually instantiate the custom serializer with request data
        serializer = CustomTokenObtainPairSerializer(data=request.data, context={'request': request})

        # Validate the serializer
        if serializer.is_valid():
            # Get the tokens and other validated data
            data = serializer.validated_data

            # Generate the response including the tokens and custom data
            response = Response(data, status=status.HTTP_200_OK)

            # Set cookies for the tokens
            access_token = data.get('access')
            refresh_token = data.get('refresh')

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
                            "status": "User logged in to a staff dashboard",
                            "first_name": user.first_name,
                            "last_name": user.last_name,
                            "email": user.email,
                        },
                        ip_address=get_current_ip_address(),
                    )
                except:
                    pass





            return response
        else:
            # If validation fails, return an error response
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class StaffLogoutView(APIView):
    def post(self, request, *args, **kwargs):
        response = Response(status=status.HTTP_204_NO_CONTENT)


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
                        "status": "User logged out from staff dashboard",
                        "first_name": user.first_name,
                        "last_name": user.last_name,
                        "email": user.email,
                    },
                    ip_address=get_current_ip_address(),
                )
            except:
                pass







        response.delete_cookie('access')
        response.delete_cookie('refresh')

        return response



class StaffMeView(APIView):
    def get(self, request):
        user = request.user  # The user is automatically authenticated based on the JWT token

        # if not user.is_staff and not  user.is_superuser:
        #     response = Response( 
        #                     data={"message": "you don't have permission to access this site!"},
        #                     status=status.HTTP_400_BAD_REQUEST
        #                     )
        #     response.delete_cookie('access')
        #     response.delete_cookie('refresh')
        #     return response
        
        serializer = CustomUserSerializer(user, context={'request': request})

        return Response(serializer.data)


class StaffChangePasswordView(generics.UpdateAPIView):
    serializer_class = StaffPasswordChangeSerializer

    def get_object(self):
        return self.request.user  # The object to update is the authenticated user

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()  # Save the new password

        return Response({"detail": "Password updated successfully."}, status=status.HTTP_200_OK)






class StaffTokenVerifyView(generics.GenericAPIView):
    serializer_class = StaffCustomTokenVerifySerializer


    def post(self, request, *args, **kwargs):
        # Get the access token from cookies
        access_token = request.COOKIES.get('access')

        # If no token is found in cookies, raise an error
        if not access_token:
            raise AuthenticationFailed('Token not found in cookies.')

        # Validate the token using the custom serializer
        serializer = self.get_serializer(data={'token': access_token})
        serializer.is_valid(raise_exception=True)

        # If token is valid, decode it and return a response
        try:
            token = UntypedToken(access_token)  # Decode the token
            user_id = token['user_id']  # Extract user ID from the token
            # Optionally: Retrieve user info from the token (you can extend this with more fields)
            user = self.get_user(user_id)
            

            response_data = {
                "detail": "Token is valid.",
                "user_id": user.id,
                "email": user.email,
                "firstname": user.first_name,
                "lastname": user.last_name,
                "is_staff": user.is_staff,
                "is_superuser": user.is_superuser,
                "permissions": list(user.get_all_permissions()),
                "groups": list(user.groups.values('id', 'name')),
                'departments': list(user.departments.values('id', 'department_name'))

            }

            response_data['profile_image'] = None


            if hasattr(user, 'profile_prf_user_relaed_useraccount') and user.profile_prf_user_relaed_useraccount.PRF_image:
                PRF_image = user.profile_prf_user_relaed_useraccount.PRF_image
                # Use the request object to build the full URL for the image
                response_data['profile_image'] = request.build_absolute_uri(PRF_image.url)


            return Response(response_data, status=status.HTTP_200_OK)


        except Exception as e:
            raise AuthenticationFailed('Invalid token.')

    def get_user(self, user_id):
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            raise AuthenticationFailed('User not found.')
        return user



