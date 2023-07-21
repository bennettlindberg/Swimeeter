from rest_framework.views import APIView, Response
from rest_framework import status

from ..models import Pool, Session
from .. import view_helpers as vh

from django.core.exceptions import ValidationError


class Pool_view(APIView):
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

        # $ get pool(s) specific too...
        match specific_to:
            # $ ...id
            case "id":
                pool_id = vh.get_query_param(request, "pool_id")
                # ? no "pool_id" param passed
                if isinstance(pool_id, Response):
                    return pool_id

                pool_of_id = vh.get_model_of_id("pool", pool_id)
                # ? no pool of pool_id exists
                if isinstance(pool_of_id, Response):
                    return pool_of_id

                check_meet_access = vh.check_meet_access_allowed(
                    request, pool_of_id.meet
                )
                # ? private meet access not allowed
                if isinstance(check_meet_access, Response):
                    return check_meet_access

                # * get pool JSON
                pool_JSON = vh.get_JSON_single("pool", pool_of_id, True)
                # ? internal error generating JSON
                if isinstance(pool_JSON, Response):
                    return pool_JSON
                else:
                    return Response(
                        pool_JSON,
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

                pools_of_meet = Pool.objects.filter(meet_id=meet_id).order_by(
                    "name"
                )[lower_bound:upper_bound]

                # * get pools JSON
                pools_JSON = vh.get_JSON_multiple("pool", pools_of_meet, True)
                # ? internal error generating JSON
                if isinstance(pools_JSON, Response):
                    return pools_JSON
                else:
                    return Response(
                        pools_JSON,
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

        # * create new pool
        try:
            new_pool = Pool(
                name=request.data["name"],
                street_address=request.data["street_address"],
                city=request.data["city"],
                state=request.data["state"],
                country=request.data["country"],
                zipcode=request.data["zipcode"],
                lanes=request.data["lanes"],
                side_length=request.data["side_length"],
                measure_unit=request.data["measure_unit"],
                meet_id=meet_id,
            )

            # * handle any duplicates
            duplicate_handling = vh.get_duplicate_handling(request)
            handle_duplicates = vh.handle_duplicates(duplicate_handling, "pool", new_pool)
            # ? error handling duplicates
            if isinstance(handle_duplicates, Response):
                return handle_duplicates

            new_pool.full_clean()
            new_pool.save()
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

        # * get pool JSON
        pool_JSON = vh.get_JSON_single("pool", new_pool, False)
        # ? internal error generating JSON
        if isinstance(pool_JSON, Response):
            return pool_JSON
        else:
            return Response(
                pool_JSON,
                status=status.HTTP_201_CREATED,
            )

    def put(self, request):
        pool_id = vh.get_query_param(request, "pool_id")
        # ? no "pool_id" param passed
        if isinstance(pool_id, Response):
            return pool_id

        pool_of_id = vh.get_model_of_id("pool", pool_id)
        # ? no pool of pool_id exists
        if isinstance(pool_of_id, Response):
            return pool_of_id

        check_is_host = vh.check_user_is_host(request, meet_of_id.host_id)
        # ? user is not meet host
        if isinstance(check_is_host, Response):
            return check_is_host

        # * update existing pool
        try:
            edited_pool = Pool.objects.get(id=pool_id)

            if "name" in request.data:
                edited_pool.name = request.data["name"]
            if "street_address" in request.data:
                edited_pool.street_address=request.data["street_address"]
            if "city" in request.data:
                edited_pool.city=request.data["city"]
            if "state" in request.data:
                edited_pool.state=request.data["state"]
            if "country" in request.data:
                edited_pool.country=request.data["country"]
            if "zipcode" in request.data:
                edited_pool.zipcode=request.data["zipcode"]
            if "lanes" in request.data:
                edited_pool.lanes=request.data["lanes"]
            if "side_length" in request.data:
                edited_pool.side_length=request.data["side_length"]
            if "measure_unit" in request.data:
                edited_pool.measure_unit=request.data["measure_unit"]

            # * handle any duplicates
            duplicate_handling = vh.get_duplicate_handling(request)
            handle_duplicates = vh.handle_duplicates(duplicate_handling, "pool", edited_pool)
            # ? error handling duplicates
            if isinstance(handle_duplicates, Response):
                return handle_duplicates

            edited_pool.full_clean()
            edited_pool.save()
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

        # * get pool JSON
        pool_JSON = vh.get_JSON_single("pool", edited_pool, False)
        # ? internal error generating JSON
        if isinstance(pool_JSON, Response):
            return pool_JSON
        else:
            return Response(
                pool_JSON,
                status=status.HTTP_200_OK,
            )

    def delete(self, request):
        pool_id = vh.get_query_param(request, "pool_id")
        # ? no "pool_id" param passed
        if isinstance(pool_id, Response):
            return pool_id

        pool_of_id = vh.get_model_of_id("pool", pool_id)
        # ? no pool of pool_id exists
        if isinstance(pool_of_id, Response):
            return pool_of_id

        check_is_host = vh.check_user_is_host(request, pool_of_id.meet.host_id)
        # ? user is not meet host
        if isinstance(check_is_host, Response):
            return check_is_host
        
        sessions_of_pool = Session.objects.filter(pool_id=pool_id)
        # ? sessions associated with pool exist
        if sessions_of_pool.count() > 0:
            return Response(
                "cannot delete pool with associated sessions",
                status=status.HTTP_400_BAD_REQUEST,
            )

        # * delete existing pool
        try:
            pool_of_id.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        # ? internal error deleting model
        except Exception as err:
            return Response(
                str(err),
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
