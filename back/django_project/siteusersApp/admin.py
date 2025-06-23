from django.contrib import admin
from .models import (HomeSection, AboutUs, WhyUs, FeatureWhyUs,
                      ProductSection, Product, OurServicesSection, Service, OurVision, 
                      Focus,OurClientSection, OurClient,CompnayIfRight,
					  Footer, SocialMedia
                      )
# Register your models here.


admin.site.register(HomeSection)
admin.site.register(AboutUs)
admin.site.register(WhyUs)
admin.site.register(FeatureWhyUs)
admin.site.register(ProductSection)
admin.site.register(Product)
admin.site.register(OurServicesSection)
admin.site.register(Service)
admin.site.register(OurVision)
admin.site.register(Focus)
admin.site.register(OurClientSection)
admin.site.register(OurClient)
admin.site.register(CompnayIfRight)
admin.site.register(Footer)
admin.site.register(SocialMedia)

