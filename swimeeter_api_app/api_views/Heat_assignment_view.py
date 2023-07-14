from rest_framework.views import APIView, Response
from rest_framework import status

from django.core.serializers import serialize
import json

from ..models import Heat, HeatLaneAssignment, Entry


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

                try:
                    heat_of_id = Heat.objects.get(id=heat_id)
                except:
                    # ? no heat with the given id exists
                    return Response(
                        {
                            "get_success": False,
                            "reason": "no heat with the given id exists",
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                # * get assignments JSON
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

                # * get FK heat JSON
                assignments_of_meet_event_heat__heat_JSON = json.loads(
                    serialize(
                        "json",
                        [heat_of_id],
                        fields=[
                            "order_in_event",
                            "event",
                        ],
                    )
                )[0]
                for assignment_JSON in assignments_of_meet_event_heat_JSON:
                    assignment_JSON["fields"][
                        "heat"
                    ] = assignments_of_meet_event_heat__heat_JSON

                # * get FK entries JSON
                for assignment_JSON in assignments_of_meet_event_heat_JSON:
                    assignment_of_meet_event_heat__entry = Entry.objects.get(
                        id=assignment_JSON["fields"]["entry"]
                    )
                    assignment_of_meet_event_heat__entry_JSON = json.loads(
                        serialize(
                            "json",
                            [assignment_of_meet_event_heat__entry],
                            fields=["seed_time", "swimmer", "event"],
                        )
                    )[0]
                    assignment_JSON["fields"][
                        "entry"
                    ] = assignment_of_meet_event_heat__entry_JSON

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
