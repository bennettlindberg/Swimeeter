from rest_framework.views import APIView, Response
from rest_framework import status

from django.core.serializers import serialize
import json

from .models import Event, Swimmer, Entry, Meet, Heat, HeatLaneAssignment
from swimeeter_auth_app.models import Host


class Event_view(APIView):
    def get(self, request):
        specific_to = request.query_params.get("specific_to")

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
                return Response({"get_success": True, "event": event_of_id_JSON})

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

                events_of_meet = Event.objects.filter(meet_id=meet_id)
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
                return Response({"get_success": True, "event": events_of_meet_JSON})

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
        return Response({"post_success": True, "event": new_event_JSON})

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
        return Response({"put_success": True, "event": edited_event_JSON})

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


class Swimmer_view(APIView):
    def get(self, request):
        specific_to = request.query_params.get("specific_to")

        # get all swimmers for a specific...
        match specific_to:
            case "id":
                swimmer_id = request.query_params.get("swimmer_id")
                # ? no swimmer id passed
                if swimmer_id is None:
                    return Response(
                        {"get_success": False, "reason": "no swimmer id passed"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                swimmer_of_id = Swimmer.objects.get(id=swimmer_id)
                # ? no swimmer with the given id exists
                if swimmer_of_id is None:
                    return Response(
                        {
                            "get_success": False,
                            "reason": "no swimmer with the given id exists",
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                swimmer_of_id_JSON = json.loads(
                    serialize(
                        "json",
                        [swimmer_of_id],
                        fields=[
                            "first_name",
                            "last_name",
                            "age",
                            "gender",
                            "team",
                            "meet",
                        ],
                    )
                )[0]
                return Response({"get_success": True, "swimmer": swimmer_of_id_JSON})

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

                swimmers_of_meet = Swimmer.objects.filter(meet_id=meet_id)
                swimmers_of_meet_JSON = json.loads(
                    serialize(
                        "json",
                        swimmers_of_meet,
                        fields=[
                            "first_name",
                            "last_name",
                            "age",
                            "gender",
                            "team",
                            "meet",
                        ],
                    )
                )
                return Response({"get_success": True, "swimmer": swimmers_of_meet_JSON})

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
            new_swimmer = Swimmer(
                first_name=request.data["first_name"],
                last_name=request.data["last_name"],
                age=request.data["age"],
                gender=request.data["gender"],
                team=request.data["team"],
                meet_id=meet_id,
            )
            new_swimmer.full_clean()
            new_swimmer.save()
        except:
            # ? invalid creation data passed
            return Response(
                {"post_success": False, "reason": "invalid creation data passed"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        new_swimmer_JSON = json.loads(
            serialize(
                "json",
                [new_swimmer],
                fields=[
                    "first_name",
                    "last_name",
                    "age",
                    "gender",
                    "team",
                    "meet",
                ],
            )
        )[0]
        return Response({"post_success": True, "swimmer": new_swimmer_JSON})

    def put(self, request):
        # ? not logged in
        if not request.user.is_authenticated:
            return Response(
                {"put_success": False, "reason": "not logged in"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        swimmer_id = request.query_params.get("swimmer_id")
        # ? no swimmer id passed
        if swimmer_id is None:
            return Response(
                {"put_success": False, "reason": "no swimmer id passed"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        swimmer_of_id = Swimmer.objects.get(id=swimmer_id)
        # ? no swimmer with the given id exists
        if swimmer_of_id is None:
            return Response(
                {"put_success": False, "reason": "no swimmer with the given id exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        swimmer_meet_host_id = swimmer_of_id.meet.host_id
        # ? not logged in to meet host accountj swimmer meet host account
        if request.user.id != swimmer_meet_host_id:
            return Response(
                {
                    "put_success": False,
                    "reason": "not logged in to meet host account",
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        try:
            edited_swimmer = Swimmer.objects.get(id=swimmer_id)

            if "first_name" in request.data:
                edited_swimmer.first_name = request.data["first_name"]
            if "last_name" in request.data:
                edited_swimmer.last_name = request.data["last_name"]
            if "age" in request.data:
                edited_swimmer.age = request.data["age"]
            if "gender" in request.data:
                edited_swimmer.gender = request.data["gender"]
            if "team" in request.data:
                edited_swimmer.team = request.data["team"]

            edited_swimmer.full_clean()
            edited_swimmer.save()
        except:
            # ? invalid creation data passed
            return Response(
                {"put_success": False, "reason": "invalid editing data passed"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        edited_swimmer_JSON = json.loads(
            serialize(
                "json",
                [edited_swimmer],
                fields=[
                    "first_name",
                    "last_name",
                    "age",
                    "gender",
                    "team",
                    "meet",
                ],
            )
        )[0]
        return Response({"put_success": True, "swimmer": edited_swimmer_JSON})

    def delete(self, request):
        # ? not logged in
        if not request.user.is_authenticated:
            return Response(
                {"delete_success": False, "reason": "not logged in"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        swimmer_id = request.query_params.get("swimmer_id")
        # ? no swimmer id passed
        if swimmer_id is None:
            return Response(
                {"delete_success": False, "reason": "no swimmer id passed"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        swimmer_of_id = Event.objects.get(id=swimmer_id)
        # ? no event with the given id exists
        if swimmer_of_id is None:
            return Response(
                {
                    "delete_success": False,
                    "reason": "no swimmer with the given id exists",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        meet_host_id = swimmer_of_id.meet.host_id
        # ? not logged in to meet host account
        if request.user.id != meet_host_id:
            return Response(
                {
                    "delete_success": False,
                    "reason": "not logged in to meet host account",
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        swimmer_of_id.delete()
        return Response({"delete_success": True})


class Entry_view(APIView):
    def get(self, request):
        specific_to = request.query_params.get("specific_to")

        # get all entries for a specific...
        match specific_to:
            case "id":
                entry_id = request.query_params.get("entry_id")
                # ? no entry id passed
                if entry_id is None:
                    return Response(
                        {"get_success": False, "reason": "no entry id passed"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                entry_of_id = Entry.objects.get(id=entry_id)
                # ? no entry with the given id exists
                if entry_of_id is None:
                    return Response(
                        {
                            "get_success": False,
                            "reason": "no entry with the given id exists",
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                entry_of_id_JSON = json.loads(
                    serialize(
                        "json",
                        [entry_of_id],
                        fields=["seed_time", "swimmer", "event"],
                    )
                )[0]
                return Response({"get_success": True, "entry": entry_of_id_JSON})

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
                            "post_success": False,
                            "reason": "no event with the given id exists",
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                entries_of_meet_event = Entry.objects.filter(event_id=event_id)
                entries_of_meet_event_JSON = json.loads(
                    serialize(
                        "json",
                        entries_of_meet_event,
                        fields=["seed_time", "swimmer", "event"],
                    )
                )
                return Response(
                    {"get_success": True, "entry": entries_of_meet_event_JSON}
                )

            case "meet_swimmer":
                swimmer_id = request.query_params.get("swimmer_id")
                # ? no swimmer id passed
                if swimmer_id is None:
                    return Response(
                        {"get_success": False, "reason": "no swimmer id passed"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                swimmer_of_id = Swimmer.objects.get(id=swimmer_id)
                # ? no swimmer with the given id exists
                if swimmer_of_id is None:
                    return Response(
                        {
                            "post_success": False,
                            "reason": "no swimmer with the given id exists",
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                entries_of_meet_swimmer = Entry.objects.filter(swimmer_id=swimmer_id)
                entries_of_meet_swimmer_JSON = json.loads(
                    serialize(
                        "json",
                        entries_of_meet_swimmer,
                        fields=["seed_time", "swimmer", "event"],
                    )
                )
                return Response(
                    {"get_success": True, "entry": entries_of_meet_swimmer_JSON}
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

    def post(self, request):
        # ? not logged in
        if not request.user.is_authenticated:
            return Response(
                {"post_success": False, "reason": "not logged in"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        swimmer_id = request.query_params.get("swimmer_id")
        # ? no swimmer id passed
        if swimmer_id is None:
            return Response(
                {"post_success": False, "reason": "no swimmer id passed"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        event_id = request.query_params.get("event_id")
        # ? no event id passed
        if event_id is None:
            return Response(
                {"post_success": False, "reason": "no event id passed"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        swimmer_of_id = Swimmer.objects.get(id=swimmer_id)
        # ? no swimmer with the given id exists
        if swimmer_of_id is None:
            return Response(
                {
                    "post_success": False,
                    "reason": "no swimmer with the given id exists",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        event_of_id = Event.objects.get(id=event_id)
        # ? no event with the given id exists
        if event_of_id is None:
            return Response(
                {"post_success": False, "reason": "no event with the given id exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        swimmer_meet_id = swimmer_of_id.meet_id
        event_meet_id = event_of_id.meet_id
        # ? swimmer and event meets do not match
        if swimmer_meet_id != event_meet_id:
            return Response(
                {
                    "post_success": False,
                    "reason": "swimmer and event meets do not match",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # ? not logged in to meet host accountj swimmer/event meet host account
        if request.user.id != swimmer_of_id.meet.host_id:
            return Response(
                {"post_success": False, "reason": "not logged in to meet host account"},
                status=status.HTTP_403_FORBIDDEN,
            )

        try:
            new_entry = Entry(
                seed_time=request.data["seed_time"],
                swimmer_id=swimmer_id,
                event_id=event_id,
            )
            new_entry.full_clean()
            new_entry.save()
        except:
            # ? invalid creation data passed
            return Response(
                {"post_success": False, "reason": "invalid creation data passed"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        new_entry_JSON = json.loads(
            serialize(
                "json",
                [new_entry],
                fields=[
                    "seed_time",
                    "swimmer",
                    "event",
                ],
            )
        )[0]
        return Response({"post_success": True, "entry": new_entry_JSON})

    def put(self, request):
        # ? not logged in
        if not request.user.is_authenticated:
            return Response(
                {"put_success": False, "reason": "not logged in"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        entry_id = request.query_params.get("entry_id")
        # ? no entry id passed
        if entry_id is None:
            return Response(
                {"put_success": False, "reason": "no entry id passed"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        entry_of_id = Entry.objects.get(id=entry_id)
        # ? no entry with the given id exists
        if entry_of_id is None:
            return Response(
                {"put_success": False, "reason": "no entry with the given id exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        entry_swimmer_meet_host_id = entry_of_id.swimmer.meet.host_id
        # ? not logged in to meet host accountj swimmer/event meet host account
        if request.user.id != entry_swimmer_meet_host_id:
            return Response(
                {
                    "put_success": False,
                    "reason": "not logged in to meet host account",
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        try:
            edited_entry = Entry.objects.get(id=entry_id)

            if "seed_time" in request.data:
                edited_entry.seed_time = request.data["seed_time"]

            edited_entry.full_clean()
            edited_entry.save()
        except:
            # ? invalid creation data passed
            return Response(
                {"put_success": False, "reason": "invalid editing data passed"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        edited_entry_JSON = json.loads(
            serialize(
                "json",
                [edited_entry],
                fields=[
                    "seed_time",
                    "swimmer",
                    "event",
                ],
            )
        )[0]
        return Response({"put_success": True, "entry": edited_entry_JSON})

    def delete(self, request):
        # ? not logged in
        if not request.user.is_authenticated:
            return Response(
                {"delete_success": False, "reason": "not logged in"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        entry_id = request.query_params.get("entry_id")
        # ? no entry id passed
        if entry_id is None:
            return Response(
                {"delete_success": False, "reason": "no entry id passed"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        entry_of_id = Entry.objects.get(id=entry_id)
        # ? no entry with the given id exists
        if entry_of_id is None:
            return Response(
                {
                    "delete_success": False,
                    "reason": "no entry with the given id exists",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        entry_swimmer_meet_host_id = entry_of_id.swimmer.meet.host_id
        # ? not logged in to meet host accountj swimmer/event meet host account
        if request.user.id != entry_swimmer_meet_host_id:
            return Response(
                {
                    "delete_success": False,
                    "reason": "not logged in to meet host account",
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        entry_of_id.delete()
        return Response({"delete_success": True})


class Meet_view(APIView):
    def get(self, request):
        specific_to = request.query_params.get("specific_to")

        # get all meets for a specific...
        match specific_to:
            case "id":
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
                            "get_success": False,
                            "reason": "no meet with the given id exists",
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                meet_of_id_JSON = json.loads(
                    serialize(
                        "json",
                        [meet_of_id],
                        fields=[
                            "name",
                            "lanes",
                            "measure_unit",
                            "host",
                        ],
                    )
                )[0]
                return Response({"get_success": True, "meet": meet_of_id_JSON})

            case "host":
                host_id = request.query_params.get("host_id")
                # ? no host id passed
                if host_id is None:
                    return Response(
                        {"get_success": False, "reason": "no host id passed"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                host_of_id = Host.objects.get(id=host_id)
                # ? no meet with the given id exists
                if host_of_id is None:
                    return Response(
                        {
                            "post_success": False,
                            "reason": "no host with the given id exists",
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                meets_of_host = Meet.objects.filter(host_id=host_id)
                meets_of_host_JSON = json.loads(
                    serialize(
                        "json",
                        meets_of_host,
                        fields=[
                            "name",
                            "lanes",
                            "measure_unit",
                            "host",
                        ],
                    )
                )
                return Response({"get_success": True, "meet": meets_of_host_JSON})

            case "all":
                meets_of_all = Meet.objects.all()
                meets_of_all_JSON = json.loads(
                    serialize(
                        "json",
                        meets_of_all,
                        fields=[
                            "name",
                            "lanes",
                            "measure_unit",
                            "host",
                        ],
                    )
                )
                return Response({"get_success": True, "meet": meets_of_all_JSON})

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

        try:
            new_meet = Meet(
                name=request.data["name"],
                lanes=request.data["lanes"],
                measure_unit=request.data["measure_unit"],
                host_id=request.user.id,
            )
            new_meet.full_clean()
            new_meet.save()
        except:
            # ? invalid creation data passed
            return Response(
                {"post_success": False, "reason": "invalid creation data passed"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        new_meet_JSON = json.loads(
            serialize(
                "json",
                [new_meet],
                fields=["name", "lanes", "measure_unit" "host"],
            )
        )[0]
        return Response({"post_success": True, "meet": new_meet_JSON})

    def put(self, request):
        # ? not logged in
        if not request.user.is_authenticated:
            return Response(
                {"put_success": False, "reason": "not logged in"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        meet_id = request.query_params.get("meet_id")
        # ? no meet id passed
        if meet_id is None:
            return Response(
                {"put_success": False, "reason": "no meet id passed"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        meet_of_id = Meet.objects.get(id=meet_id)
        # ? no meet with the given id exists
        if meet_of_id is None:
            return Response(
                {"put_success": False, "reason": "no meet with the given id exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        meet_host_id = meet_of_id.host_id
        # ? not logged in to meet host account
        if request.user.id != meet_host_id:
            return Response(
                {
                    "put_success": False,
                    "reason": "not logged in to meet host account",
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        try:
            edited_meet = Meet.objects.get(id=meet_id)

            if "name" in request.data:
                edited_meet.name = request.data["name"]
            if "lanes" in request.data:
                edited_meet.lanes = request.data["lanes"]
            if "measure_unit" in request.data:
                edited_meet.measure_unit = request.data["measure_unit"]

            edited_meet.full_clean()
            edited_meet.save()
        except:
            # ? invalid creation data passed
            return Response(
                {"put_success": False, "reason": "invalid editing data passed"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        edited_meet_JSON = json.loads(
            serialize(
                "json",
                [edited_meet],
                fields=[
                    "name",
                    "lanes",
                    "measure_unit",
                    "host",
                ],
            )
        )[0]
        return Response({"put_success": True, "meet": edited_meet_JSON})

    def delete(self, request):
        # ? not logged in
        if not request.user.is_authenticated:
            return Response(
                {"delete_success": False, "reason": "not logged in"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        meet_id = request.query_params.get("meet_id")
        # ? no meet id passed
        if meet_id is None:
            return Response(
                {"delete_success": False, "reason": "no meet id passed"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        meet_of_id = Meet.objects.get(id=meet_id)
        # ? no meet with the given id exists
        if meet_of_id is None:
            return Response(
                {"delete_success": False, "reason": "no meet with the given id exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        meet_host_id = meet_of_id.host_id
        # ? not logged in to meet host account
        if request.user.id != meet_host_id:
            return Response(
                {
                    "delete_success": False,
                    "reason": "not logged in to meet host account",
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        meet_of_id.delete()
        return Response({"delete_success": True})


class Heat_view(APIView):
    def get(self, request):
        specific_to = request.query_params.get("specific_to")

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

                heats_of_meet_event = Heat.objects.filter(event_id=event_id)
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
                return Response({"get_success": True, "heat": heats_of_meet_event_JSON})

            # ? invalid 'specific_to' specification
            case _:
                return Response(
                    {
                        "get_success": False,
                        "reason": "invalid 'specific_to' specification",
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )


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


# TODO: implement generating a heat sheet
class Heat_sheet_view(APIView):
    def get(self, request):
        return Response({"get_success": False, "reason": "feature not yet implemented"})
