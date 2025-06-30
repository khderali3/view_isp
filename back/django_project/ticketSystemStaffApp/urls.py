
from django.urls import path
from .ticket_views import (DepartmentsStaffView, TicketStaffView,
					 TicketFileStaffView, CloseTicketStaffView, ReopenTicketStaffView,
					 AssignTicketToMeStaffView, AssignReassignTicketStaffView,GetTicketByIdStaff, TicketStatusCountAPIView
					 )



from .ticketReply_views import (
	TicketReplayStaffView, TicketReplyFileStaffView
)

from .license_view import LicenseView

urlpatterns = [
	# start ticket staff views 
    

    path('status_counts/', TicketStatusCountAPIView.as_view(), name='ticket-status-counts'),




	path('departments/', DepartmentsStaffView.as_view()),  
    path('departments/<int:id>/', DepartmentsStaffView.as_view() ),

 
 	path('tickets/<int:ticket_id>/files/', TicketFileStaffView.as_view(), name='get_and_post_list_ticket_files'),  
	 
    path('tickets/files/<int:file_id>/', TicketFileStaffView.as_view(), name='delete_ticket_file'),


	path('tickets/<int:id>/', TicketStaffView.as_view(), name='delete_ticket_object'),  
	path('tickets/<slug:slug>/', TicketStaffView.as_view(), name='get_ticket_object'),
	path('tickets/get_ticket_by_id/<int:id>/', GetTicketByIdStaff.as_view(), name='get_ticket_object_by_id'),




	path('tickets/', TicketStaffView.as_view(), name='get_all_ticket_list'), 
	path('my_tickets/', TicketStaffView.as_view(), name='get_my_ticket_list'), 

    path('tickets/<int:ticket_id>/close/', CloseTicketStaffView.as_view(), name='close_ticket'),
    path('tickets/<int:ticket_id>/reopen/', ReopenTicketStaffView.as_view(), name='reopen_ticket'),

    path('tickets/<int:ticket_id>/assign_to_me/', AssignTicketToMeStaffView.as_view(), name='assign_ticket_to_me'),
    path('tickets/<int:ticket_id>/assign_or_reassign/', AssignReassignTicketStaffView.as_view(), name='assign_or_reassign_ticket'),
	# end ticket staff views 

	# start ticket reply  staff views 
	
    path('ticket_reply/', TicketReplayStaffView.as_view(), name='ticket_reply'),
    path('ticket_reply/<int:id>/', TicketReplayStaffView.as_view(), name='ticket_reply_edit_and_get_or_delete'),

    path('ticket_reply/<int:ticket_reply_id>/files/', TicketReplyFileStaffView.as_view(), name='ticket_reply_get_list_or_post_list'),

    path('ticket_reply/files/<int:file_id>/', TicketReplyFileStaffView.as_view(), name='delete_ticket_reply_file'),



    path('licanse/', LicenseView.as_view())



]