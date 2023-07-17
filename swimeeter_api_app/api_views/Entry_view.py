from rest_framework.views import APIView, Response
from rest_framework import status

from django.core.serializers import serialize
import json

from ..models import Event, Swimmer, Individual_entry, Relay_entry


class Entry_view(APIView):
    def get(self, request):
        specific_to = request.query_params.get("specific_to")

        # set record range
        upper_bound_str = request.query_params.get("upper_bound")
        if upper_bound_str is not None:
            upper_bound = int(upper_bound_str)

        lower_bound_str = request.query_params.get("lower_bound")
        if lower_bound_str is not None:
            lower_bound = int(lower_bound_str)

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

                entry_type = request.query_params.get("entry_type")
                # ? no entry type passed
                if entry_type is None:
                    return Response(
                        {"get_success": False, "reason": "no entry type passed"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                # get entry of type...
                match entry_type:
                    case "individual":
                        try:
                            entry_of_id = Individual_entry.objects.get(id=entry_id)
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
                                fields=[
                                    "seed_time",
                                    "heat_number",
                                    "lane_number",
                                    "swimmer",
                                    "event",
                                ],
                            )
                        )[0]

                        # * get FK swimmer JSON
                        entry_of_id__swimmer = Swimmer.objects.get(
                            id=entry_of_id.swimmer_id
                        )
                        entry_of_id__swimmer_JSON = json.loads(
                            serialize(
                                "json",
                                [entry_of_id__swimmer],
                                fields=[
                                    "first_name",
                                    "last_name",
                                    "prefix",
                                    "suffix",
                                    "middle_initials",
                                    "age",
                                    "gender",
                                    "team_name",
                                    "team_acronym",
                                    "meet",
                                ],
                            )
                        )[0]
                        entry_of_id_JSON["fields"][
                            "swimmer"
                        ] = entry_of_id__swimmer_JSON

                        # * get FK event JSON
                        entry_of_id__event = Event.objects.get(id=entry_of_id.event_id)
                        entry_of_id__event_JSON = json.loads(
                            serialize(
                                "json",
                                [entry_of_id__event],
                                fields=[
                                    "stroke",
                                    "distance",
                                    "is_relay",
                                    "swimmers_per_entry",
                                    "competing_gender",
                                    "competing_max_age",
                                    "competing_min_age",
                                    "order_in_session",
                                    "total_heats",
                                    "session",
                                ],
                            )
                        )[0]
                        entry_of_id_JSON["fields"]["event"] = entry_of_id__event_JSON

                        return Response({"get_success": True, "data": entry_of_id_JSON})

                    case "relay":
                        try:
                            entry_of_id = Relay_entry.objects.get(id=entry_id)
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
                                fields=[
                                    "seed_time",
                                    "heat_number",
                                    "lane_number",
                                    "swimmers",
                                    "event",
                                ],
                            )
                        )[0]

                        # * get FK swimmers JSON
                        entry_of_id__swimmers = entry_of_id.swimmers.all()
                        entry_of_id__swimmers_JSON = json.loads(
                            serialize(
                                "json",
                                entry_of_id__swimmers,
                                fields=[
                                    "first_name",
                                    "last_name",
                                    "prefix",
                                    "suffix",
                                    "middle_initials",
                                    "age",
                                    "gender",
                                    "team_name",
                                    "team_acronym",
                                    "meet",
                                ],
                            )
                        )
                        entry_of_id_JSON["fields"][
                            "swimmers"
                        ] = entry_of_id__swimmers_JSON

                        # * get FK event JSON
                        entry_of_id__event = Event.objects.get(id=entry_of_id.event_id)
                        entry_of_id__event_JSON = json.loads(
                            serialize(
                                "json",
                                [entry_of_id__event],
                                fields=[
                                    "stroke",
                                    "distance",
                                    "is_relay",
                                    "swimmers_per_entry",
                                    "competing_gender",
                                    "competing_max_age",
                                    "competing_min_age",
                                    "order_in_session",
                                    "total_heats",
                                    "session",
                                ],
                            )
                        )[0]
                        entry_of_id_JSON["fields"]["event"] = entry_of_id__event_JSON

                        return Response({"get_success": True, "data": entry_of_id_JSON})

                    # ? invalid 'entry_type' specification
                    case _:
                        return Response(
                            {
                                "get_success": False,
                                "reason": "invalid 'entry_type' specification",
                            },
                            status=status.HTTP_400_BAD_REQUEST,
                        )

            case "meet_session_event":
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

                if event_of_id.is_relay:  # relay event
                    # * get entries JSON
                    entries_of_meet_session_event = Relay_entry.objects.filter(
                        event_id=event_id
                    ).order_by("seed_time")[lower_bound:upper_bound]
                    entries_of_meet_session_event_JSON = json.loads(
                        serialize(
                            "json",
                            entries_of_meet_session_event,
                            fields=[
                                "seed_time",
                                "heat_number",
                                "lane_number",
                                "swimmers",
                                "event",
                            ],
                        )
                    )

                    # * get FK event JSON
                    entries_of_meet_session_event__event_JSON = json.loads(
                        serialize(
                            "json",
                            [event_of_id],
                            fields=[
                                "stroke",
                                "distance",
                                "is_relay",
                                "swimmers_per_entry",
                                "competing_gender",
                                "competing_max_age",
                                "competing_min_age",
                                "order_in_session",
                                "total_heats",
                                "session",
                            ],
                        )
                    )[0]
                    for entry_JSON in entries_of_meet_session_event_JSON:
                        entry_JSON["fields"][
                            "event"
                        ] = entries_of_meet_session_event__event_JSON

                    # * get FK swimmers JSON
                    for entry_JSON in entries_of_meet_session_event_JSON:
                        entry_of_meet_session_event__swimmers = Swimmer.objects.get(
                            id__in=entry_JSON["fields"]["swimmers"]
                        )
                        entry_of_meet_session_event__swimmers_JSON = json.loads(
                            serialize(
                                "json",
                                entry_of_meet_session_event__swimmers,
                                fields=[
                                    "first_name",
                                    "last_name",
                                    "prefix",
                                    "suffix",
                                    "middle_initials",
                                    "age",
                                    "gender",
                                    "team_name",
                                    "team_acronym",
                                    "meet",
                                ],
                            )
                        )
                        entry_JSON["fields"][
                            "swimmers"
                        ] = entry_of_meet_session_event__swimmers_JSON

                    return Response(
                        {
                            "get_success": True,
                            "data": entries_of_meet_session_event_JSON,
                        }
                    )

                else:  # individual event
                    # * get entries JSON
                    entries_of_meet_session_event = Individual_entry.objects.filter(
                        event_id=event_id
                    ).order_by("seed_time")[lower_bound:upper_bound]
                    entries_of_meet_session_event_JSON = json.loads(
                        serialize(
                            "json",
                            entries_of_meet_session_event,
                            fields=[
                                "seed_time",
                                "heat_number",
                                "lane_number",
                                "swimmer",
                                "event",
                            ],
                        )
                    )

                    # * get FK event JSON
                    entries_of_meet_session_event__event_JSON = json.loads(
                        serialize(
                            "json",
                            [event_of_id],
                            fields=[
                                "stroke",
                                "distance",
                                "is_relay",
                                "swimmers_per_entry",
                                "competing_gender",
                                "competing_max_age",
                                "competing_min_age",
                                "order_in_session",
                                "total_heats",
                                "session",
                            ],
                        )
                    )[0]
                    for entry_JSON in entries_of_meet_session_event_JSON:
                        entry_JSON["fields"][
                            "event"
                        ] = entries_of_meet_session_event__event_JSON

                    # * get FK swimmers JSON
                    for entry_JSON in entries_of_meet_session_event_JSON:
                        entry_of_meet_session_event__swimmer = Swimmer.objects.get(
                            id=entry_JSON["fields"]["swimmer"]
                        )
                        entry_of_meet_session_event__swimmer_JSON = json.loads(
                            serialize(
                                "json",
                                [entry_of_meet_session_event__swimmer],
                                fields=[
                                    "first_name",
                                    "last_name",
                                    "prefix",
                                    "suffix",
                                    "middle_initials",
                                    "age",
                                    "gender",
                                    "team_name",
                                    "team_acronym",
                                    "meet",
                                ],
                            )
                        )[0]
                        entry_JSON["fields"][
                            "swimmer"
                        ] = entry_of_meet_session_event__swimmer_JSON

                    return Response(
                        {
                            "get_success": True,
                            "data": entries_of_meet_session_event_JSON,
                        }
                    )

            case "meet_session_event_heat":
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

                heat_number = request.query_params.get("heat_number")
                # ? no heat number passed
                if heat_number is None:
                    return Response(
                        {"get_success": False, "reason": "no heat number passed"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                # ? no heat with the given number exists
                if event_of_id.total_heats is None or heat_number > event_of_id.total_heats:
                    return Response(
                        {
                            "get_success": False,
                            "reason": "no heat with the given number exists",
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                if event_of_id.is_relay:  # relay event
                    # * get entries JSON
                    entries_of_meet_session_event_heat = Relay_entry.objects.filter(
                        event_id=event_id, heat_number=heat_number
                    ).order_by("lane_number")
                    entries_of_meet_session_event_heat_JSON = json.loads(
                        serialize(
                            "json",
                            entries_of_meet_session_event_heat,
                            fields=[
                                "seed_time",
                                "heat_number",
                                "lane_number",
                                "swimmers",
                                "event",
                            ],
                        )
                    )

                    # * get FK event JSON
                    entries_of_meet_session_event_heat__event_JSON = json.loads(
                        serialize(
                            "json",
                            [event_of_id],
                            fields=[
                                "stroke",
                                "distance",
                                "is_relay",
                                "swimmers_per_entry",
                                "competing_gender",
                                "competing_max_age",
                                "competing_min_age",
                                "order_in_session",
                                "total_heats",
                                "session",
                            ],
                        )
                    )[0]
                    for entry_JSON in entries_of_meet_session_event_heat_JSON:
                        entry_JSON["fields"][
                            "event"
                        ] = entries_of_meet_session_event_heat__event_JSON

                    # * get FK swimmers JSON
                    for entry_JSON in entries_of_meet_session_event_heat_JSON:
                        entry_of_meet_session_event_heat__swimmers = Swimmer.objects.get(
                            id__in=entry_JSON["fields"]["swimmers"]
                        )
                        entry_of_meet_session_event_heat__swimmers_JSON = json.loads(
                            serialize(
                                "json",
                                entry_of_meet_session_event_heat__swimmers,
                                fields=[
                                    "first_name",
                                    "last_name",
                                    "prefix",
                                    "suffix",
                                    "middle_initials",
                                    "age",
                                    "gender",
                                    "team_name",
                                    "team_acronym",
                                    "meet",
                                ],
                            )
                        )
                        entry_JSON["fields"][
                            "swimmers"
                        ] = entry_of_meet_session_event_heat__swimmers_JSON

                    return Response(
                        {
                            "get_success": True,
                            "data": entries_of_meet_session_event_heat_JSON,
                        }
                    )

                else:  # individual event
                    # * get entries JSON
                    entries_of_meet_session_event_heat = Individual_entry.objects.filter(
                        event_id=event_id, heat_number=heat_number
                    ).order_by("seed_time")
                    entries_of_meet_session_event_heat_JSON = json.loads(
                        serialize(
                            "json",
                            entries_of_meet_session_event_heat,
                            fields=[
                                "seed_time",
                                "heat_number",
                                "lane_number",
                                "swimmer",
                                "event",
                            ],
                        )
                    )

                    # * get FK event JSON
                    entries_of_meet_session_event_heat__event_JSON = json.loads(
                        serialize(
                            "json",
                            [event_of_id],
                            fields=[
                                "stroke",
                                "distance",
                                "is_relay",
                                "swimmers_per_entry",
                                "competing_gender",
                                "competing_max_age",
                                "competing_min_age",
                                "order_in_session",
                                "total_heats",
                                "session",
                            ],
                        )
                    )[0]
                    for entry_JSON in entries_of_meet_session_event_heat_JSON:
                        entry_JSON["fields"][
                            "event"
                        ] = entries_of_meet_session_event_heat__event_JSON

                    # * get FK swimmers JSON
                    for entry_JSON in entries_of_meet_session_event_heat_JSON:
                        entry_of_meet_session_event_heat__swimmer = Swimmer.objects.get(
                            id=entry_JSON["fields"]["swimmer"]
                        )
                        entry_of_meet_session_event_heat__swimmer_JSON = json.loads(
                            serialize(
                                "json",
                                [entry_of_meet_session_event_heat__swimmer],
                                fields=[
                                    "first_name",
                                    "last_name",
                                    "prefix",
                                    "suffix",
                                    "middle_initials",
                                    "age",
                                    "gender",
                                    "team_name",
                                    "team_acronym",
                                    "meet",
                                ],
                            )
                        )[0]
                        entry_JSON["fields"][
                            "swimmer"
                        ] = entry_of_meet_session_event_heat__swimmer_JSON

                    return Response(
                        {
                            "get_success": True,
                            "data": entries_of_meet_session_event_heat_JSON,
                        }
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
                entries_of_meet_swimmer = swimmer_of_id.individual_entries.all()
                entries_of_meet_swimmer.union(swimmer_of_id.relay_entries.all())

                entries_of_meet_swimmer.order_by("event__session__order_in_meet", "event__order_in_session")[lower_bound:upper_bound]
                
                entries_of_meet_swimmer_JSON = []
                for entry in entries_of_meet_swimmer:
                    if isinstance(entry, Individual_entry):
                        entry_JSON = json.loads(
                            serialize(
                                "json",
                                [entry],
                                fields=[
                                    "seed_time",
                                    "heat_number",
                                    "lane_number",
                                    "swimmer",
                                    "event",
                                ],
                            )
                        )[0]

                        entries_of_meet_swimmer_JSON.append(entry_JSON)
                    elif isinstance(entry, Relay_entry):
                        entry_JSON = json.loads(
                            serialize(
                                "json",
                                [entry],
                                fields=[
                                    "seed_time",
                                    "heat_number",
                                    "lane_number",
                                    "swimmers",
                                    "event",
                                ],
                            )
                        )[0]

                        entries_of_meet_swimmer_JSON.append(entry_JSON)
                    else:
                        # should never occur
                        return Response(
                            {
                                "get_success": False,
                                "reason": "internal server error",
                            },
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                        )

                # * get FK swimmer JSON
                entries_of_meet_swimmer__swimmer_JSON = json.loads(
                    serialize(
                        "json",
                        [swimmer_of_id],
                        fields=[
                            "first_name",
                            "last_name",
                            "prefix",
                            "suffix",
                            "middle_initials",
                            "age",
                            "gender",
                            "team_name",
                            "team_acronym",
                            "meet",
                        ],
                    )
                )[0]
                for entry_JSON in entries_of_meet_swimmer_JSON:
                    entry_JSON["fields"][
                        "swimmer"
                    ] = entries_of_meet_swimmer__swimmer_JSON

                # * get FK events JSON
                for entry_JSON in entries_of_meet_swimmer_JSON:
                    entries_of_meet_swimmer__event = Event.objects.get(
                        id=entry_JSON["fields"]["event"]
                    )
                    entries_of_meet_swimmer__event_JSON = json.loads(
                        serialize(
                            "json",
                            [entries_of_meet_swimmer__event],
                            fields=[
                                "stroke",
                                "distance",
                                "is_relay",
                                "swimmers_per_entry",
                                "competing_gender",
                                "competing_max_age",
                                "competing_min_age",
                                "order_in_session",
                                "total_heats",
                                "session",
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

        event_id = request.query_params.get("event_id")
        # ? no event id passed
        if event_id is None:
            return Response(
                {"post_success": False, "reason": "no event id passed"},
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

        # ? not logged into meet host account
        if request.user.id != event_of_id.meet.host_id:
            return Response(
                {"post_success": False, "reason": "not logged into meet host account"},
                status=status.HTTP_403_FORBIDDEN,
            )
        
        # ! RELAY EVENT
        if event_of_id.is_relay:
            swimmer_ids = request.query_params.get("swimmer_ids")
            # ? no swimmer ids passed
            if swimmer_ids is None:
                return Response(
                    {"post_success": False, "reason": "no swimmer ids passed"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            swimmers_of_ids = Swimmer.objects.filter(id__in=swimmer_ids)

            # ? incorrect number of swimmers assigned to entry
            if swimmers_of_ids.count() != event_of_id.swimmers_per_entry:
                return Response(
                    {"post_success": False, "reason": "incorrect number of swimmers assigned to entry"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            for entry_swimmer in swimmers_of_ids:
                swimmer_meet_id = entry_swimmer.meet_id
                event_session_meet_id = event_of_id.session.meet_id
                # ? swimmer and event meets do not match
                if swimmer_meet_id != event_session_meet_id:
                    return Response(
                        {
                            "post_success": False,
                            "reason": "swimmer and event meets do not match",
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )

            try:
                new_relay_entry = Relay_entry(
                    seed_time=request.data["seed_time"],
                    # heat_number => null,
                    # lane_number => null,
                    # swimmers => assigned post-creation,
                    event_id=event_id,
                )
                new_relay_entry.full_clean()
                new_relay_entry.save()
            except:
                # ? invalid creation data passed
                return Response(
                    {"post_success": False, "reason": "invalid creation data passed"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            
            try:
                for relay_swimmer_id in request.data["swimmer_ids"]:
                    new_relay_entry.swimmers.add(relay_swimmer_id)
            except:
                # ? invalid creation data passed
                return Response(
                    {"post_success": False, "reason": "invalid creation data passed"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            new_relay_entry_JSON = json.loads(
                serialize(
                    "json",
                    [new_relay_entry],
                    fields=["seed_time", "heat_number", "lane_number", "swimmers", "event"],
                )
            )[0]
            return Response({"post_success": True, "data": new_relay_entry_JSON})

        # ! INDIVIDUAL EVENT
        else:
            swimmer_id = request.query_params.get("swimmer_id")
            # ? no swimmer id passed
            if swimmer_id is None:
                return Response(
                    {"post_success": False, "reason": "no swimmer id passed"},
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

            swimmer_meet_id = swimmer_of_id.meet_id
            event_session_meet_id = event_of_id.session.meet_id
            # ? swimmer and event meets do not match
            if swimmer_meet_id != event_session_meet_id:
                return Response(
                    {
                        "post_success": False,
                        "reason": "swimmer and event meets do not match",
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )
            
            try:
                new_individual_entry = Individual_entry(
                    seed_time=request.data["seed_time"],
                    # heat_number => null,
                    # lane_number => null,
                    swimmer_id=swimmer_id,
                    event_id=event_id,
                )
                new_individual_entry.full_clean()
                new_individual_entry.save()
            except:
                # ? invalid creation data passed
                return Response(
                    {"post_success": False, "reason": "invalid creation data passed"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            new_individual_entry_JSON = json.loads(
                serialize(
                    "json",
                    [new_individual_entry],
                    fields=["seed_time", "heat_number", "lane_number", "swimmer", "event"],
                )
            )[0]
            return Response({"post_success": True, "data": new_individual_entry_JSON})
            
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
        
        entry_type = request.query_params.get("entry_type")
        # ? no entry type passed
        if entry_type is None:
            return Response(
                {"get_success": False, "reason": "no entry type passed"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        match entry_type:
            case "individual":
                try:
                    entry_of_id = Individual_entry.objects.get(id=entry_id)
                except:
                    # ? no entry with the given id exists
                    return Response(
                        {"put_success": False, "reason": "no entry with the given id exists"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                
                entry_swimmer_meet_host_id = entry_of_id.swimmer.meet.host_id
                # ? not logged into meet host account
                if request.user.id != entry_swimmer_meet_host_id:
                    return Response(
                        {
                            "put_success": False,
                            "reason": "not logged into meet host account",
                        },
                        status=status.HTTP_403_FORBIDDEN,
                    )
                
                try:
                    edited_entry = Individual_entry.objects.get(id=entry_id)

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
                        fields=["seed_time", "heat_number", "lane_number", "swimmer", "event"],
                    )
                )[0]
                return Response({"put_success": True, "data": edited_entry_JSON})

            case "relay":
                try:
                    entry_of_id = Relay_entry.objects.get(id=entry_id)
                except:
                    # ? no entry with the given id exists
                    return Response(
                        {"put_success": False, "reason": "no entry with the given id exists"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                
                entry_swimmer_meet_host_id = entry_of_id.swimmer.meet.host_id
                # ? not logged into meet host account
                if request.user.id != entry_swimmer_meet_host_id:
                    return Response(
                        {
                            "put_success": False,
                            "reason": "not logged into meet host account",
                        },
                        status=status.HTTP_403_FORBIDDEN,
                    )
                
                try:
                    edited_entry = Relay_entry.objects.get(id=entry_id)

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
                        fields=["seed_time", "heat_number", "lane_number", "swimmers", "event"],
                    )
                )[0]
                return Response({"put_success": True, "data": edited_entry_JSON})

            # ? invalid 'entry_type' specification
            case _:
                return Response(
                    {
                        "get_success": False,
                        "reason": "invalid 'entry_type' specification",
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

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
        
        entry_type = request.query_params.get("entry_type")
        # ? no entry type passed
        if entry_type is None:
            return Response(
                {"get_success": False, "reason": "no entry type passed"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            match entry_type:
                case "individual":
                    entry_of_id = Individual_entry.objects.get(id=entry_id)

                case "relay":
                    entry_of_id = Relay_entry.objects.get(id=entry_id)

                # ? invalid 'entry_type' specification
                case _:
                    return Response(
                        {
                            "get_success": False,
                            "reason": "invalid 'entry_type' specification",
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )
        except:
            # ? no entry with the given id exists
            return Response(
                {
                    "delete_success": False,
                    "reason": "no entry with the given id exists",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        entry_event_session_meet_host_id = entry_of_id.event.session.meet.host_id
        # ? not logged into meet host account
        if request.user.id != entry_event_session_meet_host_id:
            return Response(
                {
                    "delete_success": False,
                    "reason": "not logged into meet host account",
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        entry_of_id.delete()
        return Response({"delete_success": True})
