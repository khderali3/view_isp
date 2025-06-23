from django.urls import path



from .views import LogView, LogViewDeleteAll






urlpatterns = [
    path('logs/', LogView.as_view()),
    path('logs/delete_all/', LogViewDeleteAll.as_view()),
]