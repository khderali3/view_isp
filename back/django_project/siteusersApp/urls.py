

from django.urls import path
from .views import Index,ProductDetailView, FooterView, SocialMediaView

urlpatterns = [
    path('index/', Index.as_view({'get': 'retrieve'}) ),
    path('product/<slug:slug>/', ProductDetailView.as_view(), name='product-detail'),
    path('footer/', FooterView.as_view() ),
    path('social/', SocialMediaView.as_view() ),

]