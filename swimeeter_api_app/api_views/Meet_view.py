from rest_framework.views import APIView, Response
from rest_framework import status

from ..models import Meet
from .. import view_helpers as vh

from django.core.exceptions import ValidationError


class Meet_view(APIView):
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

        # $ get meets(s) specific too...
        match specific_to:
            # $ ...id
            case "id":
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

                # * get meet JSON
                meet_JSON = vh.get_JSON_single("Meet", meet_of_id, True)
                # ? internal error generating JSON
                if isinstance(meet_JSON, Response):
                    return meet_JSON
                else:
                    return Response(
                        meet_JSON,
                        status=status.HTTP_200_OK,
                    )

            # $ ...host
            case "host":
                host_id = vh.get_query_param(request, "host_id")
                # ? no "host_id" param passed
                if isinstance(host_id, Response):
                    return host_id
                else:
                    host_id = int(host_id)

                host_of_id = vh.get_model_of_id("Host", host_id)
                # ? no host of host_id exists
                if isinstance(host_of_id, Response):
                    return host_of_id

                # * determine if logged in as host
                if request.user.is_authenticated and host_id == request.user.id:
                    meets_of_host = Meet.objects.filter(host_id=host_id).order_by(
                        "-begin_time", "-end_time", "name"
                    )
                else:  # ! only include public meets for non-host viewers
                    meets_of_host = Meet.objects.filter(
                        host_id=host_id, is_public=True
                    ).order_by("-begin_time", "-end_time", "name")

                # @ apply search filtering
                search__name = vh.get_query_param(request, "search__name")
                if isinstance(search__name, str):
                    meets_of_host = meets_of_host.filter(name__istartswith=search__name)

                # * only retrieve request range of values
                meets_of_host = meets_of_host[lower_bound:upper_bound]

                # * get meets JSON
                meets_JSON = vh.get_JSON_multiple("Meet", meets_of_host, True)
                # ? internal error generating JSON
                if isinstance(meets_JSON, Response):
                    return meets_JSON
                else:
                    return Response(
                        meets_JSON,
                        status=status.HTTP_200_OK,
                    )

            # $ ...all
            case "all":
                meets_of_all = Meet.objects.filter(is_public=True).order_by(
                    "-begin_time", "-end_time", "name"
                )

                # @ apply search filtering
                search__name = vh.get_query_param(request, "search__name")
                if isinstance(search__name, str):
                    meets_of_all = meets_of_all.filter(name__istartswith=search__name)

                # * only retrieve request range of values
                meets_of_all = meets_of_all[lower_bound:upper_bound]

                # * get meets JSON
                meets_JSON = vh.get_JSON_multiple("Meet", meets_of_all, True)
                # ? internal error generating JSON
                if isinstance(meets_JSON, Response):
                    return meets_JSON
                else:
                    return Response(
                        meets_JSON,
                        status=status.HTTP_200_OK,
                    )

            # ? invalid "specific_to" specification
            case _:
                return Response(
                    "invalid 'specific_to' specification",
                    status=status.HTTP_400_BAD_REQUEST,
                )

    def post(self, request):
        check_logged_in = vh.check_user_logged_in(request)
        # ? user is not logged in
        if isinstance(check_logged_in, Response):
            return check_logged_in

        # * create new meet
        try:
            new_meet = Meet(
                name=request.data["name"],
                # begin_time => null,
                # end_time => null,
                is_public=request.data["is_public"],
                host_id=request.user.id,
            )

            # * handle any duplicates
            duplicate_handling = vh.get_duplicate_handling(request)
            handle_duplicates = vh.handle_duplicates(
                duplicate_handling, "Meet", new_meet
            )
            # ? error handling duplicates
            if isinstance(handle_duplicates, Response):
                return handle_duplicates

            new_meet.full_clean()
            new_meet.save()
        except ValidationError as err:
            # ? invalid creation data passed -> validators
            print(err)

            return Response(
                "; ".join(err.messages),
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception as err:
            # ? invalid creation data passed -> general
            print(err)

            return Response(
                str(err),
                status=status.HTTP_400_BAD_REQUEST,
            )

        # * get meet JSON
        meet_JSON = vh.get_JSON_single("Meet", new_meet, False)
        # ? internal error generating JSON
        if isinstance(meet_JSON, Response):
            return meet_JSON
        else:
            return Response(
                meet_JSON,
                status=status.HTTP_201_CREATED,
            )

    def put(self, request):
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

        # * update existing meet
        try:
            edited_meet = Meet.objects.get(id=meet_id)

            if "name" in request.data:
                edited_meet.name = request.data["name"]
            if "is_public" in request.data:
                edited_meet.is_public = request.data["is_public"]

            # * handle any duplicates
            duplicate_handling = vh.get_duplicate_handling(request)
            handle_duplicates = vh.handle_duplicates(
                duplicate_handling, "Meet", edited_meet
            )
            # ? error handling duplicates
            if isinstance(handle_duplicates, Response):
                return handle_duplicates

            edited_meet.full_clean()
            edited_meet.save()
        except ValidationError as err:
            # ? invalid update data passed -> validators
            return Response(
                "; ".join(err.messages),
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception as err:
            # ? invalid update data passed -> general
            return Response(
                str(err),
                status=status.HTTP_400_BAD_REQUEST,
            )

        # * get meet JSON
        meet_JSON = vh.get_JSON_single("Meet", edited_meet, False)
        # ? internal error generating JSON
        if isinstance(meet_JSON, Response):
            return meet_JSON
        else:
            return Response(
                meet_JSON,
                status=status.HTTP_200_OK,
            )

    def delete(self, request):
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

        # * delete existing meet
        try:
            meet_of_id.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        # ? internal error deleting model
        except Exception as err:
            return Response(
                str(err),
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
