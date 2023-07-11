from rest_framework.views import APIView, Response
from rest_framework import status

from django.core.serializers import serialize
import json

from ..models import Event, Heat

class Heat_view(APIView):
    def get(self, request):
        specific_to = request.query_params.get("specific_to")

        # set record range
        upper_bound = int(request.query_params.get("upper_bound"))
        lower_bound = int(request.query_params.get("lower_bound"))

        # get all heats for a specific...
        match specific_to:
            case "meet_event":
                event_id = request.query_params.get("event_id")
                # ? no event id passed
                if event_id is None:
                    return Response(
                        {"get_success": False, "reason": "no event id passed"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                event_of_id = Event.objects.get(id=event_id)
                # ? no event with the given id exists
                if event_of_id is None:
                    return Response(
                        {
                            "get_success": False,
                            "reason": "no event with the given id exists",
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                heats_of_meet_event = Heat.objects.filter(event_id=event_id)[lower_bound:upper_bound]
                heats_of_meet_event_JSON = json.loads(
                    serialize(
                        "json",
                        [heats_of_meet_event],
                        fields=[
                            "order_in_event",
                            "event",
                        ],
                    )
                )[0]
                return Response({"get_success": True, "data": heats_of_meet_event_JSON})

            # ? invalid 'specific_to' specification
            case _:
                return Response(
                    {
                        "get_success": False,
                        "reason": "invalid 'specific_to' specification",
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )