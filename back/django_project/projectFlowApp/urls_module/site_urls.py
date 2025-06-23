

from django.urls import path
# from ..views_module.staff_views import ProjectTypeView

from ..views_module.site_views import (ProjectTypeView, ProjectFlowView, ProjectFlowNoteView, ProjectFlowNoteAttachmentView,
                                       ProjectFlowStepNoteView, ProjectFlowSubStepNoteView,
                                       StartStepProcess, EndStepProcess, StartSubStepProcess, EndSubStepProcess, InstalledProductView
                                       )


urlpatterns = [

    path('project/', ProjectTypeView.as_view()),
    path('project/<slug:project_slog>/', ProjectTypeView.as_view()),
    path('project_flow/', ProjectFlowView.as_view()),
    path('project_flow/<slug:project_flow_slug>/', ProjectFlowView.as_view()),


    path('project_flow/<int:project_flow_id>/notes/', ProjectFlowNoteView.as_view()),
    path('project_flow/<int:project_flow_id>/notes/<int:note_id>/', ProjectFlowNoteView.as_view()),


    path('project_flow/notes/<int:note_id>/files/', ProjectFlowNoteAttachmentView.as_view()),
    path('project_flow/notes/<int:note_id>/files/<int:file_id>/', ProjectFlowNoteAttachmentView.as_view()),

     path('projectflow/projectflow/step/<int:step>/note/', ProjectFlowStepNoteView.as_view()),
     path('projectflow/projectflow/step/<int:step>/note/<int:note_id>/', ProjectFlowStepNoteView.as_view()),


    # start projectflow installed product

    path('projectflow/projectflow/<int:projectflow>/installed_product/', InstalledProductView.as_view()),

    # end projectflow installed product 





    # start and end step process

     path('projectflow/projectflow/<int:project_flow>/step/start_process/<int:step_id>/', StartStepProcess.as_view()),
     path('projectflow/projectflow/<int:project_flow>/step/end_process/<int:step_id>/', EndStepProcess.as_view()),





     path('projectflow/projectflow/step/sub_step/<int:sub_step>/note/', ProjectFlowSubStepNoteView.as_view()),
     path('projectflow/projectflow/step/sub_step/<int:sub_step>/note/<int:note_id>/', ProjectFlowSubStepNoteView.as_view()),

    # start and end sub step process

     path('projectflow/projectflow/step/<int:step_id>/sub_step/start_process/<int:sub_step_id>/', StartSubStepProcess.as_view()),
     path('projectflow/projectflow/step/<int:step_id>/sub_step/end_process/<int:sub_step_id>/', EndSubStepProcess.as_view()),

]