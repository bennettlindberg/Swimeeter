from rest_framework.views import APIView, Response
from rest_framework import status
from django.core.exceptions import ValidationError

from django.core.serializers import serialize
import json

from django.contrib.auth import login, logout, authenticate

from .models import Host

class Log_in(APIView):
    def post(self, request):
        if request.user.is_authenticated:
            return Response({'log_in_success': False, 'reason': 'already logged in'}, status = status.HTTP_403_FORBIDDEN)

        user = authenticate(username=request.data['email'], password=request.data['password'])
        if user is not None and user.is_active:
            login(request, user)
            userJSON = json.loads(serialize("json", [user], fields = ['email', 'first_name', 'last_name']))[0]
            return Response({'log_in_success': True, 'user': userJSON})
        else:
            return Response({'log_in_success': False, 'reason': 'account does not exist'}, status = status.HTTP_403_FORBIDDEN)

class Sign_up(APIView):
    def post(self, request):
        if request.user.is_authenticated:
            return Response({'sign_up_success': False, 'reason': 'already logged in'}, status = status.HTTP_403_FORBIDDEN)

        user = authenticate(username=request.data['email'], password=request.data['password'])
        if user is not None and user.is_active:
            return Response({'sign_up_success': False, 'reason': 'account already exists'}, status = status.HTTP_403_FORBIDDEN)
        else:
            user = Host.objects.create_user(username=request.data['email'], 
                                            email=request.data['email'], 
                                            password=request.data['password'],
                                            first_name=request.data['first_name'],
                                            last_name=request.data['last_name'])
            
            try:
                user.full_clean()
            except ValidationError as v:
                user.delete()
                return Response({'sign_up_success': False, 'reason': '; '.join(v.messages)}, status = status.HTTP_400_BAD_REQUEST)

            login(request, user)
            userJSON = json.loads(serialize("json", [user], fields = ['email', 'first_name', 'last_name']))[0]
            return Response({'sign_up_success': True, 'user': userJSON})

class Log_out(APIView):
    def post(self, request):
        if request.user.is_authenticated:
            logout(request)
            return Response({'log_out_success': True})
        else:
            return Response({'log_out_success': False, 'reason': 'not logged in'}, status = status.HTTP_403_FORBIDDEN)

class Update_account(APIView):
    def put(self, request):
        if 'host_id' not in request.data:
            # ? no host id passed
            return Response({'put_success': False, 'reason': 'no host id passed'}, status = status.HTTP_400_BAD_REQUEST)

        # attempt updating the requested account, which must match the logged-in account
        if request.user.is_authenticated and request.user.id == request.data['host_id']:
            try:
                requested_host = Host.objects.get(id = request.data['host_id'])

                if 'first_name' in request.data:
                    requested_host.first_name = request.data['first_name']
                if 'last_name' in request.data:
                    requested_host.last_name = request.data['last_name']
                
                requested_host.full_clean()
                requested_host.save()
            except ValidationError as v:
                # ? cleaning input failed
                return Response({'put_success': False, 'reason': 'invalid update data passed'}, status = status.HTTP_400_BAD_REQUEST)
            except:
                # ? invalid update data passed
                return Response({'put_success': False, 'reason': 'invalid update data passed'}, status = status.HTTP_400_BAD_REQUEST)

            updated_host = Host.objects.get(id = request.data['host_id'])
            updated_host_JSON = json.loads(serialize("json", [updated_host], fields = ['email', 'first_name', 'last_name']))[0]
            return Response({'put_success': True, 'user': updated_host_JSON})
        
        # ? not logged into account requested to be edited
        else:
            return Response({'delete_success': False, 'reason': 'not logged into account requested to be edited'}, status = status.HTTP_403_FORBIDDEN)

class Delete_account(APIView):
    def delete(self, request):
        if 'host_id' not in request.data:
            # ? no host id passed
            return Response({'delete_success': False, 'reason': 'no host id passed'}, status = status.HTTP_400_BAD_REQUEST)

        # delete the requested account, which must match the logged-in account
        if request.user.is_authenticated and request.user.id == request.data['host_id']:
            Host.objects.get(id = request.user.id).delete()
            return Response({'delete_success': True})
        
        # ? not logged into account requested to be deleted
        else:
            return Response({'delete_success': False, 'reason': 'not logged into account requested to be deleted'}, status = status.HTTP_403_FORBIDDEN)

class Init_check(APIView):
    def get(self, request):
        if not request.user.is_authenticated:
            return Response({'get_success': False, 'reason': 'back end not logged in'})
        else:
            userJSON = json.loads(serialize("json", [request.user], fields = ['email', 'first_name', 'last_name']))[0]
            return Response({'get_success': True, 'user': userJSON})