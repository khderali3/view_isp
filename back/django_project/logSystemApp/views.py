from django.shortcuts import render

# Create your views here.

from django_project.custom_app_utils import MyCustomPagination, IsStaffOrSuperUser




from rest_framework.views import APIView, Response, status
from logSystemApp.serializers_module.serializers import LogSerializer
from .models import Log


class LogView(APIView):

    permission_classes = [IsStaffOrSuperUser]



    def get(self, request):

        if not request.user.is_superuser and not request.user.has_perm('usersAuthApp.logs_view'):
            return Response({"detail": "Permission denied for this operation."}, status=status.HTTP_403_FORBIDDEN)




        user_id_query = request.query_params.get('userId', None)
        if user_id_query:
            list_obj = Log.objects.filter(user=user_id_query)
        else:
            list_obj =  Log.objects.all()
        paginator = MyCustomPagination()
        page = paginator.paginate_queryset(list_obj, request)
        serializer = LogSerializer(page, many=True)
        return paginator.get_paginated_response(serializer.data) 
        

    def delete(self, request):

        if not request.user.is_superuser and not request.user.has_perm('usersAuthApp.logs_delete'):
            return Response({"detail": "Permission denied for this operation."}, status=status.HTTP_403_FORBIDDEN)


 


        try:
            ids = request.data.get('ids', [])
            if not isinstance(ids, list) or not all(isinstance(i, int) for i in ids):
                return Response({"detail": "Invalid 'ids' format. Must be a list of integers."}, status=status.HTTP_400_BAD_REQUEST)

            deleted_count, _ = Log.objects.filter(id__in=ids).delete()
            return Response({"deleted_count": deleted_count}, status=status.HTTP_202_ACCEPTED)

        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)




class LogViewDeleteAll(APIView):
        
    permission_classes = [IsStaffOrSuperUser]



    def delete(self, request):

        if not request.user.is_superuser and not request.user.has_perm('usersAuthApp.logs_delete'):
            return Response({"detail": "Permission denied for this operation."}, status=status.HTTP_403_FORBIDDEN)



        try:
            deleted_count, _ = Log.objects.all().delete()
            return Response({"deleted_count": deleted_count}, status=status.HTTP_202_ACCEPTED)

        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

