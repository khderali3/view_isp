from django.urls import path
from .views import TicketView, TicketReplayView, DepartmentsView, CloseTicketView, ReopenTicketView

urlpatterns = [
    # Other URLs...

    # Ticket creation API


 


    path('', TicketView.as_view(), name='tickets'),  
    path('ticket_replay/', TicketReplayView.as_view(), name='ticket_reply_create'), # create a new reply ticket
    path('departments/', DepartmentsView.as_view(), name='get_departments'), # get departments
    
    path('<slug:slug>/', TicketView.as_view(), name='ticket-detail'),  # For retrieving (GET)a specific ticket detail

    path('<int:ticket_id>/close/', CloseTicketView.as_view(), name='close_ticket'),
    path('<int:ticket_id>/reopen/', ReopenTicketView.as_view(), name='reopen_ticket'),




]