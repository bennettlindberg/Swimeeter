from rest_framework.views import APIView, Response
from rest_framework import status

from django.core.serializers import serialize
import json

from swimeeter_auth_app.models import Host

class Host_view(APIView):
    def get(self, request):
        specific_to = request.query_params.get("specific_to")

        # get all hosts for a specific...
        match specific_to:
            case "id":
                host_id = request.query_params.get("host_id")
                # ? no host id passed
                if host_id is None:
                    return Response(
                        {"get_success": False, "reason": "no host id passed"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                try:
                    host_of_id = Host.objects.get(id=host_id)
                except:
                    # ? no meet with the given id exists
                    return Response(
                        {
                            "get_success": False,
                            "reason": "no host with the given id exists",
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                host_of_id_JSON = json.loads(
                    serialize(
                        "json",
                        [host_of_id],
                        fields=[
                            "first_name",
                            "last_name",
                            "email",
                        ],
                    )
                )[0]
                return Response({"get_success": True, "data": host_of_id_JSON})