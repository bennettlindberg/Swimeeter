from rest_framework.views import APIView, Response
from rest_framework import status

from ..models import Session
from .. import view_helpers as vh

from django.core.exceptions import ValidationError


class Session_view(APIView):
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

        # $ get session(s) specific too...
        match specific_to:
            # $ ...id
            case "id":
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

                # * get session JSON
                session_JSON = vh.get_JSON_single("Session", session_of_id, True)
                # ? internal error generating JSON
                if isinstance(session_JSON, Response):
                    return session_JSON
                else:
                    return Response(
                        session_JSON,
                        status=status.HTTP_200_OK,
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

                check_meet_access = vh.check_meet_access_allowed(request, pool_of_id.meet)
                # ? private meet access not allowed
                if isinstance(check_meet_access, Response):
                    return check_meet_access

                sessions_of_pool = Session.objects.filter(pool_id=pool_id).order_by(
                    "begin_time", "end_time", "name"
                )

                # @ apply search filtering
                search__name = vh.get_query_param(request, "search__name")
                if isinstance(search__name, str):
                    sessions_of_pool = sessions_of_pool.filter(name__istartswith=search__name)

                # * only retrieve request range of values
                sessions_of_pool = sessions_of_pool[lower_bound:upper_bound]

                # * get sessions JSON
                sessions_JSON = vh.get_JSON_multiple("Session", sessions_of_pool, True)
                # ? internal error generating JSON
                if isinstance(sessions_JSON, Response):
                    return sessions_JSON
                else:
                    return Response(
                        sessions_JSON,
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

                sessions_of_meet = Session.objects.filter(meet_id=meet_id).order_by(
                    "begin_time", "end_time", "name"
                )

                # @ apply search filtering
                search__session_name = vh.get_query_param(request, "search__session_name")
                if isinstance(search__session_name, str):
                    sessions_of_meet = sessions_of_meet.filter(name__istartswith=search__session_name)

                search__pool_name = vh.get_query_param(request, "search__pool_name")
                if isinstance(search__pool_name, str):
                    sessions_of_meet = sessions_of_meet.filter(pool__name__istartswith=search__pool_name)

                # * only retrieve request range of values
                sessions_of_meet = sessions_of_meet[lower_bound:upper_bound]

                # * get sessions JSON
                sessions_JSON = vh.get_JSON_multiple("Session", sessions_of_meet, True)
                # ? internal error generating JSON
                if isinstance(sessions_JSON, Response):
                    return sessions_JSON
                else:
                    return Response(
                        sessions_JSON,
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

        # * create new session
        try:
            new_session = Session(
                name=request.data["name"],
                begin_time=request.data["begin_time"],
                end_time=request.data["end_time"],
                meet_id=meet_id,
                pool_id=pool_id,
            )

            # * handle any duplicates
            duplicate_handling = vh.get_duplicate_handling(request)
            handle_duplicates = vh.handle_duplicates(duplicate_handling, "Session", new_session)
            # ? error handling duplicates
            if isinstance(handle_duplicates, Response):
                return handle_duplicates

            new_session.full_clean()
            new_session.save()
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

        # * update meet begin and end times
        if meet_of_id.begin_time is None or meet_of_id.end_time is None:
            meet_of_id.begin_time = new_session.begin_time
            meet_of_id.end_time = new_session.end_time
            meet_of_id.full_clean()
            meet_of_id.save()
        else:
            if new_session.begin_time < meet_of_id.begin_time:
                meet_of_id.begin_time = new_session.begin_time
                meet_of_id.full_clean()
                meet_of_id.save()
            if new_session.end_time > meet_of_id.end_time:
                meet_of_id.end_time = new_session.end_time
                meet_of_id.full_clean()
                meet_of_id.save()

        # * get session JSON
        session_JSON = vh.get_JSON_single("Session", new_session, True)
        # ? internal error generating JSON
        if isinstance(session_JSON, Response):
            return session_JSON
        else:
            return Response(
                session_JSON,
                status=status.HTTP_201_CREATED,
            )

    def put(self, request):
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

        check_is_host = vh.check_user_is_host(request, meet_of_id.host_id)
        # ? user is not meet host
        if isinstance(check_is_host, Response):
            return check_is_host

        # * update existing session
        try:
            edited_session = Session.objects.get(id=session_id)

            if "name" in request.data:
                edited_session.name = request.data["name"]
            if "begin_time" in request.data:
                edited_session.begin_time = request.data["begin_time"]
            if "end_time" in request.data:
                edited_session.end_time = request.data["end_time"]

            # @ update foreign keys
            pool_id = vh.get_query_param(request, "pool_id")
            if isinstance(pool_id, str):
                pool_id = int(pool_id)

                if (pool_id != edited_session.pool_id):
                    pool_of_id = vh.get_model_of_id("Pool", pool_id)
                    # ? no pool of pool_id exists
                    if isinstance(pool_of_id, Response):
                        return pool_of_id
                    
                    edited_session.pool_id = pool_id

            # * handle any duplicates
            duplicate_handling = vh.get_duplicate_handling(request)
            handle_duplicates = vh.handle_duplicates(duplicate_handling, "Session", edited_session)
            # ? error handling duplicates
            if isinstance(handle_duplicates, Response):
                return handle_duplicates

            edited_session.full_clean()
            edited_session.save()
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

        meet_of_id = vh.get_model_of_id("Meet", session_of_id.meet_id)
        # ? no meet of meet_id exists
        if isinstance(meet_of_id, Response):
            return meet_of_id

        # * update meet begin and end times
        if edited_session.begin_time < meet_of_id.begin_time:
            meet_of_id.begin_time = edited_session.begin_time
            meet_of_id.full_clean()
            meet_of_id.save()
        if edited_session.end_time > meet_of_id.end_time:
            meet_of_id.end_time = edited_session.end_time
            meet_of_id.full_clean()
            meet_of_id.save()

        # * get session JSON
        session_JSON = vh.get_JSON_single("Session", edited_session, True)
        # ? internal error generating JSON
        if isinstance(session_JSON, Response):
            return session_JSON
        else:
            return Response(
                session_JSON,
                status=status.HTTP_200_OK,
            )

    def delete(self, request):
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

        # ~ required for updating meet begin and end times
        meet_of_id = vh.get_model_of_id("Meet", session_of_id.meet_id)
        # ? no meet of meet_id exists
        if isinstance(meet_of_id, Response):
            return meet_of_id

        # * update meet begin and end times
        remaining_sessions = Session.objects.filter(
            meet_id=session_of_id.meet_id
        ).exclude(id=session_of_id.pk)
        
        if remaining_sessions.count() == 0:
            meet_of_id.begin_time = None
            meet_of_id.end_time = None

            meet_of_id.full_clean()
            meet_of_id.save()
        else:
            earliest_session = remaining_sessions.order_by("begin_time")[:1][0]
            meet_of_id.begin_time = earliest_session.begin_time
            latest_session = remaining_sessions.order_by("-end_time")[:1][0]
            meet_of_id.end_time = latest_session.end_time

            meet_of_id.full_clean()
            meet_of_id.save()

        # * delete existing session
        try:
            session_of_id.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        # ? internal error deleting model
        except Exception as err:
            return Response(
                str(err),
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
