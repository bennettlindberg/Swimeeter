from rest_framework.views import APIView, Response
from rest_framework import status

from django.core.serializers import serialize
import json

# TODO: implement generating a heat sheet
class Heat_sheet_view(APIView):
    def get(self, request):
        return Response({"get_success": False, "reason": "feature not yet implemented"})