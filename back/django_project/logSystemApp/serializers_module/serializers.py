



from rest_framework import serializers
from logSystemApp.models import Log




def get_user_data(obj, user_attr_name, request=None):
    user = getattr(obj, user_attr_name, None)
    if user:
        return {
            "is_staff": user.is_staff or user.is_superuser ,
            "full_name": f"{user.first_name} {user.last_name}",
            "id": user.id,
            "email": user.email ,

        }
    return None




class LogSerializer(serializers.ModelSerializer):

    user = serializers.SerializerMethodField()

    class Meta:
        model = Log
        fields = "__all__"
        read_only_fileds = ['id']

  

    def get_user(self, obj):
            request = self.context.get("request")  # Get request from serializer context
            return get_user_data(obj, "user", request)  # Pass request explicitly

