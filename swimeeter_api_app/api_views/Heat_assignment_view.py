from rest_framework.views import APIView, Response
from rest_framework import status

from django.core.serializers import serialize
import json

from ..models import Heat, HeatLaneAssignment

class Heat_assignment_view(APIView):
    def get(self, request):
        specific_to = request.query_params.get("specific_to")

        # get all heat-lane assignments for a specific...
        match specific_to:
            case "meet_event_heat":
                heat_id = request.query_params.get("heat_id")
                # ? no heat id passed
                if heat_id is None:
                    return Response(
                        {"get_success": False, "reason": "no heat id passed"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                heat_of_id = Heat.objects.get(id=heat_id)
                # ? no heat with the given id exists
                if heat_of_id is None:
                    return Response(
                        {
                            "get_success": False,
                            "reason": "no heat with the given id exists",
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                assignments_of_meet_event_heat = HeatLaneAssignment.objects.filter(
                    heat_id=heat_id
                )
                assignments_of_meet_event_heat_JSON = json.loads(
                    serialize(
                        "json",
                        [assignments_of_meet_event_heat],
                        fields=[
                            "lane",
                            "entry",
                            "heat",
                        ],
                    )
                )[0]
                return Response(
                    {
                        "get_success": True,
                        "assignment": assignments_of_meet_event_heat_JSON,
                    }
                )

            # ? invalid 'specific_to' specification
            case _:
                return Response(
                    {
                        "get_success": False,
                        "reason": "invalid 'specific_to' specification",
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )