from rest_framework.views import APIView, Response
from rest_framework import status

from django.core.serializers import serialize
import json

from ..models import Session, Meet

from datetime import date


class Session_view(APIView):
    pass