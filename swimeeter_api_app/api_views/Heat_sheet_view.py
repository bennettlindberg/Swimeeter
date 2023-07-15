from rest_framework.views import APIView, Response
from rest_framework import status

from django.core.serializers import serialize
import json

from ..models import Event, Swimmer, Entry, Meet
from swimeeter_auth_app.models import Host

# TODO: implement generating a heat sheet
class Heat_sheet_view(APIView):
    def get(self, request):
        return Response({"get_success": False, "reason": "feature not yet implemented"})