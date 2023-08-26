from rest_framework.views import APIView, Response
from rest_framework import status

from ..models import Event
from .. import view_helpers as vh


class Heat_sheet_view(APIView):
    def get(self, request):
        specific_to = vh.get_query_param(request, "specific_to")
        # ? no "specific_to" param passed
        if isinstance(specific_to, Response):
            return specific_to

        # $ get seeding data specific too...
        match specific_to:
            # $ ...meet/overview
            case "meet" | "overview":
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

                check_meet_access = vh.check_meet_access_allowed(
                    request, meet_of_id
                )
                # ? private meet access not allowed
                if isinstance(check_meet_access, Response):
                    return check_meet_access
                
                retrieved_seeding = vh.get_seeding_data("Meet" if specific_to == "meet" else "Overview", meet_of_id)
                # ? error retrieving seeding data
                if isinstance(retrieved_seeding, Response):
                    return retrieved_seeding
                else:
                    return Response(
                        retrieved_seeding,
                        status=status.HTTP_200_OK
                    )

            # $ ...pool
            case "pool":
                pool_id = vh.get_query_param(request, "pool_id")
                # ? no "pool_id" param passed
                if isinstance(pool_id, Response):
                    return pool_id
                else:
                    pool_id = int(pool_id)

                pool_of_id = vh.get_model_of_id("Pool", pool_id)
                # ? no pool of pool_id exists
                if isinstance(pool_of_id, Response):
                    return pool_of_id

                check_meet_access = vh.check_meet_access_allowed(
                    request, pool_of_id.meet
                )
                # ? private meet access not allowed
                if isinstance(check_meet_access, Response):
                    return check_meet_access
                
                retrieved_seeding = vh.get_seeding_data("Pool", pool_of_id)
                # ? error retrieving seeding data
                if isinstance(retrieved_seeding, Response):
                    return retrieved_seeding
                else:
                    return Response(
                        retrieved_seeding,
                        status=status.HTTP_200_OK
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
                
                retrieved_seeding = vh.get_seeding_data("Session", session_of_id)
                # ? error retrieving seeding data
                if isinstance(retrieved_seeding, Response):
                    return retrieved_seeding
                else:
                    return Response(
                        retrieved_seeding,
                        status=status.HTTP_200_OK
                    )

            # $ ...event
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

                check_meet_access = vh.check_meet_access_allowed(
                    request, event_of_id.session.meet
                )
                # ? private meet access not allowed
                if isinstance(check_meet_access, Response):
                    return check_meet_access
                
                retrieved_seeding = vh.get_seeding_data("Event", event_of_id)
                # ? error retrieving seeding data
                if isinstance(retrieved_seeding, Response):
                    return retrieved_seeding
                else:
                    return Response(
                        retrieved_seeding,
                        status=status.HTTP_200_OK
                    )

            # $ ...team
            case "team":
                team_id = vh.get_query_param(request, "team_id")
                # ? no "team_id" param passed
                if isinstance(team_id, Response):
                    return team_id
                else:
                    team_id = int(team_id)

                team_of_id = vh.get_model_of_id("Team", team_id)
                # ? no team of team_id exists
                if isinstance(team_of_id, Response):
                    return team_of_id

                check_meet_access = vh.check_meet_access_allowed(
                    request, team_of_id.meet
                )
                # ? private meet access not allowed
                if isinstance(check_meet_access, Response):
                    return check_meet_access
                
                retrieved_seeding = vh.get_seeding_data("Team", team_of_id)
                # ? error retrieving seeding data
                if isinstance(retrieved_seeding, Response):
                    return retrieved_seeding
                else:
                    return Response(
                        retrieved_seeding,
                        status=status.HTTP_200_OK
                    )

            # $ ...swimmer
            case "swimmer":
                swimmer_id = vh.get_query_param(request, "swimmer_id")
                # ? no "swimmer_id" param passed
                if isinstance(swimmer_id, Response):
                    return swimmer_id
                else:
                    swimmer_id = int(swimmer_id)

                swimmer_of_id = vh.get_model_of_id("Swimmer", swimmer_id)
                # ? no swimmer of swimmer_id exists
                if isinstance(swimmer_of_id, Response):
                    return swimmer_of_id

                check_meet_access = vh.check_meet_access_allowed(
                    request, swimmer_of_id.meet
                )
                # ? private meet access not allowed
                if isinstance(check_meet_access, Response):
                    return check_meet_access
                
                retrieved_seeding = vh.get_seeding_data("Swimmer", swimmer_of_id)
                # ? error retrieving seeding data
                if isinstance(retrieved_seeding, Response):
                    return retrieved_seeding
                else:
                    return Response(
                        retrieved_seeding,
                        status=status.HTTP_200_OK
                    )

            # $ ...relay entry
            case "entry":
                entry_id = vh.get_query_param(request, "entry_id")
                # ? no "entry_id" param passed
                if isinstance(entry_id, Response):
                    return entry_id
                else:
                    entry_id = int(entry_id)

                entry_of_id = vh.get_model_of_id("Relay_entry", entry_id)
                # ? no entry of entry_id exists
                if isinstance(entry_of_id, Response):
                    return entry_of_id

                check_meet_access = vh.check_meet_access_allowed(
                    request, entry_of_id.event.session.meet
                )
                # ? private meet access not allowed
                if isinstance(check_meet_access, Response):
                    return check_meet_access
                
                retrieved_seeding = vh.get_seeding_data("Relay_entry", entry_of_id)
                # ? error retrieving seeding data
                if isinstance(retrieved_seeding, Response):
                    return retrieved_seeding
                else:
                    return Response(
                        retrieved_seeding,
                        status=status.HTTP_200_OK
                    )
                
            # $ ...individual entry
            case "entry":
                entry_id = vh.get_query_param(request, "entry_id")
                # ? no "entry_id" param passed
                if isinstance(entry_id, Response):
                    return entry_id
                else:
                    entry_id = int(entry_id)

                entry_of_id = vh.get_model_of_id("Individual_entry", entry_id)
                # ? no entry of entry_id exists
                if isinstance(entry_of_id, Response):
                    return entry_of_id

                check_meet_access = vh.check_meet_access_allowed(
                    request, entry_of_id.event.session.meet
                )
                # ? private meet access not allowed
                if isinstance(check_meet_access, Response):
                    return check_meet_access
                
                retrieved_seeding = vh.get_seeding_data("Individual_entry", entry_of_id)
                # ? error retrieving seeding data
                if isinstance(retrieved_seeding, Response):
                    return retrieved_seeding
                else:
                    return Response(
                        retrieved_seeding,
                        status=status.HTTP_200_OK
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

                # * retrieve updated meet seeding data
                retrieved_seeding = vh.get_seeding_data("Overview", event_of_id.session.meet)
                # ? error retrieving seeding data
                if isinstance(retrieved_seeding, Response):
                    return retrieved_seeding
                else:
                    return Response(
                        retrieved_seeding,
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

                # * retrieve updated meet seeding data
                retrieved_seeding = vh.get_seeding_data("Overview", session_of_id.meet)
                # ? error retrieving seeding data
                if isinstance(retrieved_seeding, Response):
                    return retrieved_seeding
                else:
                    return Response(
                        retrieved_seeding,
                        status=status.HTTP_200_OK
                    )
            
            # $ ...a meet
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

                check_is_host = vh.check_user_is_host(request, meet_of_id.host_id)
                # ? user is not meet host
                if isinstance(check_is_host, Response):
                    return check_is_host
                
                # * retrieve events to seed
                if (request.data.get("re_seed_events", True)):
                    events_to_seed = Event.objects.filter(session__meet_id=meet_id)
                else:
                    events_to_seed = Event.objects.filter(session__meet_id=meet_id, total_heats__isnull=True)

                # * generate seeding for applicable events
                for event in events_to_seed:
                    generation_result = vh.generate_event_seeding(request.data, event)
                    if isinstance(generation_result, Response):
                        return generation_result

                # * retrieve updated meet seeding data
                retrieved_seeding = vh.get_seeding_data("Overview", meet_of_id)
                # ? error retrieving seeding data
                if isinstance(retrieved_seeding, Response):
                    return retrieved_seeding
                else:
                    return Response(
                        retrieved_seeding,
                        status=status.HTTP_200_OK
                    )

            # ? invalid "specific_to" specification
            case _:
                return Response(
                    "invalid 'specific_to' specification",
                    status=status.HTTP_400_BAD_REQUEST,
                )
