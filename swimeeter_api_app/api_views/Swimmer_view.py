from rest_framework.views import APIView, Response
from rest_framework import status

from ..models import Swimmer
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
            # * format middle initials ("ABC" -> "A B C")
            formatted_mi = ""
            if "middle_initials" in request.data and request.data["middle_initials"] is not None:
                for initial in request.data["middle_initials"]:
                    formatted_mi += initial + " "
                formatted_mi = formatted_mi[:-1] # remove trailing space

            new_swimmer = Swimmer(
                first_name=request.data["first_name"],
                last_name=request.data["last_name"],
                prefix=request.data["prefix"],
                suffix=request.data["suffix"],
                middle_initials=formatted_mi,
                age=request.data["age"],
                gender=request.data["gender"],
                team_name=request.data["team_name"],
                team_acronym=request.data["team_acronym"],
                meet_id=meet_id,
            )

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
                # * format middle initials ("ABC" -> "A B C")
                formatted_mi = ""
                if request.data["middle_initials"] is not None:
                    for initial in request.data["middle_initials"]:
                        formatted_mi += initial + " "
                    formatted_mi = formatted_mi[:-1] # remove trailing space
                edited_swimmer.middle_initials = formatted_mi

            if "age" in request.data:
                edited_swimmer.age = request.data["age"]
            if "gender" in request.data:
                edited_swimmer.gender = request.data["gender"]
            if "team_name" in request.data:
                edited_swimmer.team_name = request.data["team_name"]
            if "team_acronym" in request.data:
                edited_swimmer.team_acronym = request.data["team_acronym"]

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
