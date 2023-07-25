from rest_framework.views import APIView, Response
from rest_framework import status

from ..models import Swimmer, Individual_entry, Relay_entry
from .. import view_helpers as vh

from django.core.exceptions import ValidationError


class Swimmer_view(APIView):
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

        # $ get swimmer(s) specific too...
        match specific_to:
            # $ ...id
            case "id":
                swimmer_id = vh.get_query_param(request, "swimmer_id")
                # ? no "swimmer_id" param passed
                if isinstance(swimmer_id, Response):
                    return swimmer_id

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

                # * get swimmer JSON
                swimmer_JSON = vh.get_JSON_single("Swimmer", swimmer_of_id, True)
                # ? internal error generating JSON
                if isinstance(swimmer_JSON, Response):
                    return swimmer_JSON
                else:
                    return Response(
                        swimmer_JSON,
                        status=status.HTTP_200_OK,
                    )

            # $ ...meet
            case "meet":
                meet_id = vh.get_query_param(request, "meet_id")
                # ? no "meet_id" param passed
                if isinstance(meet_id, Response):
                    return meet_id

                meet_of_id = vh.get_model_of_id("Meet", meet_id)
                # ? no meet of meet_id exists
                if isinstance(meet_of_id, Response):
                    return meet_of_id

                check_meet_access = vh.check_meet_access_allowed(request, meet_of_id)
                # ? private meet access not allowed
                if isinstance(check_meet_access, Response):
                    return check_meet_access

                swimmers_of_meet = Swimmer.objects.filter(meet_id=meet_id).order_by('last_name', 'first_name')[
                    lower_bound:upper_bound
                ]

                # * get swimmers JSON
                swimmers_JSON = vh.get_JSON_multiple("Swimmer", swimmers_of_meet, True)
                # ? internal error generating JSON
                if isinstance(swimmers_JSON, Response):
                    return swimmers_JSON
                else:
                    return Response(
                        swimmers_JSON,
                        status=status.HTTP_200_OK,
                    )

            # ? invalid "specific_to" specification
            case _:
                return Response(
                    "invalid 'specific_to' specification",
                    status=status.HTTP_400_BAD_REQUEST,
                )

    def post(self, request):
        meet_id = vh.get_query_param(request, "meet_id")
        # ? no "meet_id" param passed
        if isinstance(meet_id, Response):
            return meet_id

        meet_of_id = vh.get_model_of_id("Meet", meet_id)
        # ? no meet of meet_id exists
        if isinstance(meet_of_id, Response):
            return meet_of_id

        check_is_host = vh.check_user_is_host(request, meet_of_id.host_id)
        # ? user is not meet host
        if isinstance(check_is_host, Response):
            return check_is_host

        # * create new swimmer
        try:
            new_swimmer = Swimmer(
                first_name=request.data["first_name"],
                last_name=request.data["last_name"],
                prefix=request.data["prefix"],
                suffix=request.data["suffix"],
                middle_initials=request.data["middle_initials"],
                age=request.data["age"],
                gender=request.data["gender"],
                team_name=request.data["team_name"],
                team_acronym=request.data["team_acronym"],
                meet_id=meet_id,
            )

            # * handle any duplicates
            duplicate_handling = vh.get_duplicate_handling(request)
            handle_duplicates = vh.handle_duplicates(duplicate_handling, "Swimmer", new_swimmer)
            # ? error handling duplicates
            if isinstance(handle_duplicates, Response):
                return handle_duplicates

            new_swimmer.full_clean()
            new_swimmer.save()
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

        # * get swimmer JSON
        swimmer_JSON = vh.get_JSON_single("Swimmer", new_swimmer, False)
        # ? internal error generating JSON
        if isinstance(swimmer_JSON, Response):
            return swimmer_JSON
        else:
            return Response(
                swimmer_JSON,
                status=status.HTTP_201_CREATED,
            )

    def put(self, request):
        swimmer_id = vh.get_query_param(request, "swimmer_id")
        # ? no "swimmer_id" param passed
        if isinstance(swimmer_id, Response):
            return swimmer_id

        swimmer_of_id = vh.get_model_of_id("Swimmer", swimmer_id)
        # ? no swimmer of swimmer_id exists
        if isinstance(swimmer_of_id, Response):
            return swimmer_of_id

        check_is_host = vh.check_user_is_host(request, swimmer_of_id.meet.host_id)
        # ? user is not meet host
        if isinstance(check_is_host, Response):
            return check_is_host

        # * update existing swimmer
        try:
            edited_swimmer = Swimmer.objects.get(id=swimmer_id)

            if "first_name" in request.data:
                edited_swimmer.first_name = request.data["first_name"]
            if "last_name" in request.data:
                edited_swimmer.last_name = request.data["last_name"]
            if "prefix" in request.data:
                edited_swimmer.prefix = request.data["prefix"]
            if "suffix" in request.data:
                edited_swimmer.suffix = request.data["suffix"]
            if "middle_initials" in request.data:
                edited_swimmer.middle_initials = request.data["middle_initials"]
            if "age" in request.data:
                edited_swimmer.age = request.data["age"]
            if "gender" in request.data:
                edited_swimmer.gender = request.data["gender"]
            if "team_name" in request.data:
                edited_swimmer.team_name = request.data["team_name"]
            if "team_acronym" in request.data:
                edited_swimmer.team_acronym = request.data["team_acronym"]

            # * handle any duplicates
            duplicate_handling = vh.get_duplicate_handling(request)
            handle_duplicates = vh.handle_duplicates(duplicate_handling, "Swimmer", edited_swimmer)
            # ? error handling duplicates
            if isinstance(handle_duplicates, Response):
                return handle_duplicates

            edited_swimmer.full_clean()
            edited_swimmer.save()
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
        
        # * delete newly incompatible entries and invalidate event seeding
        relay_entries_of_swimmer = Relay_entry.objects.filter(swimmers__in=[edited_swimmer.pk])
        for entry in relay_entries_of_swimmer:
            check_compatibility = vh.validate_swimmer_against_event(edited_swimmer, entry.event)
            # ? swimmer and event are not compatible
            if isinstance(check_compatibility, Response):
                # * invalidate event seeding
                invalidate_hs_data = vh.invalidate_event_seeding(entry.event)
                # ? internal error invalidating event seeding
                if isinstance(invalidate_hs_data, Response):
                    return invalidate_hs_data
                
                entry.delete()

        individual_entries_of_swimmer = Individual_entry.objects.filter(swimmer_id=edited_swimmer.pk)
        for entry in individual_entries_of_swimmer:
            check_compatibility = vh.validate_swimmer_against_event(edited_swimmer, entry.event)
            # ? swimmer and event are not compatible
            if isinstance(check_compatibility, Response):
                # * invalidate event seeding
                invalidate_hs_data = vh.invalidate_event_seeding(entry.event)
                # ? internal error invalidating event seeding
                if isinstance(invalidate_hs_data, Response):
                    return invalidate_hs_data
                
                entry.delete()

        # * get swimmer JSON
        swimmer_JSON = vh.get_JSON_single("Swimmer", edited_swimmer, False)
        # ? internal error generating JSON
        if isinstance(swimmer_JSON, Response):
            return swimmer_JSON
        else:
            return Response(
                swimmer_JSON,
                status=status.HTTP_200_OK,
            )

    def delete(self, request):
        swimmer_id = vh.get_query_param(request, "swimmer_id")
        # ? no "swimmer_id" param passed
        if isinstance(swimmer_id, Response):
            return swimmer_id

        swimmer_of_id = vh.get_model_of_id("Swimmer", swimmer_id)
        # ? no swimmer of swimmer_id exists
        if isinstance(swimmer_of_id, Response):
            return swimmer_of_id

        check_is_host = vh.check_user_is_host(request, swimmer_of_id.meet.host_id)
        # ? user is not meet host
        if isinstance(check_is_host, Response):
            return check_is_host

        # * delete existing swimmer
        try:
            swimmer_of_id.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        # ? internal error deleting model
        except Exception as err:
            return Response(
                str(err),
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
