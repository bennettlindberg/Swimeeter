from rest_framework.views import APIView, Response
from rest_framework import status

from ..models import Individual_entry, Event
from .. import view_helpers as vh

from django.core.exceptions import ValidationError


class Individual_entry_view(APIView):
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

        # $ get individual_entr(y/ies) specific too...
        match specific_to:
            # $ ...id
            case "id":
                individual_entry_id = vh.get_query_param(request, "individual_entry_id")
                # ? no "individual_entry_id" param passed
                if isinstance(individual_entry_id, Response):
                    return individual_entry_id
                else:
                    individual_entry_id = int(individual_entry_id)

                individual_entry_of_id = vh.get_model_of_id(
                    "Individual_entry", individual_entry_id
                )
                # ? no individual entry of individual_entry_id exists
                if isinstance(individual_entry_of_id, Response):
                    return individual_entry_of_id

                check_meet_access = vh.check_meet_access_allowed(
                    request, individual_entry_of_id.event.session.meet
                )
                # ? private meet access not allowed
                if isinstance(check_meet_access, Response):
                    return check_meet_access

                # * get individual_entry JSON
                individual_entry_JSON = vh.get_JSON_single(
                    "Individual_entry", individual_entry_of_id, True
                )
                # ? internal error generating JSON
                if isinstance(individual_entry_JSON, Response):
                    return individual_entry_JSON
                else:
                    return Response(
                        individual_entry_JSON,
                        status=status.HTTP_200_OK,
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

                individual_entries_of_event = Individual_entry.objects.filter(
                    event_id=event_id
                ).order_by(
                    "swimmer__first_name",
                    "swimmer__last_name",
                    "swimmer__age",
                    "swimmer__gender",
                )

                # @ apply search filtering
                search__first_name = vh.get_query_param(request, "search__first_name")
                if isinstance(search__first_name, str):
                    individual_entries_of_event = individual_entries_of_event.filter(
                        swimmer__first_name__istartswith=search__first_name
                    )

                search__last_name = vh.get_query_param(request, "search__last_name")
                if isinstance(search__last_name, str):
                    individual_entries_of_event = individual_entries_of_event.filter(
                        swimmer__last_name__istartswith=search__last_name
                    )

                search__age = vh.get_query_param(request, "search__age")
                if isinstance(search__age, str):
                    search__age = int(search__age)
                    individual_entries_of_event = individual_entries_of_event.filter(
                        swimmer__age=search__age
                    )

                search__gender = vh.get_query_param(request, "search__gender")
                if isinstance(search__gender, str):
                    individual_entries_of_event = individual_entries_of_event.filter(
                        swimmer__gender__istartswith=search__gender
                    )

                search__team_name = vh.get_query_param(request, "search__team_name")
                if isinstance(search__team_name, str):
                    individual_entries_of_event = individual_entries_of_event.filter(
                        swimmer__team__name__istartswith=search__team_name
                    )

                search__team_acronym = vh.get_query_param(
                    request, "search__team_acronym"
                )
                if isinstance(search__team_acronym, str):
                    individual_entries_of_event = individual_entries_of_event.filter(
                        swimmer__team__acronym__istartswith=search__team_acronym
                    )

                # * only retrieve request range of values
                individual_entries_of_event = individual_entries_of_event[
                    lower_bound:upper_bound
                ]

                # * get individual_entries JSON
                individual_entries_JSON = vh.get_JSON_multiple(
                    "Individual_entry", individual_entries_of_event, True
                )
                # ? internal error generating JSON
                if isinstance(individual_entries_JSON, Response):
                    return individual_entries_JSON
                else:
                    return Response(
                        individual_entries_JSON,
                        status=status.HTTP_200_OK,
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

                individual_entries_of_team = Individual_entry.objects.filter(
                    swimmer__team_id=team_id
                ).order_by(
                    "event__stroke",
                    "event__distance",
                    "event__competing_min_age",
                    "event__competing_gender",
                )

                # @ apply search filtering
                search__event_stroke = vh.get_query_param(
                    request, "search__event_stroke"
                )
                if isinstance(search__event_stroke, str):
                    individual_entries_of_team = individual_entries_of_team.filter(
                        event__stroke__istartswith=search__event_stroke
                    )

                search__event_distance = vh.get_query_param(
                    request, "search__event_distance"
                )
                if isinstance(search__event_distance, str):
                    search__event_distance = int(search__event_distance)
                    individual_entries_of_team = individual_entries_of_team.filter(
                        event__distance=search__event_distance
                    )

                search__event_competing_min_age = vh.get_query_param(
                    request, "search__event_competing_min_age"
                )
                if isinstance(search__event_competing_min_age, str):
                    search__event_competing_min_age = int(
                        search__event_competing_min_age
                    )
                    individual_entries_of_team = individual_entries_of_team.filter(
                        event__competing_min_age=search__event_competing_min_age
                    )

                search__event_competing_max_age = vh.get_query_param(
                    request, "search__event_competing_max_age"
                )
                if isinstance(search__event_competing_max_age, str):
                    search__event_competing_max_age = int(
                        search__event_competing_max_age
                    )
                    individual_entries_of_team = individual_entries_of_team.filter(
                        event__competing_max_age=search__event_competing_max_age
                    )

                search__event_competing_gender = vh.get_query_param(
                    request, "search__event_competing_gender"
                )
                if isinstance(search__event_competing_gender, str):
                    individual_entries_of_team = individual_entries_of_team.filter(
                        event__competing_gender__istartswith=search__event_competing_gender
                    )

                search__event_stage = vh.get_query_param(
                    request, "search__event_stage"
                )
                if isinstance(search__event_stage, str):
                    individual_entries_of_team = individual_entries_of_team.filter(
                        event__stage__istartswith=search__event_stage
                    )

                search__event_session_name = vh.get_query_param(
                    request, "search__event_session_name"
                )
                if isinstance(search__event_session_name, str):
                    individual_entries_of_team = individual_entries_of_team.filter(
                        event__session__name__istartswith=search__event_session_name
                    )

                search__swimmer_first_name = vh.get_query_param(
                    request, "search__swimmer_first_name"
                )
                if isinstance(search__swimmer_first_name, str):
                    individual_entries_of_team = individual_entries_of_team.filter(
                        swimmer__first_name__istartswith=search__swimmer_first_name
                    )

                search__swimmer_last_name = vh.get_query_param(
                    request, "search__swimmer_last_name"
                )
                if isinstance(search__swimmer_last_name, str):
                    individual_entries_of_team = individual_entries_of_team.filter(
                        swimmer__last_name__istartswith=search__swimmer_last_name
                    )

                search__swimmer_age = vh.get_query_param(request, "search__swimmer_age")
                if isinstance(search__swimmer_age, str):
                    search__swimmer_age = int(search__swimmer_age)
                    individual_entries_of_team = individual_entries_of_team.filter(
                        swimmer__age=search__swimmer_age
                    )

                search__swimmer_gender = vh.get_query_param(
                    request, "search__swimmer_gender"
                )
                if isinstance(search__swimmer_gender, str):
                    individual_entries_of_team = individual_entries_of_team.filter(
                        swimmer__gender__istartswith=search__swimmer_gender
                    )

                # * only retrieve request range of values
                individual_entries_of_team = individual_entries_of_team[
                    lower_bound:upper_bound
                ]

                # * get individual_entries JSON
                individual_entries_JSON = vh.get_JSON_multiple(
                    "Individual_entry", individual_entries_of_team, True
                )
                # ? internal error generating JSON
                if isinstance(individual_entries_JSON, Response):
                    return individual_entries_JSON
                else:
                    return Response(
                        individual_entries_JSON,
                        status=status.HTTP_200_OK,
                    )

            # $ ...heat
            case "heat":
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

                heat_number = vh.get_query_param(request, "heat_number")
                # ? no "heat_number" param passed
                if isinstance(heat_number, Response):
                    return heat_number
                else:
                    heat_number = int(heat_number)

                # ? no heat with the given number exists
                if (
                    event_of_id.total_heats is None
                    or heat_number > event_of_id.total_heats
                    or heat_number < 1
                ):
                    return Response(
                        "no heat with the given number exists",
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                individual_entries_of_heat = Individual_entry.objects.filter(
                    event_id=event_id, heat_number=heat_number
                ).order_by("lane_number")

                # @ apply search filtering
                search__first_name = vh.get_query_param(request, "search__first_name")
                if isinstance(search__first_name, str):
                    individual_entries_of_heat = individual_entries_of_heat.filter(
                        swimmer__first_name__istartswith=search__first_name
                    )

                search__last_name = vh.get_query_param(request, "search__last_name")
                if isinstance(search__last_name, str):
                    individual_entries_of_heat = individual_entries_of_heat.filter(
                        swimmer__last_name__istartswith=search__last_name
                    )

                search__age = vh.get_query_param(request, "search__age")
                if isinstance(search__age, str):
                    search__age = int(search__age)
                    individual_entries_of_heat = individual_entries_of_heat.filter(
                        swimmer__age=search__age
                    )

                search__gender = vh.get_query_param(request, "search__gender")
                if isinstance(search__gender, str):
                    individual_entries_of_heat = individual_entries_of_heat.filter(
                        swimmer__gender__istartswith=search__gender
                    )

                search__team_name = vh.get_query_param(request, "search__team_name")
                if isinstance(search__team_name, str):
                    individual_entries_of_heat = individual_entries_of_heat.filter(
                        swimmer__team__name__istartswith=search__team_name
                    )

                search__team_acronym = vh.get_query_param(
                    request, "search__team_acronym"
                )
                if isinstance(search__team_acronym, str):
                    individual_entries_of_heat = individual_entries_of_heat.filter(
                        swimmer__team__acronym__istartswith=search__team_acronym
                    )

                # * only retrieve request range of values
                individual_entries_of_heat = individual_entries_of_heat[
                    lower_bound:upper_bound
                ]

                # * get individual_entries JSON
                individual_entries_JSON = vh.get_JSON_multiple(
                    "Individual_entry", individual_entries_of_heat, True
                )
                # ? internal error generating JSON
                if isinstance(individual_entries_JSON, Response):
                    return individual_entries_JSON
                else:
                    return Response(
                        individual_entries_JSON,
                        status=status.HTTP_200_OK,
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

                individual_entries_of_swimmer = Individual_entry.objects.filter(
                    swimmer_id=swimmer_id
                ).order_by(
                    "event__stroke",
                    "event__distance",
                    "event__competing_min_age",
                    "event__competing_gender",
                )

                # @ apply search filtering
                search__stroke = vh.get_query_param(request, "search__stroke")
                if isinstance(search__stroke, str):
                    individual_entries_of_swimmer = (
                        individual_entries_of_swimmer.filter(
                            event__stroke__istartswith=search__stroke
                        )
                    )

                search__distance = vh.get_query_param(request, "search__distance")
                if isinstance(search__distance, str):
                    search__distance = int(search__distance)
                    individual_entries_of_swimmer = (
                        individual_entries_of_swimmer.filter(
                            event__distance=search__distance
                        )
                    )

                search__competing_min_age = vh.get_query_param(
                    request, "search__competing_min_age"
                )
                if isinstance(search__competing_min_age, str):
                    search__competing_min_age = int(search__competing_min_age)
                    individual_entries_of_swimmer = (
                        individual_entries_of_swimmer.filter(
                            event__competing_min_age=search__competing_min_age
                        )
                    )

                search__competing_max_age = vh.get_query_param(
                    request, "search__competing_max_age"
                )
                if isinstance(search__competing_max_age, str):
                    search__competing_max_age = int(search__competing_max_age)
                    individual_entries_of_swimmer = (
                        individual_entries_of_swimmer.filter(
                            event__competing_max_age=search__competing_max_age
                        )
                    )

                search__competing_gender = vh.get_query_param(
                    request, "search__competing_gender"
                )
                if isinstance(search__competing_gender, str):
                    individual_entries_of_swimmer = individual_entries_of_swimmer.filter(
                        event__competing_gender__istartswith=search__competing_gender
                    )

                search__stage = vh.get_query_param(request, "search__stage")
                if isinstance(search__stage, str):
                    individual_entries_of_swimmer = (
                        individual_entries_of_swimmer.filter(
                            event__stage__istartswith=search__stage
                        )
                    )

                search__session_name = vh.get_query_param(
                    request, "search__session_name"
                )
                if isinstance(search__session_name, str):
                    individual_entries_of_swimmer = (
                        individual_entries_of_swimmer.filter(
                            event__session__name__istartswith=search__session_name
                        )
                    )

                # * only retrieve request range of values
                individual_entries_of_swimmer = individual_entries_of_swimmer[
                    lower_bound:upper_bound
                ]

                # * get individual_entries JSON
                individual_entries_JSON = vh.get_JSON_multiple(
                    "Individual_entry", individual_entries_of_swimmer, True
                )
                # ? internal error generating JSON
                if isinstance(individual_entries_JSON, Response):
                    return individual_entries_JSON
                else:
                    return Response(
                        individual_entries_JSON,
                        status=status.HTTP_200_OK,
                    )

            # ? invalid "specific_to" specification
            case _:
                return Response(
                    "invalid 'specific_to' specification",
                    status=status.HTTP_400_BAD_REQUEST,
                )

    def post(self, request):
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

        # ? event is not an individual event
        if event_of_id.is_relay:
            return Response(
                "event is not an individual event",
                status=status.HTTP_400_BAD_REQUEST,
            )

        check_is_host = vh.check_user_is_host(request, event_of_id.session.meet.host_id)
        # ? user is not meet host
        if isinstance(check_is_host, Response):
            return check_is_host

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

        # ? swimmer and event meets do not match
        if swimmer_of_id.meet_id != event_of_id.session.meet_id:
            return Response(
                "swimmer and event meets do not match",
                status=status.HTTP_400_BAD_REQUEST,
            )

        check_compatibility = vh.validate_swimmer_against_event(
            swimmer_of_id, event_of_id
        )
        # ? swimmer and event are not compatible
        if isinstance(check_compatibility, Response):
            return check_compatibility

        # * create new individual_entry
        try:
            new_individual_entry = Individual_entry(
                seed_time=request.data["seed_time"],
                # heat_number => null,
                # lane_number => null,
                swimmer_id=swimmer_id,
                event_id=event_id,
            )

            # * handle any duplicates
            duplicate_handling = vh.get_entry_duplicate_handling(request)
            handle_duplicates = vh.handle_duplicates(
                duplicate_handling, "Individual_entry", new_individual_entry
            )
            # ? error handling duplicates
            if isinstance(handle_duplicates, Response):
                return handle_duplicates

            new_individual_entry.full_clean()
            new_individual_entry.save()
        except ValidationError as err:
            # ? invalid creation data passed -> validators
            return Response(
                "; ".join(err.messages),
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception as err:
            # ? invalid creation data passed -> general
            return Response(
                str(err),
                status=status.HTTP_400_BAD_REQUEST,
            )

        # * invalidate event seeding
        invalidate_hs_data = vh.invalidate_event_seeding(new_individual_entry.event)
        # ? internal error invalidating event seeding
        if isinstance(invalidate_hs_data, Response):
            return invalidate_hs_data

        # * get individual_entry JSON
        new_individual_entry_JSON = vh.get_JSON_single(
            "Individual_entry", new_individual_entry, True
        )
        # ? internal error generating JSON
        if isinstance(new_individual_entry_JSON, Response):
            return new_individual_entry_JSON
        else:
            return Response(
                new_individual_entry_JSON,
                status=status.HTTP_201_CREATED,
            )

    def put(self, request):
        seeding_needs_invalidation = False

        individual_entry_id = vh.get_query_param(request, "individual_entry_id")
        # ? no "individual_entry_id" param passed
        if isinstance(individual_entry_id, Response):
            return individual_entry_id
        else:
            individual_entry_id = int(individual_entry_id)

        individual_entry_of_id = vh.get_model_of_id(
            "Individual_entry", individual_entry_id
        )
        # ? no individual entry of individual_entry_id exists
        if isinstance(individual_entry_of_id, Response):
            return individual_entry_of_id

        check_is_host = vh.check_user_is_host(
            request, individual_entry_of_id.event.session.meet.host_id
        )
        # ? user is not meet host
        if isinstance(check_is_host, Response):
            return check_is_host

        event_changed = False
        original_event_id = -1
        # * update existing individual_entry
        try:
            edited_individual_entry = Individual_entry.objects.get(
                id=individual_entry_id
            )
            original_event_id = edited_individual_entry.event.pk

            if (
                "seed_time" in request.data
                and request.data["seed_time"] != edited_individual_entry.seed_time
            ):
                edited_individual_entry.seed_time = request.data["seed_time"]
                seeding_needs_invalidation = True

            # @ handle FK event change
            event_id = vh.get_query_param(request, "event_id")
            if isinstance(event_id, str):
                event_id = int(event_id)

                if event_id != edited_individual_entry.event.pk:
                    event_changed = True
                    seeding_needs_invalidation = True

                event_of_id = vh.get_model_of_id("Event", event_id)
                # ? no event of event_id exists
                if isinstance(event_of_id, Response):
                    return event_of_id

                # ? event is not an individual event
                if event_of_id.is_relay:
                    return Response(
                        "event is not an individual event",
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                edited_individual_entry.event = event_of_id

            # @ handle FK swimmer change
            swimmer_id = vh.get_query_param(request, "swimmer_id")
            if isinstance(swimmer_id, str):
                swimmer_id = int(swimmer_id)

                if swimmer_id != edited_individual_entry.swimmer.pk:
                    seeding_needs_invalidation = True

                swimmer_of_id = vh.get_model_of_id("Swimmer", swimmer_id)
                # ? no swimmer of swimmer_id exists
                if isinstance(swimmer_of_id, Response):
                    return swimmer_of_id

                edited_individual_entry.swimmer = swimmer_of_id

            # ? swimmer and event meets do not match
            if (
                edited_individual_entry.swimmer.meet_id
                != edited_individual_entry.event.session.meet_id
            ):
                return Response(
                    "swimmer and event meets do not match",
                    status=status.HTTP_400_BAD_REQUEST,
                )

            check_compatibility = vh.validate_swimmer_against_event(
                edited_individual_entry.swimmer, edited_individual_entry.event
            )
            # ? swimmer and event are not compatible
            if isinstance(check_compatibility, Response):
                return check_compatibility

            # * handle any duplicates
            duplicate_handling = vh.get_entry_duplicate_handling(request)
            handle_duplicates = vh.handle_duplicates(
                duplicate_handling, "Individual_entry", edited_individual_entry
            )
            # ? error handling duplicates
            if isinstance(handle_duplicates, Response):
                return handle_duplicates

            edited_individual_entry.full_clean()
            edited_individual_entry.save()
        except ValidationError as err:
            # ? invalid creation data passed -> validators
            return Response(
                "; ".join(err.messages),
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception as err:
            # ? invalid creation data passed -> general
            return Response(
                str(err),
                status=status.HTTP_400_BAD_REQUEST,
            )

        # * invalidate event seeding
        if seeding_needs_invalidation:
            invalidate_hs_data = vh.invalidate_event_seeding(
                edited_individual_entry.event
            )
            # ? internal error invalidating event seeding
            if isinstance(invalidate_hs_data, Response):
                return invalidate_hs_data

            if event_changed:
                invalidate_hs_data = vh.invalidate_event_seeding(
                    Event.objects.get(id=original_event_id)
                )
                # ? internal error invalidating event seeding
                if isinstance(invalidate_hs_data, Response):
                    return invalidate_hs_data

        # * get individual_entry JSON
        edited_individual_entry_JSON = vh.get_JSON_single(
            "Individual_entry", edited_individual_entry, True
        )
        # ? internal error generating JSON
        if isinstance(edited_individual_entry_JSON, Response):
            return edited_individual_entry_JSON
        else:
            return Response(
                edited_individual_entry_JSON,
                status=status.HTTP_200_OK,
            )

    def delete(self, request):
        individual_entry_id = vh.get_query_param(request, "individual_entry_id")
        # ? no "individual_entry_id" param passed
        if isinstance(individual_entry_id, Response):
            return individual_entry_id
        else:
            individual_entry_id = int(individual_entry_id)

        individual_entry_of_id = vh.get_model_of_id(
            "Individual_entry", individual_entry_id
        )
        # ? no individual entry of individual_entry_id exists
        if isinstance(individual_entry_of_id, Response):
            return individual_entry_of_id

        check_is_host = vh.check_user_is_host(
            request, individual_entry_of_id.event.session.meet.host_id
        )
        # ? user is not meet host
        if isinstance(check_is_host, Response):
            return check_is_host

        # * delete existing individual_entry
        try:
            event = individual_entry_of_id.event

            individual_entry_of_id.delete()

            # * invalidate event seeding
            invalidate_hs_data = vh.invalidate_event_seeding(event)
            # ? internal error invalidating event seeding
            if isinstance(invalidate_hs_data, Response):
                return invalidate_hs_data

            return Response(status=status.HTTP_204_NO_CONTENT)
        # ? internal error deleting model
        except Exception as err:
            return Response(
                str(err),
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
