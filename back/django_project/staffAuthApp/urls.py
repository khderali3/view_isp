


from django.urls import path
from .views import (
    StaffCustomTokenObtainPairView,
    StaffLogoutView, 
    StaffMeView,
    StaffChangePasswordView,
    StaffTokenVerifyView,
    StffProfileView,
    StaffCustomTokenRefreshView
)

urlpatterns = [

    path('create/', StaffCustomTokenObtainPairView.as_view()),
    path('logout/', StaffLogoutView.as_view()),
    path('refresh/', StaffCustomTokenRefreshView.as_view()),

    path('change_password/', StaffChangePasswordView.as_view()),
    path('me/' , StaffMeView.as_view()),
    path('verify/', StaffTokenVerifyView.as_view() ),
    path('profile/', StffProfileView.as_view())
    
]