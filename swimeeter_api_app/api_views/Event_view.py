from rest_framework.views import APIView, Response
from rest_framework import status

from django.core.serializers import serialize
import json

from ..models import Event, Meet

class Event_view(APIView):
    def get(self, request):
        specific_to = request.query_params.get("specific_to")

        # set record range
        upper_bound = int(request.query_params.get("upper_bound"))
        lower_bound = int(request.query_params.get("lower_bound"))

        # get all events for a specific...
        match specific_to:
            case "id":
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

                event_of_id_JSON = json.loads(
                    serialize(
                        "json",
                        [event_of_id],
                        fields=[
                            "stroke",
                            "distance",
                            "competing_gender",
                            "competing_max_age",
                            "competing_min_age",
                            "meet",
                        ],
                    )
                )[0]
                return Response({"get_success": True, "data": event_of_id_JSON})

            case "meet":
                meet_id = request.query_params.get("meet_id")
                # ? no meet id passed
                if meet_id is None:
                    return Response(
                        {"get_success": False, "reason": "no meet id passed"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                meet_of_id = Meet.objects.get(id=meet_id)
                # ? no meet with the given id exists
                if meet_of_id is None:
                    return Response(
                        {
                            "post_success": False,
                            "reason": "no meet with the given id exists",
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                events_of_meet = Event.objects.filter(meet_id=meet_id)[lower_bound:upper_bound]
                events_of_meet_JSON = json.loads(
                    serialize(
                        "json",
                        events_of_meet,
                        fields=[
                            "stroke",
                            "distance",
                            "competing_gender",
                            "competing_max_age",
                            "competing_min_age",
                            "meet",
                        ],
                    )
                )
                return Response({"get_success": True, "data": events_of_meet_JSON})

            # ? invalid 'specific_to' specification
            case _:
                return Response(
                    {
                        "get_success": False,
                        "reason": "invalid 'specific_to' specification",
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

    def post(self, request):
        # ? not logged in
        if not request.user.is_authenticated:
            return Response(
                {"post_success": False, "reason": "not logged in"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        meet_id = request.query_params.get("meet_id")
        # ? no meet id passed
        if meet_id is None:
            return Response(
                {"post_success": False, "reason": "no meet id passed"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        meet_of_id = Meet.objects.get(id=meet_id)
        # ? no meet with the given id exists
        if meet_of_id is None:
            return Response(
                {"post_success": False, "reason": "no meet with the given id exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        meet_host_id = meet_of_id.host_id
        # ? not logged in to meet host account
        if request.user.id != meet_host_id:
            return Response(
                {"post_success": False, "reason": "not logged in to meet host account"},
                status=status.HTTP_403_FORBIDDEN,
            )

        try:
            new_event = Event(
                stroke=request.data["stroke"],
                distance=request.data["distance"],
                competing_gender=request.data["competing_gender"],
                competing_max_age=request.data["competing_max_age"],
                competing_min_age=request.data["competing_min_age"],
                meet_id=meet_id,
            )
            new_event.full_clean()
            new_event.save()
        except:
            # ? invalid creation data passed
            return Response(
                {"post_success": False, "reason": "invalid creation data passed"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        new_event_JSON = json.loads(
            serialize(
                "json",
                [new_event],
                fields=[
                    "stroke",
                    "distance",
                    "competing_gender",
                    "competing_max_age",
                    "competing_min_age",
                    "meet",
                ],
            )
        )[0]
        return Response({"post_success": True, "data": new_event_JSON})

    def put(self, request):
        # ? not logged in
        if not request.user.is_authenticated:
            return Response(
                {"put_success": False, "reason": "not logged in"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        event_id = request.query_params.get("event_id")
        # ? no event id passed
        if event_id is None:
            return Response(
                {"put_success": False, "reason": "no event id passed"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        event_of_id = Event.objects.get(id=event_id)
        # ? no event with the given id exists
        if event_of_id is None:
            return Response(
                {"put_success": False, "reason": "no event with the given id exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        event_meet_host_id = event_of_id.meet.host_id
        # ? not logged in to meet host accountj event meet host account
        if request.user.id != event_meet_host_id:
            return Response(
                {
                    "put_success": False,
                    "reason": "not logged in to meet host accountj event meet host account",
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        try:
            edited_event = Event.objects.get(id=event_id)

            if "stroke" in request.data:
                edited_event.stroke = request.data["stroke"]
            if "distance" in request.data:
                edited_event.distance = request.data["distance"]
            if "competing_gender" in request.data:
                edited_event.competing_gender = request.data["competing_gender"]
            if "competing_max_age" in request.data:
                edited_event.competing_max_age = request.data["competing_max_age"]
            if "competing_min_age" in request.data:
                edited_event.competing_min_age = request.data["competing_min_age"]

            edited_event.full_clean()
            edited_event.save()
        except:
            # ? invalid creation data passed
            return Response(
                {"put_success": False, "reason": "invalid editing data passed"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        edited_event_JSON = json.loads(
            serialize(
                "json",
                [edited_event],
                fields=[
                    "stroke",
                    "distance",
                    "competing_gender",
                    "competing_max_age",
                    "competing_min_age",
                    "meet",
                ],
            )
        )[0]
        return Response({"put_success": True, "data": edited_event_JSON})

    def delete(self, request):
        # ? not logged in
        if not request.user.is_authenticated:
            return Response(
                {"delete_success": False, "reason": "not logged in"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        event_id = request.query_params.get("event_id")
        # ? no event id passed
        if event_id is None:
            return Response(
                {"delete_success": False, "reason": "no event id passed"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        event_of_id = Event.objects.get(id=event_id)
        # ? no event with the given id exists
        if event_of_id is None:
            return Response(
                {
                    "delete_success": False,
                    "reason": "no event with the given id exists",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        meet_host_id = event_of_id.meet.host_id
        # ? not logged in to meet host account
        if request.user.id != meet_host_id:
            return Response(
                {
                    "delete_success": False,
                    "reason": "not logged in to meet host account",
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        event_of_id.delete()
        return Response({"delete_success": True})