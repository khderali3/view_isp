

from django.urls import path
 

from ..views_module.staff_workflow_views import ( 
    ProjectFlowView, ProjectFlowAttachmentView, ProjectFlowNoteView, ProjectFlowNoteAttachmentView , ProjectFlowStepView, 
    ProjectFlowStepNoteView, ProjectFlowStepNoteAttachmentView, ProjectFlowSubStepView,  ProjectFlowSubStepNoteView, ProjectFlowSubStepNoteAttachmentView,
    GetFullProjectFlowView, StepResortMoveUpOrDownView, StepResortByAbsolutePositionView, SubStepResortMoveUpOrDownView, SubStepResortByAbsolutePositionView,
    StartStepProcess, EndStepProcess, StartSubStepProcess, EndSubStepProcess, CanceleProjectFlow, ReopenProjectFlow, InstalledProductView, InstalledProductTypeView,
    ProjectFlowStatusCountAPIView
    )
 

from ..views_module.mount_template_views import CloneWorkFlowTemplateView


urlpatterns = [


    path('projectflow/projectflow/status_counts/', ProjectFlowStatusCountAPIView.as_view(), name='projectflow-status-counts'),

 
    path("projectflow/clone_project_flow_template/<int:template_id>/<int:projectflow_id>/", CloneWorkFlowTemplateView.as_view()),

     path('projectflow/projectflow/', ProjectFlowView.as_view()),
     path('projectflow/projectflow/<int:id>/', ProjectFlowView.as_view()),
     path('projectflow/projectflow/<int:id>/get_full_flow/', GetFullProjectFlowView.as_view()),
     
     path('projectflow/projectflow/<int:id>/cancele_project_flow/', CanceleProjectFlow.as_view()),
     path('projectflow/projectflow/<int:id>/reopen_project_flow/', ReopenProjectFlow.as_view()),



    #projectflow installed product 
     path('projectflow/projectflow/installed_product_type/', InstalledProductTypeView.as_view()),
     path('projectflow/projectflow/installed_product_type/<int:id>/', InstalledProductTypeView.as_view()),



    path('projectflow/projectflow/<int:projectflow>/<int:installed_product_type>/installed_product/', InstalledProductView.as_view()),
    path('projectflow/projectflow/<int:projectflow>/installed_product/', InstalledProductView.as_view()),

    path('projectflow/projectflow/<int:projectflow>/installed_product/<int:id>/', InstalledProductView.as_view()),
    # end projectflow installed product



     path('projectflow/projectflow/<int:project_flow>/files/', ProjectFlowAttachmentView.as_view()),
     path('projectflow/projectflow/<int:project_flow>/files/<int:file_id>/', ProjectFlowAttachmentView.as_view()),

     path('projectflow/projectflow/<int:project_flow>/note/', ProjectFlowNoteView.as_view()),
     path('projectflow/projectflow/<int:project_flow>/note/<int:note_id>/', ProjectFlowNoteView.as_view()),


     path('projectflow/projectflow/note/<int:note_id>/files/', ProjectFlowNoteAttachmentView.as_view()),
     path('projectflow/projectflow/note/<int:note_id>/files/<int:file_id>/', ProjectFlowNoteAttachmentView.as_view()),


     path('projectflow/projectflow/<int:project_flow>/step/', ProjectFlowStepView.as_view()),
     path('projectflow/projectflow/<int:project_flow>/step/<int:step_id>/', ProjectFlowStepView.as_view()),


    # start and end step process

     path('projectflow/projectflow/<int:project_flow>/step/start_process/<int:step_id>/', StartStepProcess.as_view()),
     path('projectflow/projectflow/<int:project_flow>/step/end_process/<int:step_id>/', EndStepProcess.as_view()),

  


     # start steps resort 

     path('projectflow/projectflow/<int:project_flow_id>/step/<int:step_id>/resort/resort_up_down/<str:direction>/', StepResortMoveUpOrDownView.as_view()),
     path('projectflow/projectflow/<int:project_flow_id>/step/<int:step_id>/resort/absolute_position/<int:absolute_position>/', StepResortByAbsolutePositionView.as_view()),
 
     # end steps resort 





     path('projectflow/projectflow/step/<int:step>/note/', ProjectFlowStepNoteView.as_view()),
     path('projectflow/projectflow/step/<int:step>/note/<int:note_id>/', ProjectFlowStepNoteView.as_view()),


     path('projectflow/projectflow/step/note/<int:note_id>/files/', ProjectFlowStepNoteAttachmentView.as_view()),
     path('projectflow/projectflow/step/note/<int:note_id>/files/<int:file_id>/', ProjectFlowStepNoteAttachmentView.as_view()),



     path('projectflow/projectflow/step/<int:step>/sub_step/', ProjectFlowSubStepView.as_view()),
     path('projectflow/projectflow/step/<int:step>/sub_step/<int:sub_step_id>/', ProjectFlowSubStepView.as_view()),




    # start and end sub step process

     path('projectflow/projectflow/step/<int:step_id>/sub_step/start_process/<int:sub_step_id>/', StartSubStepProcess.as_view()),
     path('projectflow/projectflow/step/<int:step_id>/sub_step/end_process/<int:sub_step_id>/', EndSubStepProcess.as_view()),


 

     # start sub steps resort 
     path('projectflow/projectflow/step/<int:step_id>/sub_step/<int:sub_step_id>/resort/resort_up_down/<str:direction>/', SubStepResortMoveUpOrDownView.as_view()),
     path('projectflow/projectflow/step/<int:step_id>/sub_step/<int:sub_step_id>/resort/absolute_position/<int:absolute_position>/', SubStepResortByAbsolutePositionView.as_view()),

      # end sub steps resort




     path('projectflow/projectflow/step/sub_step/<int:sub_step>/note/', ProjectFlowSubStepNoteView.as_view()),
     path('projectflow/projectflow/step/sub_step/<int:sub_step>/note/<int:note_id>/', ProjectFlowSubStepNoteView.as_view()),


     path('projectflow/projectflow/step/sub_step/note/<int:note>/files/', ProjectFlowSubStepNoteAttachmentView.as_view()),
     path('projectflow/projectflow/step/sub_step/note/<int:note>/files/<int:file_id>/', ProjectFlowSubStepNoteAttachmentView.as_view()),


]