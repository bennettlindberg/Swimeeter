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

                try:
                    entry_of_id = Entry.objects.get(id=entry_id)
                except:
                    # ? no entry with the given id exists
                    return Response(
                        {
                            "get_success": False,
                            "reason": "no entry with the given id exists",
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                # * get entry JSON
                entry_of_id_JSON = json.loads(
                    serialize(
                        "json",
                        [entry_of_id],
                        fields=["seed_time", "swimmer", "event"],
                    )
                )[0]

                # * get FK swimmer JSON
                entry_of_id__swimmer = Swimmer.objects.get(id=entry_of_id.swimmer_id)
                entry_of_id__swimmer_JSON = json.loads(
                    serialize(
                        "json",
                        [entry_of_id__swimmer],
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
                entry_of_id_JSON["fields"]["swimmer"] = entry_of_id__swimmer_JSON

                # * get FK event JSON
                entry_of_id__event = Event.objects.get(id=entry_of_id.event_id)
                entry_of_id__event_JSON = json.loads(
                    serialize(
                        "json",
                        [entry_of_id__event],
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
                entry_of_id_JSON["fields"]["event"] = entry_of_id__event_JSON

                return Response({"get_success": True, "data": entry_of_id_JSON})

            case "meet_event":
                event_id = request.query_params.get("event_id")
                # ? no event id passed
                if event_id is None:
                    return Response(
                        {"get_success": False, "reason": "no event id passed"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                try:
                    event_of_id = Event.objects.get(id=event_id)
                except:
                    # ? no event with the given id exists
                    return Response(
                        {
                            "post_success": False,
                            "reason": "no event with the given id exists",
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                # * get entries JSON
                entries_of_meet_event = Entry.objects.filter(event_id=event_id)[
                    lower_bound:upper_bound
                ]
                entries_of_meet_event_JSON = json.loads(
                    serialize(
                        "json",
                        entries_of_meet_event,
                        fields=["seed_time", "swimmer", "event"],
                    )
                )

                # * get FK event JSON
                entries_of_meet_event__event_JSON = json.loads(
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
                for entry_JSON in entries_of_meet_event_JSON:
                    entry_JSON["fields"]["event"] = entries_of_meet_event__event_JSON

                # * get FK swimmers JSON
                for entry_JSON in entries_of_meet_event_JSON:
                    entry_of_meet_event__swimmer = Swimmer.objects.get(id=entry_JSON["fields"]["swimmer"])
                    entry_of_meet_event__swimmer_JSON = json.loads(
                        serialize(
                            "json",
                            [entry_of_meet_event__swimmer],
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
                    entry_JSON["fields"]["swimmer"] = entry_of_meet_event__swimmer_JSON

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

                try:
                    swimmer_of_id = Swimmer.objects.get(id=swimmer_id)
                except:
                    # ? no swimmer with the given id exists
                    return Response(
                        {
                            "post_success": False,
                            "reason": "no swimmer with the given id exists",
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                # * get entries JSON
                entries_of_meet_swimmer = Entry.objects.filter(swimmer_id=swimmer_id)[
                    lower_bound:upper_bound
                ]
                entries_of_meet_swimmer_JSON = json.loads(
                    serialize(
                        "json",
                        entries_of_meet_swimmer,
                        fields=["seed_time", "swimmer", "event"],
                    )
                )

                # * get FK swimmer JSON
                entries_of_meet_swimmer__swimmer_JSON = json.loads(
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
                for entry_JSON in entries_of_meet_swimmer_JSON:
                    entry_JSON["fields"]["swimmer"] = entries_of_meet_swimmer__swimmer_JSON

                # * get FK entries JSON
                for entry_JSON in entries_of_meet_swimmer_JSON:
                    entries_of_meet_swimmer__event = Event.objects.get(id=entry_JSON["fields"]["event"])
                    entries_of_meet_swimmer__event_JSON = json.loads(
                        serialize(
                            "json",
                            [entries_of_meet_swimmer__event],
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
                    entry_JSON["fields"]["event"] = entries_of_meet_swimmer__event_JSON

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

        try:
            swimmer_of_id = Swimmer.objects.get(id=swimmer_id)
        except:
            # ? no swimmer with the given id exists
            return Response(
                {
                    "post_success": False,
                    "reason": "no swimmer with the given id exists",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            event_of_id = Event.objects.get(id=event_id)
        except:
            # ? no event with the given id exists
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

        # ? not logged in to meet host account swimmer/event meet host account
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

        try:
            entry_of_id = Entry.objects.get(id=entry_id)
        except:
            # ? no entry with the given id exists
            return Response(
                {"put_success": False, "reason": "no entry with the given id exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        entry_swimmer_meet_host_id = entry_of_id.swimmer.meet.host_id
        # ? not logged in to meet host account swimmer/event meet host account
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

        try:
            entry_of_id = Entry.objects.get(id=entry_id)
        except:
            # ? no entry with the given id exists
            return Response(
                {
                    "delete_success": False,
                    "reason": "no entry with the given id exists",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        entry_swimmer_meet_host_id = entry_of_id.swimmer.meet.host_id
        # ? not logged in to meet host account swimmer/event meet host account
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
