from django.urls import path



from .views import LogView, LogViewDeleteAll, ErrorLogView, ErrorLogViewDeleteAll

 


urlpatterns = [
    path('audit_logs/', LogView.as_view()),
    path('audit_logs/delete_all/', LogViewDeleteAll.as_view()),

    path('error_logs/', ErrorLogView.as_view() ),
    path('error_logs/delete_all/', ErrorLogViewDeleteAll.as_view() ),

]