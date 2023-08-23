from rest_framework.views import APIView, Response
from rest_framework import status

from ..models import Event, Individual_entry, Relay_entry
from .. import view_helpers as vh

from django.core.exceptions import ValidationError


class Heat_sheet_view(APIView):
    def get(self, request):
        specific_to = vh.get_query_param(request, "specific_to")
        # ? no "specific_to" param passed
        if isinstance(specific_to, Response):
            return specific_to

        upper_bound_str = vh.get_query_param(request, "upper_bound")
        # ? no "upper_bound" param passed
        if isinstance(upper_bound_str, Response):
            upper_bound = None
        else:
            upper_bound = int(upper_bound_str)

        lower_bound_str = vh.get_query_param(request, "lower_bound")
        # ? no "lower_bound" param passed
        if isinstance(lower_bound_str, Response):
            lower_bound = None
        else:
            lower_bound = int(lower_bound_str)

        # $ get event(s) specific too...
        match specific_to:
            # $ ...id
            case "id":
                event_id = vh.get_query_param(request, "event_id")
                # ? no "event_id" param passed
                if isinstance(event_id, Response):
                    return event_id
                else:
                    event_id = int(event_id)

                event_of_id = vh.get_model_of_id("Event", event_id)
                # ? no event of event_id exists
                if isinstance(event_of_id, Response):
                    return event_of_id

                check_meet_access = vh.check_meet_access_allowed(
                    request, event_of_id.session.meet
                )
                # ? private meet access not allowed
                if isinstance(check_meet_access, Response):
                    return check_meet_access

                # * get event JSON
                event_JSON = vh.get_JSON_single("Event", event_of_id, True)
                # ? internal error generating JSON
                if isinstance(event_JSON, Response):
                    return event_JSON
                else:
                    return Response(
                        event_JSON,
                        status=status.HTTP_200_OK,
                    )

            # $ ...session
            case "session":
                session_id = vh.get_query_param(request, "session_id")
                # ? no "session_id" param passed
                if isinstance(session_id, Response):
                    return session_id
                else:
                    session_id = int(session_id)

                session_of_id = vh.get_model_of_id("Session", session_id)
                # ? no session of session_id exists
                if isinstance(session_of_id, Response):
                    return session_of_id

                check_meet_access = vh.check_meet_access_allowed(
                    request, session_of_id.meet
                )
                # ? private meet access not allowed
                if isinstance(check_meet_access, Response):
                    return check_meet_access

                events_of_session = Event.objects.filter(
                    session_id=session_id
                ).order_by("order_in_session")

                # @ apply search filtering
                search__stroke = vh.get_query_param(request, "search__stroke")
                if isinstance(search__stroke, str):
                    events_of_session = events_of_session.filter(
                        stroke__istartswith=search__stroke
                    )

                search__distance = vh.get_query_param(request, "search__distance")
                if isinstance(search__distance, str):
                    search__distance = int(search__distance)
                    events_of_session = events_of_session.filter(
                        distance=search__distance
                    )

                search__competing_min_age = vh.get_query_param(
                    request, "search__competing_min_age"
                )
                if isinstance(search__competing_min_age, str):
                    search__competing_min_age = int(search__competing_min_age)
                    events_of_session = events_of_session.filter(
                        competing_min_age=search__competing_min_age
                    )

                search__competing_max_age = vh.get_query_param(
                    request, "search__competing_max_age"
                )
                if isinstance(search__competing_max_age, str):
                    search__competing_max_age = int(search__competing_max_age)
                    events_of_session = events_of_session.filter(
                        competing_max_age=search__competing_max_age
                    )

                search__competing_gender = vh.get_query_param(
                    request, "search__competing_gender"
                )
                if isinstance(search__competing_gender, str):
                    events_of_session = events_of_session.filter(
                        competing_gender__istartswith=search__competing_gender
                    )

                search__stage = vh.get_query_param(
                    request, "search__stage"
                )
                if isinstance(search__stage, str):
                    events_of_session = events_of_session.filter(
                        stage__istartswith=search__stage
                    )

                # * only retrieve request range of values
                events_of_session = events_of_session[lower_bound:upper_bound]

                # * get events JSON
                events_JSON = vh.get_JSON_multiple("Event", events_of_session, True)
                # ? internal error generating JSON
                if isinstance(events_JSON, Response):
                    return events_JSON
                else:
                    return Response(
                        events_JSON,
                        status=status.HTTP_200_OK,
                    )

            # $ ...meet
            case "meet":
                meet_id = vh.get_query_param(request, "meet_id")
                # ? no "meet_id" param passed
                if isinstance(meet_id, Response):
                    return meet_id
                else:
                    meet_id = int(meet_id)

                meet_of_id = vh.get_model_of_id("Meet", meet_id)
                # ? no meet of meet_id exists
                if isinstance(meet_of_id, Response):
                    return meet_of_id

                check_meet_access = vh.check_meet_access_allowed(request, meet_of_id)
                # ? private meet access not allowed
                if isinstance(check_meet_access, Response):
                    return check_meet_access

                event_type = vh.get_query_param(request, "event_type")
                # ? no "event_type" param passed
                if isinstance(event_type, str):
                    if event_type != "individual" and event_type != "relay":
                        return Response(
                            "invalid event_type specification",
                            status=status.HTTP_400_BAD_REQUEST,
                        )

                if event_type == "individual":
                    events_of_meet = Event.objects.filter(
                        session__meet_id=meet_id, is_relay=False
                    ).order_by(
                        "stroke", "distance", "competing_min_age", "competing_gender"
                    )
                elif event_type == "relay":
                    events_of_meet = Event.objects.filter(
                        session__meet_id=meet_id, is_relay=True
                    ).order_by(
                        "stroke", "distance", "competing_min_age", "competing_gender"
                    )
                else:
                    events_of_meet = Event.objects.filter(
                        session__meet_id=meet_id
                    ).order_by(
                        "stroke", "distance", "competing_min_age", "competing_gender"
                    )

                # @ apply search filtering
                search__stroke = vh.get_query_param(request, "search__stroke")
                if isinstance(search__stroke, str):
                    events_of_meet = events_of_meet.filter(
                        stroke__istartswith=search__stroke
                    )

                search__distance = vh.get_query_param(request, "search__distance")
                if isinstance(search__distance, str):
                    search__distance = int(search__distance)
                    events_of_meet = events_of_meet.filter(distance=search__distance)

                search__competing_min_age = vh.get_query_param(
                    request, "search__competing_min_age"
                )
                if isinstance(search__competing_min_age, str):
                    search__competing_min_age = int(search__competing_min_age)
                    events_of_meet = events_of_meet.filter(
                        competing_min_age=search__competing_min_age
                    )

                search__competing_max_age = vh.get_query_param(
                    request, "search__competing_max_age"
                )
                if isinstance(search__competing_max_age, str):
                    search__competing_max_age = int(search__competing_max_age)
                    events_of_meet = events_of_meet.filter(
                        competing_max_age=search__competing_max_age
                    )

                search__competing_gender = vh.get_query_param(
                    request, "search__competing_gender"
                )
                if isinstance(search__competing_gender, str):
                    events_of_meet = events_of_meet.filter(
                        competing_gender__istartswith=search__competing_gender
                    )

                search__stage = vh.get_query_param(
                    request, "search__stage"
                )
                if isinstance(search__stage, str):
                    events_of_meet = events_of_meet.filter(
                        stage__istartswith=search__stage
                    )

                search__session_name = vh.get_query_param(
                    request, "search__session_name"
                )
                if isinstance(search__session_name, str):
                    events_of_meet = events_of_meet.filter(
                        session__name__istartswith=search__session_name
                    )

                # * only retrieve request range of values
                events_of_meet = events_of_meet[lower_bound:upper_bound]

                # * get events JSON
                events_JSON = vh.get_JSON_multiple("Event", events_of_meet, True)
                # ? internal error generating JSON
                if isinstance(events_JSON, Response):
                    return events_JSON
                else:
                    return Response(
                        events_JSON,
                        status=status.HTTP_200_OK,
                    )

            # ? invalid "specific_to" specification
            case _:
                return Response(
                    "invalid 'specific_to' specification",
                    status=status.HTTP_400_BAD_REQUEST,
                )

    def put(self, request):
        specific_to = vh.get_query_param(request, "specific_to")
        # ? no "specific_to" param passed
        if isinstance(specific_to, Response):
            return specific_to
        
        # $ generate heat sheet seeding for...
        match (specific_to):
            # $ ...an event
            case "event":
                event_id = vh.get_query_param(request, "event_id")
                # ? no "event_id" param passed
                if isinstance(event_id, Response):
                    return event_id
                else:
                    event_id = int(event_id)

                event_of_id = vh.get_model_of_id("Event", event_id)
                # ? no event of event_id exists
                if isinstance(event_of_id, Response):
                    return event_of_id

                check_is_host = vh.check_user_is_host(request, event_of_id.session.meet.host_id)
                # ? user is not meet host
                if isinstance(check_is_host, Response):
                    return check_is_host

                # * generate event seeding
                generation_result = vh.generate_event_seeding(request.data, event_of_id)
                if isinstance(generation_result, Response):
                    return generation_result

                # * get event seeding JSON
                # ! TODO
                return Response(
                    "success",
                    status=status.HTTP_200_OK
                )

            # $ ...a session
            case "session":
                session_id = vh.get_query_param(request, "session_id")
                # ? no "session_id" param passed
                if isinstance(session_id, Response):
                    return session_id
                else:
                    session_id = int(session_id)

                session_of_id = vh.get_model_of_id("Session", session_id)
                # ? no session of session_id exists
                if isinstance(session_of_id, Response):
                    return session_of_id

                check_is_host = vh.check_user_is_host(request, session_of_id.meet.host_id)
                # ? user is not meet host
                if isinstance(check_is_host, Response):
                    return check_is_host
                
                # * retrieve events to seed
                if (request.data.get("re_seed_events", True)):
                    events_to_seed = Event.objects.filter(session_id=session_id)
                else:
                    events_to_seed = Event.objects.filter(session_id=session_id, total_heats__isnull=True)

                # * generate seeding for applicable events
                for event in events_to_seed:
                    generation_result = vh.generate_event_seeding(request.data, event)
                    if isinstance(generation_result, Response):
                        return generation_result

                # * get session seeding JSON
                # ! TODO
                return Response(
                    "success",
                    status=status.HTTP_200_OK
                )

            # ? invalid "specific_to" specification
            case _:
                return Response(
                    "invalid 'specific_to' specification",
                    status=status.HTTP_400_BAD_REQUEST,
                )
