from rest_framework.views import APIView, Response
from rest_framework import status

from ..models import Individual_entry
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

                individual_entry_of_id = vh.get_model_of_id("Individual_entry", individual_entry_id)
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

                individual_entries_of_event = Individual_entry.objects.filter(event_id=event_id)[
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

            # $ ...heat
            case "heat":
                event_id = vh.get_query_param(request, "event_id")
                # ? no "event_id" param passed
                if isinstance(event_id, Response):
                    return event_id

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
                ).order_by("lane_number")[lower_bound:upper_bound]

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

    def post(self, request):
        event_id = vh.get_query_param(request, "event_id")
        # ? no "event_id" param passed
        if isinstance(event_id, Response):
            return event_id

        event_of_id = vh.get_model_of_id("Event", event_id)
        # ? no event of event_id exists
        if isinstance(event_of_id, Response):
            return event_of_id

        check_is_host = vh.check_user_is_host(request, event_of_id.session.meet.host_id)
        # ? user is not meet host
        if isinstance(check_is_host, Response):
            return check_is_host

        swimmer_id = vh.get_query_param(request, "swimmer_id")
        # ? no "swimmer_id" param passed
        if isinstance(swimmer_id, Response):
            return swimmer_id

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
        
        check_compatibility = vh.validate_swimmer_against_event(swimmer_of_id, event_of_id)
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
            handle_duplicates = vh.handle_duplicates(duplicate_handling, "Individual_entry", new_individual_entry)
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
            "Individual_entry", new_individual_entry, False
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
        individual_entry_id = vh.get_query_param(request, "individual_entry_id")
        # ? no "individual_entry_id" param passed
        if isinstance(individual_entry_id, Response):
            return individual_entry_id

        individual_entry_of_id = vh.get_model_of_id("Individual_entry", individual_entry_id)
        # ? no individual entry of individual_entry_id exists
        if isinstance(individual_entry_of_id, Response):
            return individual_entry_of_id
        
        check_is_host = vh.check_user_is_host(request, individual_entry_of_id.event.session.meet.host_id)
        # ? user is not meet host
        if isinstance(check_is_host, Response):
            return check_is_host
        
        seeding_needs_invalidation = False

        # * update existing individual_entry
        try:
            edited_individual_entry = Individual_entry.objects.get(id=individual_entry_id)

            if "seed_time" in request.data:
                edited_individual_entry.seed_time = request.data["seed_time"]
                seeding_needs_invalidation = True

            # ! if FK changes are added, validate new swimmer against meet here

            # ! if FK changes are added, check for duplicates here

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
            invalidate_hs_data = vh.invalidate_event_seeding(edited_individual_entry.event)
            # ? internal error invalidating event seeding
            if isinstance(invalidate_hs_data, Response):
                return invalidate_hs_data

        # * get individual_entry JSON
        edited_individual_entry_JSON = vh.get_JSON_single(
            "Individual_entry", edited_individual_entry, False
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

        individual_entry_of_id = vh.get_model_of_id("Individual_entry", individual_entry_id)
        # ? no individual entry of individual_entry_id exists
        if isinstance(individual_entry_of_id, Response):
            return individual_entry_of_id
        
        check_is_host = vh.check_user_is_host(request, individual_entry_of_id.event.session.meet.host_id)
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