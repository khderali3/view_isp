


from django.urls import path

from ..views_module.staff_project_type_views import ProjectTypeView, ProjectTypeExtraImagesView, ProjectTypeAttachmentView


urlpatterns = [

     path('projectflow/project_type/', ProjectTypeView.as_view()),
     path('projectflow/project_type/<int:project_type>/', ProjectTypeView.as_view()),


     path('projectflow/project_type/<int:project_type>/extra_images/', ProjectTypeExtraImagesView.as_view()),
     path('projectflow/project_type/<int:project_type>/extra_images/<int:file_id>/', ProjectTypeExtraImagesView.as_view()),

     path('projectflow/project_type/<int:project_type>/files/', ProjectTypeAttachmentView.as_view()),
     path('projectflow/project_type/<int:project_type>/files/<int:file_id>/', ProjectTypeAttachmentView.as_view()),

 ]