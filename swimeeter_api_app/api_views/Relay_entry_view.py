from rest_framework.views import APIView, Response
from rest_framework import status

from ..models import Relay_entry, Relay_assignment
from .. import view_helpers as vh

from django.core.exceptions import ValidationError


class Relay_entry_view(APIView):
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

        # $ get relay_entr(y/ies) specific too...
        match specific_to:
            # $ ...id
            case "id":
                relay_entry_id = vh.get_query_param(request, "relay_entry_id")
                # ? no "relay_entry_id" param passed
                if isinstance(relay_entry_id, Response):
                    return relay_entry_id
                else:
                    relay_entry_id = int(relay_entry_id)

                relay_entry_of_id = vh.get_model_of_id("Relay_entry", relay_entry_id)
                # ? no relay entry of relay_entry_id exists
                if isinstance(relay_entry_of_id, Response):
                    return relay_entry_of_id

                check_meet_access = vh.check_meet_access_allowed(
                    request, relay_entry_of_id.event.session.meet
                )
                # ? private meet access not allowed
                if isinstance(check_meet_access, Response):
                    return check_meet_access

                # * get relay_entry JSON
                relay_entry_JSON = vh.get_JSON_single(
                    "Relay_entry", relay_entry_of_id, True
                )
                # ? internal error generating JSON
                if isinstance(relay_entry_JSON, Response):
                    return relay_entry_JSON
                else:
                    return Response(
                        relay_entry_JSON,
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

                relay_entries_of_event = (
                    Relay_entry.objects.filter(event_id=event_id)
                    .order_by(
                        "swimmers__first_name",
                        "swimmers__last_name",
                        "swimmers__age",
                        "swimmers__gender",
                    )
                    .order_by("id")
                    .distinct("id")
                )

                # @ apply search filtering
                search__team_name = vh.get_query_param(request, "search__team_name")
                if isinstance(search__team_name, str):
                    relay_entries_of_event = relay_entries_of_event.filter(
                        swimmers__team__name__istartswith=search__team_name
                    )

                search__team_acronym = vh.get_query_param(
                    request, "search__team_acronym"
                )
                if isinstance(search__team_acronym, str):
                    relay_entries_of_event = relay_entries_of_event.filter(
                        swimmers__team__acronym__istartswith=search__team_acronym
                    )

                search__participant_names = vh.get_query_param(
                    request, "search__participant_names"
                )
                if isinstance(search__participant_names, str):
                    relay_entries_of_event = relay_entries_of_event.filter(
                        swimmers__first_name__in=search__participant_names.split(", ")
                    )

                # * only retrieve request range of values
                relay_entries_of_event = relay_entries_of_event[lower_bound:upper_bound]

                # * get relay_entries JSON
                relay_entries_JSON = vh.get_JSON_multiple(
                    "Relay_entry", relay_entries_of_event, True
                )
                # ? internal error generating JSON
                if isinstance(relay_entries_JSON, Response):
                    return relay_entries_JSON
                else:
                    return Response(
                        relay_entries_JSON,
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

                relay_entries_of_team = (
                    Relay_entry.objects.filter(swimmers__team_id=team_id)
                    .order_by(
                        "event__stroke",
                        "event__distance",
                        "event__competing_min_age",
                        "event__competing_gender",
                    )
                    .order_by("id")
                    .distinct("id")
                )

                # @ apply search filtering
                search__stroke = vh.get_query_param(request, "search__stroke")
                if isinstance(search__stroke, str):
                    relay_entries_of_team = relay_entries_of_team.filter(
                        event__stroke__istartswith=search__stroke
                    )

                search__distance = vh.get_query_param(request, "search__distance")
                if isinstance(search__distance, str):
                    search__distance = int(search__distance)
                    relay_entries_of_team = relay_entries_of_team.filter(
                        event__distance=search__distance
                    )

                search__competing_min_age = vh.get_query_param(
                    request, "search__competing_min_age"
                )
                if isinstance(search__competing_min_age, str):
                    search__competing_min_age = int(search__competing_min_age)
                    relay_entries_of_team = relay_entries_of_team.filter(
                        event__competing_min_age=search__competing_min_age
                    )

                search__competing_max_age = vh.get_query_param(
                    request, "search__competing_max_age"
                )
                if isinstance(search__competing_max_age, str):
                    search__competing_max_age = int(search__competing_max_age)
                    relay_entries_of_team = relay_entries_of_team.filter(
                        event__competing_max_age=search__competing_max_age
                    )

                search__competing_gender = vh.get_query_param(
                    request, "search__competing_gender"
                )
                if isinstance(search__competing_gender, str):
                    relay_entries_of_team = relay_entries_of_team.filter(
                        event__competing_gender__istartswith=search__competing_gender
                    )

                search__stage = vh.get_query_param(request, "search__stage")
                if isinstance(search__stage, str):
                    relay_entries_of_team = relay_entries_of_team.filter(
                        event__stage__istartswith=search__stage
                    )

                search__session_name = vh.get_query_param(
                    request, "search__session_name"
                )
                if isinstance(search__session_name, str):
                    relay_entries_of_team = relay_entries_of_team.filter(
                        event__session__name__istartswith=search__session_name
                    )

                search__participant_names = vh.get_query_param(
                    request, "search__participant_names"
                )
                if isinstance(search__participant_names, str):
                    relay_entries_of_team = relay_entries_of_team.filter(
                        swimmers__first_name__in=search__participant_names.split(", ")
                    )

                # * only retrieve request range of values
                relay_entries_of_team = relay_entries_of_team[lower_bound:upper_bound]

                # * get relay_entries JSON
                relay_entries_JSON = vh.get_JSON_multiple(
                    "Relay_entry", relay_entries_of_team, True
                )
                # ? internal error generating JSON
                if isinstance(relay_entries_JSON, Response):
                    return relay_entries_JSON
                else:
                    return Response(
                        relay_entries_JSON,
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

                relay_entries_of_heat = (
                    Relay_entry.objects.filter(
                        event_id=event_id, heat_number=heat_number
                    )
                    .order_by("lane_number")
                    .order_by("id")
                    .distinct("id")
                )

                # @ apply search filtering
                search__team_name = vh.get_query_param(request, "search__team_name")
                if isinstance(search__team_name, str):
                    relay_entries_of_heat = relay_entries_of_heat.filter(
                        swimmers__team__name__istartswith=search__team_name
                    )

                search__team_acronym = vh.get_query_param(
                    request, "search__team_acronym"
                )
                if isinstance(search__team_acronym, str):
                    relay_entries_of_heat = relay_entries_of_heat.filter(
                        swimmers__team__acronym__istartswith=search__team_acronym
                    )

                search__participant_names = vh.get_query_param(
                    request, "search__participant_names"
                )
                if isinstance(search__participant_names, str):
                    relay_entries_of_heat = relay_entries_of_heat.filter(
                        swimmers__first_name__in=search__participant_names.split(", ")
                    )

                # * only retrieve request range of values
                relay_entries_of_heat = relay_entries_of_heat[lower_bound:upper_bound]

                # * get relay_entries JSON
                relay_entries_JSON = vh.get_JSON_multiple(
                    "Relay_entry", relay_entries_of_heat, True
                )
                # ? internal error generating JSON
                if isinstance(relay_entries_JSON, Response):
                    return relay_entries_JSON
                else:
                    return Response(
                        relay_entries_JSON,
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

                relay_entries_of_swimmer = swimmer_of_id.relay_entries.all().order_by(
                    "event__stroke",
                    "event__distance",
                    "event__competing_min_age",
                    "event__competing_gender",
                )

                # @ apply search filtering
                search__stroke = vh.get_query_param(request, "search__stroke")
                if isinstance(search__stroke, str):
                    relay_entries_of_swimmer = relay_entries_of_swimmer.filter(
                        event__stroke__istartswith=search__stroke
                    )

                search__distance = vh.get_query_param(request, "search__distance")
                if isinstance(search__distance, str):
                    search__distance = int(search__distance)
                    relay_entries_of_swimmer = relay_entries_of_swimmer.filter(
                        event__distance=search__distance
                    )

                search__competing_min_age = vh.get_query_param(
                    request, "search__competing_min_age"
                )
                if isinstance(search__competing_min_age, str):
                    search__competing_min_age = int(search__competing_min_age)
                    relay_entries_of_swimmer = relay_entries_of_swimmer.filter(
                        event__competing_min_age=search__competing_min_age
                    )

                search__competing_max_age = vh.get_query_param(
                    request, "search__competing_max_age"
                )
                if isinstance(search__competing_max_age, str):
                    search__competing_max_age = int(search__competing_max_age)
                    relay_entries_of_swimmer = relay_entries_of_swimmer.filter(
                        event__competing_max_age=search__competing_max_age
                    )

                search__competing_gender = vh.get_query_param(
                    request, "search__competing_gender"
                )
                if isinstance(search__competing_gender, str):
                    relay_entries_of_swimmer = relay_entries_of_swimmer.filter(
                        event__competing_gender__istartswith=search__competing_gender
                    )

                search__stage = vh.get_query_param(request, "search__stage")
                if isinstance(search__stage, str):
                    relay_entries_of_swimmer = relay_entries_of_swimmer.filter(
                        event__stage__istartswith=search__stage
                    )

                search__session_name = vh.get_query_param(
                    request, "search__session_name"
                )
                if isinstance(search__session_name, str):
                    relay_entries_of_swimmer = relay_entries_of_swimmer.filter(
                        event__session__name__istartswith=search__session_name
                    )

                search__participant_names = vh.get_query_param(
                    request, "search__participant_names"
                )
                if isinstance(search__participant_names, str):
                    relay_entries_of_swimmer = relay_entries_of_swimmer.filter(
                        swimmers__first_name__in=search__participant_names.split(", ")
                    )

                # * only retrieve request range of values
                relay_entries_of_swimmer = relay_entries_of_swimmer[
                    lower_bound:upper_bound
                ]

                # * get relay_entries JSON
                relay_entries_JSON = vh.get_JSON_multiple(
                    "Relay_entry", relay_entries_of_swimmer, True
                )
                # ? internal error generating JSON
                if isinstance(relay_entries_JSON, Response):
                    return relay_entries_JSON
                else:
                    return Response(
                        relay_entries_JSON,
                        status=status.HTTP_200_OK,
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

        # ? event is not a relay event
        if not event_of_id.is_relay:
            return Response(
                "event is not a relay event",
                status=status.HTTP_400_BAD_REQUEST,
            )

        check_is_host = vh.check_user_is_host(request, event_of_id.session.meet.host_id)
        # ? user is not meet host
        if isinstance(check_is_host, Response):
            return check_is_host

        try:
            swimmer_ids = []
            relay_placements = []
            for assignment in request.data["assignments"]:
                swimmer_ids.append(assignment["swimmer_id"])
                relay_placements.append(assignment["order_in_relay"])
        except Exception as err:
            # ? error retrieving swimmer ids or relay placements
            return Response(
                str(err),
                status=status.HTTP_400_BAD_REQUEST,
            )

        # ? relay has incorrect number of swimmers
        if len(swimmer_ids) != event_of_id.swimmers_per_entry:
            return Response(
                "relay has incorrect number of swimmers",
                status=status.HTTP_400_BAD_REQUEST,
            )

        relay_placements.sort()
        for i in range(len(relay_placements)):
            # ? relay placements are incorrect
            if relay_placements[i] != i + 1:
                return Response(
                    "relay placements are incorrect",
                    status=status.HTTP_400_BAD_REQUEST,
                )

        check_swimmers_against_others = vh.check_swimmers_against_others(swimmer_ids)
        # ? duplicate swimmers exist inside relay
        if isinstance(check_swimmers_against_others, Response):
            return check_swimmers_against_others

        swimmers_of_ids = list(
            map(lambda model_id: vh.get_model_of_id("Swimmer", model_id), swimmer_ids)
        )
        for swimmer_of_id in swimmers_of_ids:
            # ? no swimmer of swimmer_id exists
            if isinstance(swimmer_of_id, Response):
                return swimmer_of_id

        for swimmer_of_id in swimmers_of_ids:
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

        # ~ begin handling duplicates
        duplicate_handling = vh.get_entry_duplicate_handling(request)
        original_duplicates = Relay_entry.objects.filter(
            event_id=event_id, swimmers__id__in=swimmer_ids
        )
        if original_duplicates.count() > 0:
            if duplicate_handling == "unhandled":
                return Response(
                    "unhandled duplicates exist",
                    status=status.HTTP_409_CONFLICT,
                )
            elif duplicate_handling == "keep_originals":
                return Response(
                    "new model is a duplicate; new model not added",
                    status=status.HTTP_200_OK,
                )

        # * create new relay_entry
        try:
            new_relay_entry = Relay_entry(
                seed_time=0,  # assigned post-creation,
                # heat_number => null,
                # lane_number => null,
                # swimmers => assigned post-creation,
                event_id=event_id,
            )

            new_relay_entry.full_clean()
            new_relay_entry.save()
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

        # * create new relay_assignment(s)
        try:
            total_relay_time = 0

            for assignment in request.data["assignments"]:
                total_relay_time += assignment["seed_relay_split"]

                new_relay_assignment = Relay_assignment(
                    order_in_relay=assignment["order_in_relay"],
                    seed_relay_split=assignment["seed_relay_split"],
                    swimmer_id=assignment["swimmer_id"],
                    relay_entry=new_relay_entry,
                )

                new_relay_assignment.full_clean()
                new_relay_assignment.save()

            # * update relay_entry with overall seed time
            new_relay_entry.seed_time = total_relay_time
            new_relay_entry.full_clean()
            new_relay_entry.save()

            # * handle any duplicates
            duplicate_handling = vh.get_duplicate_handling(request)
            handle_duplicates = vh.handle_duplicates(
                duplicate_handling, "Relay_entry", new_relay_entry
            )
            # ? error handling duplicates
            if isinstance(handle_duplicates, Response):
                assignments = Relay_assignment.objects.filter(
                    relay_entry_id=new_relay_entry.pk
                )
                assignments.delete()
                new_relay_entry.delete()
                return handle_duplicates
        except ValidationError as err:
            # ? invalid creation data passed -> validators
            assignments = Relay_assignment.objects.filter(
                relay_entry_id=new_relay_entry.pk
            )
            assignments.delete()
            new_relay_entry.delete()

            return Response(
                "; ".join(err.messages),
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception as err:
            # ? invalid creation data passed -> general
            assignments = Relay_assignment.objects.filter(
                relay_entry_id=new_relay_entry.pk
            )
            assignments.delete()
            new_relay_entry.delete()

            return Response(
                str(err),
                status=status.HTTP_400_BAD_REQUEST,
            )

        # ~ finish handling duplicates
        if original_duplicates.count() > 0 and duplicate_handling == "keep_new":
            original_duplicates.delete()

        # * invalidate event seeding
        invalidate_hs_data = vh.invalidate_event_seeding(new_relay_entry.event)
        # ? internal error invalidating event seeding
        if isinstance(invalidate_hs_data, Response):
            return invalidate_hs_data

        # * get relay_entry JSON
        new_relay_entry_JSON = vh.get_JSON_single("Relay_entry", new_relay_entry, True)
        # ? internal error generating JSON
        if isinstance(new_relay_entry_JSON, Response):
            return new_relay_entry_JSON
        else:
            return Response(
                new_relay_entry_JSON,
                status=status.HTTP_201_CREATED,
            )

    def put(self, request):
        relay_entry_id = vh.get_query_param(request, "relay_entry_id")
        # ? no "relay_entry_id" param passed
        if isinstance(relay_entry_id, Response):
            return relay_entry_id
        else:
            relay_entry_id = int(relay_entry_id)

        relay_entry_of_id = vh.get_model_of_id("Relay_entry", relay_entry_id)
        # ? no relay entry of relay_entry_id exists
        if isinstance(relay_entry_of_id, Response):
            return relay_entry_of_id

        check_is_host = vh.check_user_is_host(
            request, relay_entry_of_id.event.session.meet.host_id
        )
        # ? user is not meet host
        if isinstance(check_is_host, Response):
            return check_is_host

        try:
            swimmer_ids = []
            relay_placements = []
            for assignment in request.data["assignments"]:
                swimmer_ids.append(assignment["swimmer_id"])
                relay_placements.append(assignment["order_in_relay"])
        except Exception as err:
            # ? error retrieving swimmer ids or relay placements
            return Response(
                str(err),
                status=status.HTTP_400_BAD_REQUEST,
            )

        event_changed = False
        original_event = relay_entry_of_id.event
        # @ handle FK event change
        event_id = vh.get_query_param(request, "event_id")
        if isinstance(event_id, str):
            event_id = int(event_id)

            if event_id != relay_entry_of_id.event.pk:
                event_changed = True
                seeding_needs_invalidation = True

            event_of_id = vh.get_model_of_id("Event", event_id)
            # ? no event of event_id exists
            if isinstance(event_of_id, Response):
                return event_of_id

            # ? event is not a relay event
            if not event_of_id.is_relay:
                return Response(
                    "event is not a relay event",
                    status=status.HTTP_400_BAD_REQUEST,
                )

            relay_entry_of_id.event = event_of_id

        # ? relay has incorrect number of swimmers
        if len(swimmer_ids) != relay_entry_of_id.event.swimmers_per_entry:
            return Response(
                "relay has incorrect number of swimmers",
                status=status.HTTP_400_BAD_REQUEST,
            )

        relay_placements.sort()
        for i in range(len(relay_placements)):
            # ? relay placements are incorrect
            if relay_placements[i] != i + 1:
                return Response(
                    "relay placements are incorrect",
                    status=status.HTTP_400_BAD_REQUEST,
                )

        check_swimmers_against_others = vh.check_swimmers_against_others(swimmer_ids)
        # ? duplicate swimmers exist inside relay
        if isinstance(check_swimmers_against_others, Response):
            return check_swimmers_against_others

        swimmers_of_ids = list(
            map(lambda model_id: vh.get_model_of_id("Swimmer", model_id), swimmer_ids)
        )
        for swimmer_of_id in swimmers_of_ids:
            # ? no swimmer of swimmer_id exists
            if isinstance(swimmer_of_id, Response):
                return swimmer_of_id

        for swimmer_of_id in swimmers_of_ids:
            # ? swimmer and event meets do not match
            if swimmer_of_id.meet_id != relay_entry_of_id.event.session.meet_id:
                return Response(
                    "swimmer and event meets do not match",
                    status=status.HTTP_400_BAD_REQUEST,
                )
            check_compatibility = vh.validate_swimmer_against_event(
                swimmer_of_id, relay_entry_of_id.event
            )
            # ? swimmer and event are not compatible
            if isinstance(check_compatibility, Response):
                return check_compatibility

        # ~ begin handling duplicates
        duplicate_handling = vh.get_entry_duplicate_handling(request)
        original_duplicates = Relay_entry.objects.filter(
            event_id=relay_entry_of_id.event, swimmers__id__in=swimmer_ids
        ).exclude(id=relay_entry_id)
        if original_duplicates.count() > 0:
            if duplicate_handling == "unhandled":
                return Response(
                    "unhandled duplicates exist",
                    status=status.HTTP_409_CONFLICT,
                )
            elif duplicate_handling == "keep_originals":
                return Response(
                    "new model is a duplicate; new model not added",
                    status=status.HTTP_200_OK,
                )

        seeding_needs_invalidation = False

        # * update existing relay_entry
        try:
            edited_relay_entry = Relay_entry.objects.get(id=relay_entry_id)
            old_seed_time = edited_relay_entry.seed_time

            new_assignment_ids = []
            total_relay_time = 0

            for assignment in request.data["assignments"]:
                total_relay_time += assignment["seed_relay_split"]

                new_relay_assignment = Relay_assignment(
                    order_in_relay=assignment["order_in_relay"],
                    seed_relay_split=assignment["seed_relay_split"],
                    swimmer_id=assignment["swimmer_id"],
                    relay_entry=edited_relay_entry,
                )

                new_relay_assignment.full_clean()
                new_relay_assignment.save()
                new_assignment_ids.append(new_relay_assignment.pk)

            # * update relay_entry with overall seed time
            edited_relay_entry.seed_time = total_relay_time
            if total_relay_time != old_seed_time:
                seeding_needs_invalidation = True

            edited_relay_entry.full_clean()
            edited_relay_entry.save()
        except ValidationError as err:
            # ? invalid creation data passed -> validators
            Relay_assignment.objects.filter(id__in=new_assignment_ids).delete()
            edited_relay_entry.seed_time = old_seed_time
            edited_relay_entry.save()

            return Response(
                "; ".join(err.messages),
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception as err:
            # ? invalid creation data passed -> general
            Relay_assignment.objects.filter(id__in=new_assignment_ids).delete()
            edited_relay_entry.seed_time = old_seed_time
            edited_relay_entry.save()

            return Response(
                str(err),
                status=status.HTTP_400_BAD_REQUEST,
            )

        Relay_assignment.objects.filter(relay_entry_id=edited_relay_entry.pk).exclude(
            id__in=new_assignment_ids
        ).delete()

        # ~ finish handling duplicates
        if original_duplicates.count() > 0 and duplicate_handling == "keep_new":
            original_duplicates.delete()
            seeding_needs_invalidation = True

        # * invalidate event seeding
        if seeding_needs_invalidation:
            invalidate_hs_data = vh.invalidate_event_seeding(edited_relay_entry.event)
            # ? internal error invalidating event seeding
            if isinstance(invalidate_hs_data, Response):
                return invalidate_hs_data

            if event_changed:
                invalidate_hs_data = vh.invalidate_event_seeding(original_event)
                # ? internal error invalidating event seeding
                if isinstance(invalidate_hs_data, Response):
                    return invalidate_hs_data

        # * get relay_entry JSON
        edited_relay_entry_JSON = vh.get_JSON_single(
            "Relay_entry", edited_relay_entry, True
        )
        # ? internal error generating JSON
        if isinstance(edited_relay_entry_JSON, Response):
            return edited_relay_entry_JSON
        else:
            return Response(
                edited_relay_entry_JSON,
                status=status.HTTP_200_OK,
            )

    def delete(self, request):
        relay_entry_id = vh.get_query_param(request, "relay_entry_id")
        # ? no "relay_entry_id" param passed
        if isinstance(relay_entry_id, Response):
            return relay_entry_id
        else:
            relay_entry_id = int(relay_entry_id)

        relay_entry_of_id = vh.get_model_of_id("Relay_entry", relay_entry_id)
        # ? no relay entry of relay_entry_id exists
        if isinstance(relay_entry_of_id, Response):
            return relay_entry_of_id

        check_is_host = vh.check_user_is_host(
            request, relay_entry_of_id.event.session.meet.host_id
        )
        # ? user is not meet host
        if isinstance(check_is_host, Response):
            return check_is_host

        # * delete existing relay_entry
        try:
            event = relay_entry_of_id.event

            relay_entry_of_id.delete()

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
