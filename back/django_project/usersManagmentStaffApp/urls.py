
from django.urls import path

from .views import (  UsersView, StaffUsersView, UserobjectView,
					 GroupAPIView, PermissionAPIView,
					  UserGroupView, UserPermissionView,
					  SetPasswordAPIView, UserDepartmnetsView, GroupPermissionView
					  )

urlpatterns = [
	# start ticket staff views 
	path('users/', UsersView.as_view(), name='users_url'),  
	path('users/<int:id>/', UserobjectView.as_view(), name='users_object_url'),  
     path('users/<int:id>/set-password/', SetPasswordAPIView.as_view(), name='set-password'),

	path('staff/', StaffUsersView.as_view(), name='staff_users_url'),
	  
    path('group/', GroupAPIView.as_view(), name='group-list'),  # For list and create
    path('group/<int:pk>/', GroupAPIView.as_view(), name='group-detail'),  # For retrieve, update, and delete
    path('group/<int:group_id>/permission/', GroupPermissionView.as_view(), name='group-detail'),  # For retrieve, update, and delete


	path('permissions/', PermissionAPIView.as_view(), name='permission-list'),
    path('permissions/<int:pk>/', PermissionAPIView.as_view(), name='permission-detail'),

	
    path('users/<int:user_id>/permission/', UserPermissionView.as_view(), name='assign-remove-permission'),


    path('users/<int:user_id>/department/', UserDepartmnetsView.as_view(), name='assign-remove-department'),

    path('users/<int:user_id>/group/', UserGroupView.as_view(), name='assign-remove-group'),


]