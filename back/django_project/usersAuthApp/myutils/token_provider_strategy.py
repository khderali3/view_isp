
from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings

class CustomProviderTokenStrategy:
    @classmethod
    def obtain(cls, user):

        refresh = RefreshToken.for_user(user)

        refresh['first_name'] = user.first_name


        return {
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        }
