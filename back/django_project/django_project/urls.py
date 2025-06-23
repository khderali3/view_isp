
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from ticketSystemApp.views import TicketProtectedMediaView, ProjectFlowProtectedMediaView, ProjectFlowTemplateProtectedMediaView



# added by khder
from rest_framework.routers import DefaultRouter
from usersAuthApp.views import CustomUserViewSet
router = DefaultRouter()
router.register(r'users', CustomUserViewSet, basename='user')
# end added by khder

urlpatterns = [
    path('admin/', admin.site.urls),

    path('api/staff/log/', include('logSystemApp.urls')),


    path('api/staff/auth/', include('staffAuthApp.urls')),
    path('api/staff/site/', include('sitestaffApp.urls')),
    path('api/staff/ticket/', include('ticketSystemStaffApp.urls')),
    path('api/staff/usersmanagment/', include('usersManagmentStaffApp.urls')),


    # path('api/', include('djoser.urls')),


    path('api/', include(router.urls)),

    path('api/', include('usersAuthApp.urls')),
    path('api/site/', include('siteusersApp.urls')),
    path('api/ticket/', include('ticketSystemApp.urls')),


    path('api/', include('projectFlowApp.urls')), # projects urls "/staff/project/ or /project/"

    # protecte ticket files media
    path('media_url/ticket/ticket_files/<str:file_name>/', TicketProtectedMediaView.as_view(),  ),
    path('media_url/ticket/ticket_replay_files/<str:file_name>/', TicketProtectedMediaView.as_view(),  ),

    # protecte projectflow files media

    path('media_url/project_flow/ProjectFlowAttachment/<str:file_name>/', ProjectFlowProtectedMediaView.as_view(), ),
    path('media_url/project_flow/ProjectFlowNoteAttachment/<str:file_name>/', ProjectFlowProtectedMediaView.as_view(),  ),
    path('media_url/project_flow/ProjectFlowStepNoteAttachment/<str:file_name>/', ProjectFlowProtectedMediaView.as_view(),  ),
    path('media_url/project_flow/ProjectFlowSubStepNoteAttachment/<str:file_name>/', ProjectFlowProtectedMediaView.as_view(),  ),

    # protect projectflow template files 
    path('media_url/project_flow/ProjectFlowTemplateNoteAttachment/<str:file_name>/', ProjectFlowTemplateProtectedMediaView.as_view(),  ),
    path('media_url/project_flow/StepTemplateNoteAttachment/<str:file_name>/', ProjectFlowTemplateProtectedMediaView.as_view(),  ),
    path('media_url/project_flow/SubStepTemplateNoteAttachment/<str:file_name>/', ProjectFlowTemplateProtectedMediaView.as_view(),  ),

]



 

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
