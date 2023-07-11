from rest_framework.views import APIView, Response
from rest_framework import status

from django.core.serializers import serialize
import json

from ..models import Event, Swimmer, Entry

class Entry_view(APIView):
    def get(self, request):
        specific_to = request.query_params.get("specific_to")

        # set record range
        upper_bound = int(request.query_params.get("upper_bound"))
        lower_bound = int(request.query_params.get("lower_bound"))

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
                return Response({"get_success": True, "data": entry_of_id_JSON})

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

                entries_of_meet_event = Entry.objects.filter(event_id=event_id)[lower_bound:upper_bound]
                entries_of_meet_event_JSON = json.loads(
                    serialize(
                        "json",
                        entries_of_meet_event,
                        fields=["seed_time", "swimmer", "event"],
                    )
                )
                return Response(
                    {"get_success": True, "data": entries_of_meet_event_JSON}
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

                entries_of_meet_swimmer = Entry.objects.filter(swimmer_id=swimmer_id)[lower_bound:upper_bound]
                entries_of_meet_swimmer_JSON = json.loads(
                    serialize(
                        "json",
                        entries_of_meet_swimmer,
                        fields=["seed_time", "swimmer", "event"],
                    )
                )
                return Response(
                    {"get_success": True, "data": entries_of_meet_swimmer_JSON}
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
        return Response({"post_success": True, "data": new_entry_JSON})

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
        return Response({"put_success": True, "data": edited_entry_JSON})

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