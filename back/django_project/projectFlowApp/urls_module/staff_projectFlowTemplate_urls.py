

from django.urls import path
 

from ..views_module.staff_workflow_template_views import (ProjectFlowTemplateView, StepTemplateView, StepTemplateNoteView,
                                        StepTemplateNoteAttachmentView,
                                        ProjectFlowTemplateNoteView, ProjectFlowTemplateNoteAttachmentView,
                                         SubStepTemplateView,  SubStepTemplateNoteView,
                                        SubStepTemplateNoteAttachmentView, StepTemplateResortMoveUpOrDownView, StepTemplateResortByAbsolutePositionView,
                                        SubStepTemplateResortMoveUpOrDownView, SubStepTemplateResortByAbsolutePositionView, GetFullProjectFlowTemplateView
                                        )


urlpatterns = [

 

     path('project_flow_template/', ProjectFlowTemplateView.as_view()),
     path('project_flow_template/<int:id>/', ProjectFlowTemplateView.as_view()),
     path('project_flow_template/<int:id>/get_full_flow/', GetFullProjectFlowTemplateView.as_view()),


     # path('project_flow_template/<int:project_flow_template_id>/files/', ProjectFlowTemplateAttachmentView.as_view()),
     # path('project_flow_template/<int:project_flow_template_id>/files/<int:file_id>/', ProjectFlowTemplateAttachmentView.as_view()),


     path('project_flow_template/<int:project_flow_template_id>/note/', ProjectFlowTemplateNoteView.as_view()),
     path('project_flow_template/<int:project_flow_template_id>/note/<int:note_id>/', ProjectFlowTemplateNoteView.as_view()),


     path('project_flow_template/note/<int:note_id>/files/', ProjectFlowTemplateNoteAttachmentView.as_view()),
     path('project_flow_template/note/<int:note_id>/files/<int:file_id>/', ProjectFlowTemplateNoteAttachmentView.as_view()),






     # path('steps_template/', StepTemplateView.as_view()),
     # path('steps_template/<int:id>/', StepTemplateView.as_view()),

     path('project_flow_template/<int:project_flow_template_id>/steps_template/', StepTemplateView.as_view()),
     path('project_flow_template/<int:project_flow_template_id>/steps_template/<int:step_id>/', StepTemplateView.as_view()),

     # start steps resort 
     path('project_flow_template/<int:project_flow_template_id>/steps_template/<int:step_id>/resort/resort_up_down/<str:direction>/', StepTemplateResortMoveUpOrDownView.as_view()),
     path('project_flow_template/<int:project_flow_template_id>/steps_template/<int:step_id>/resort/absolute_position/<int:absolute_position>/', StepTemplateResortByAbsolutePositionView.as_view()),
     # end steps resort 



     # path('project_flow_template/steps_template/<int:step_id>/files/', StepTemplateAttachmentView.as_view()),
     # path('project_flow_template/steps_template/<int:step_id>/files/<int:file_id>/', StepTemplateAttachmentView.as_view()),




     path('project_flow_template/steps_template/<int:step_template_id>/steps_template_note/', StepTemplateNoteView.as_view()),
     path('project_flow_template/steps_template/<int:step_template_id>/steps_template_note/<int:step_template_note_id>/', StepTemplateNoteView.as_view()),

     # handle template note file
     path('project_flow_template/steps_template/steps_template_note/<int:step_template_note_id>/files/', StepTemplateNoteAttachmentView.as_view()),
     path('project_flow_template/steps_template/steps_template_note/<int:step_template_note_id>/files/<int:file_id>/', StepTemplateNoteAttachmentView.as_view()),


     # path('steps_template_note/', StepTemplateNoteView.as_view()),


     path('project_flow_template/steps_template/<int:step_id>/sub_steps/', SubStepTemplateView.as_view()),
     path('project_flow_template/steps_template/<int:step_id>/sub_steps/<int:sub_step_id>/', SubStepTemplateView.as_view()),


     # start sub steps resort 
     path('project_flow_template/steps_template/<int:step_id>/sub_steps/<int:sub_step_id>/resort/resort_up_down/<str:direction>/', SubStepTemplateResortMoveUpOrDownView.as_view()),
     path('project_flow_template/steps_template/<int:step_id>/sub_steps/<int:sub_step_id>/resort/absolute_position/<int:absolute_position>/', SubStepTemplateResortByAbsolutePositionView.as_view()),

      # end sub steps resort






     # path('project_flow_template/sub_steps/<int:sub_step_id>/files/', SubStepTemplateAttachmentView.as_view()),
     # path('project_flow_template/sub_steps/<int:sub_step_id>/files/<int:file_id>/', SubStepTemplateAttachmentView.as_view()),


     path('project_flow_template/sub_steps/<int:sub_step_id>/sub_step_note/', SubStepTemplateNoteView.as_view()),
     path('project_flow_template/sub_steps/<int:sub_step_id>/sub_step_note/<int:note_id>/', SubStepTemplateNoteView.as_view()),


     path('project_flow_template/sub_steps/sub_step_note/<int:note_id>/files/', SubStepTemplateNoteAttachmentView.as_view()),
     path('project_flow_template/sub_steps/sub_step_note/<int:note_id>/files/<int:file_id>/', SubStepTemplateNoteAttachmentView.as_view()),


]