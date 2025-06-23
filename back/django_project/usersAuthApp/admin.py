from django.contrib import admin
from usersAuthApp.models import UserAccount, Profile
# Register your models here.
from django.contrib.auth.admin import UserAdmin


admin.site.register(Profile)



class EmployeeAdmin(UserAdmin):
#    ordering = ('email',)
#    list_display = ['email']
    list_display = ("email", "first_name", "last_name", "is_staff", 'is_ticket_priority_support')
    search_fields = ("email", "first_name", "last_name")
    list_filter = ('is_staff', 'is_superuser')
    filter_horizontal = ('departments',)  # Enable filtering for ManyToManyField
    ordering = ("email",)
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": (
                    "email",
                    "first_name",
                    "last_name",
                    "password1",
                    "password2",
                ),
            },
        ),
    )
    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ("Personal info", {"fields": ("first_name", "last_name")}),
        (
            "Permissions",
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                    "is_ticket_priority_support",
                    "departments",


                ),
            },
        ),
        ("Important dates", {"fields": ("last_login",)}),
    )


admin.site.register( UserAccount , EmployeeAdmin)



from django.contrib.auth.models import Permission

class PermissionAdmin(admin.ModelAdmin):
    list_display = ('get_model_name', 'codename', 'name')

    def get_model_name(self, obj):
        return obj.content_type.model
    get_model_name.short_description = 'Model'

    search_fields = ('codename', 'name')
    list_filter = ('content_type',)

admin.site.register(Permission, PermissionAdmin)