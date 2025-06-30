

from django.urls import path, include
 

from .views_module.license_view import LicenseView



urlpatterns = [
    
    path('site/', include('projectFlowApp.urls_module.site_urls')),
    
    path('staff/', include('projectFlowApp.urls_module.staff_projectFlowTemplate_urls')),

    path('staff/', include('projectFlowApp.urls_module.staff_projectFlow_urls')),

    path('staff/', include('projectFlowApp.urls_module.staff_projectType_urls')),

    path('staff/projectFlowApp/licanse/', LicenseView.as_view())


]