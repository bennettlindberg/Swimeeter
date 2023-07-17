from rest_framework.views import APIView, Response
from rest_framework import status

from django.core.serializers import serialize
import json

from ..models import Session, Meet

from django.core.exceptions import ValidationError


class Session_view(APIView):
    def get(self, request):
        specific_to = request.query_params.get("specific_to")

        # set record range
        upper_bound_str = request.query_params.get("upper_bound")
        if upper_bound_str is not None:
            upper_bound = int(upper_bound_str)

        lower_bound_str = request.query_params.get("lower_bound")
        if lower_bound_str is not None:
            lower_bound = int(lower_bound_str)

        # get all events for a specific...
        match specific_to:
            case "id":
                session_id = request.query_params.get("session_id")
                # ? no session id passed
                if session_id is None:
                    return Response(
                        {"get_success": False, "reason": "no session id passed"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                try:
                    session_of_id = Session.objects.get(id=session_id)
                except:
                    # ? no session with the given id exists
                    return Response(
                        {
                            "get_success": False,
                            "reason": "no session with the given id exists",
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                
                # ? meet is private and not logged into host account
                if not session_of_id.meet.is_public:
                    if not request.user.is_authenticated:
                        return Response(
                            {
                                "get_success": False,
                                "reason": "meet is private and not logged into host account",
                            },
                            status=status.HTTP_401_UNAUTHORIZED,
                        )
                    elif session_of_id.meet.host_id != request.user.id:
                        return Response(
                            {
                                "get_success": False,
                                "reason": "meet is private and not logged into host account",
                            },
                            status=status.HTTP_403_FORBIDDEN,
                        )

                # * get session JSON
                session_of_id_JSON = json.loads(
                    serialize(
                        "json",
                        [session_of_id],
                        fields=[
                            "name",
                            "begin_time",
                            "end_time",
                            "meet",
                        ],
                    )
                )[0]

                # * get FK meet JSON
                session_of_id__meet = Meet.objects.get(id=session_of_id.meet_id)
                session_of_id__meet_JSON = json.loads(
                    serialize(
                        "json",
                        [session_of_id__meet],
                        fields=[
                            "name",
                            "begin_time",
                            "end_time",
                            "is_public",
                            "lanes",
                            "side_length",
                            "measure_unit",
                            "host",
                        ],
                    )
                )[0]
                session_of_id_JSON["fields"]["meet"] = session_of_id__meet_JSON

                return Response({"get_success": True, "data": session_of_id_JSON})

            case "meet":
                meet_id = request.query_params.get("meet_id")
                # ? no meet id passed
                if meet_id is None:
                    return Response(
                        {"get_success": False, "reason": "no meet id passed"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                try:
                    meet_of_id = Meet.objects.get(id=meet_id)
                except:
                    # ? no meet with the given id exists
                    return Response(
                        {
                            "post_success": False,
                            "reason": "no meet with the given id exists",
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                
                # ? meet is private and not logged into host account
                if not meet_of_id.is_public:
                    if not request.user.is_authenticated:
                        return Response(
                            {
                                "get_success": False,
                                "reason": "meet is private and not logged into host account",
                            },
                            status=status.HTTP_401_UNAUTHORIZED,
                        )
                    elif meet_of_id.host_id != request.user.id:
                        return Response(
                            {
                                "get_success": False,
                                "reason": "meet is private and not logged into host account",
                            },
                            status=status.HTTP_403_FORBIDDEN,
                        )

                # * get sessions JSON
                sessions_of_meet = Session.objects.filter(meet_id=meet_id).order_by('begin_time', 'end_time')[
                    lower_bound:upper_bound
                ]
                sessions_of_meet_JSON = json.loads(
                    serialize(
                        "json",
                        sessions_of_meet,
                        fields=[
                            "name",
                            "begin_time",
                            "end_time",
                            "meet",
                        ],
                    )
                )

                # * get FK meet JSON
                sessions_of_meet__meet_JSON = json.loads(
                    serialize(
                        "json",
                        [meet_of_id],
                        fields=[
                            "name",
                            "begin_time",
                            "end_time",
                            "is_public",
                            "lanes",
                            "side_length",
                            "measure_unit",
                            "host",
                        ],
                    )
                )[0]
                for session_JSON in sessions_of_meet_JSON:
                    session_JSON["fields"]["meet"] = sessions_of_meet__meet_JSON

                return Response({"get_success": True, "data": sessions_of_meet_JSON})

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
        # ? not logged in
        if not request.user.is_authenticated:
            return Response(
                {"post_success": False, "reason": "not logged in"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        meet_id = request.query_params.get("meet_id")
        # ? no meet id passed
        if meet_id is None:
            return Response(
                {"post_success": False, "reason": "no meet id passed"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            meet_of_id = Meet.objects.get(id=meet_id)
        except:
            # ? no meet with the given id exists
            return Response(
                {"post_success": False, "reason": "no meet with the given id exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        meet_host_id = meet_of_id.host_id
        # ? not logged into meet host account
        if request.user.id != meet_host_id:
            return Response(
                {"post_success": False, "reason": "not logged into meet host account"},
                status=status.HTTP_403_FORBIDDEN,
            )

        try:
            new_session = Session(
                name=request.data["name"],
                begin_time=request.data["begin_time"],
                end_time=request.data["end_time"],
                meet_id=meet_id,
            )
            new_session.full_clean()
            new_session.save()
        except ValidationError as err:
            # ? invalid creation data passed -> validators
            return Response(
                {"post_success": False, "reason": "; ".join(err.messages)},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception as err:
            # ? invalid creation data passed -> general
            return Response(
                {"post_success": False, "reason": str(err)},
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

        new_session_JSON = json.loads(
            serialize(
                "json",
                [new_session],
                fields=[
                    "name",
                    "begin_time",
                    "end_time",
                    "meet",
                ],
            )
        )[0]
        return Response({"post_success": True, "data": new_session_JSON})

    def put(self, request):
        # ? not logged in
        if not request.user.is_authenticated:
            return Response(
                {"put_success": False, "reason": "not logged in"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        session_id = request.query_params.get("session_id")
        # ? no session id passed
        if session_id is None:
            return Response(
                {"put_success": False, "reason": "no session id passed"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            session_of_id = Session.objects.get(id=session_id)
        except:
            # ? no session with the given id exists
            return Response(
                {"put_success": False, "reason": "no session with the given id exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        session_meet_host_id = session_of_id.meet.host_id
        # ? not logged into meet host account
        if request.user.id != session_meet_host_id:
            return Response(
                {
                    "put_success": False,
                    "reason": "not logged into meet host account",
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        try:
            edited_session = Session.objects.get(id=session_id)

            if "name" in request.data:
                edited_session.name = request.data["name"]
            if "begin_time" in request.data:
                edited_session.begin_time = request.data["begin_time"]
            if "end_time" in request.data:
                edited_session.end_time = request.data["end_time"]

            edited_session.full_clean()
            edited_session.save()
        except ValidationError as err:
            # ? invalid update data passed -> validators
            return Response(
                {"put_success": False, "reason": "; ".join(err.messages)},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception as err:
            # ? invalid update data passed -> general
            return Response(
                {"put_success": False, "reason": str(err)},
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        meet_of_id = Meet.objects.get(id=edited_session.meet_id)
        # * update meet begin and end times
        if edited_session.begin_time < meet_of_id.begin_time:
            meet_of_id.begin_time = edited_session.begin_time
            meet_of_id.full_clean()
            meet_of_id.save()
        if edited_session.end_time > meet_of_id.end_time:
            meet_of_id.end_time = edited_session.end_time
            meet_of_id.full_clean()
            meet_of_id.save()

        edited_session_JSON = json.loads(
            serialize(
                "json",
                [edited_session],
                fields=[
                    "name",
                    "begin_time",
                    "end_time",
                    "meet",
                ],
            )
        )[0]
        return Response({"put_success": True, "data": edited_session_JSON})

    def delete(self, request):
        # ? not logged in
        if not request.user.is_authenticated:
            return Response(
                {"put_success": False, "reason": "not logged in"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        session_id = request.query_params.get("session_id")
        # ? no session id passed
        if session_id is None:
            return Response(
                {"put_success": False, "reason": "no session id passed"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            session_of_id = Session.objects.get(id=session_id)
        except:
            # ? no session with the given id exists
            return Response(
                {"put_success": False, "reason": "no session with the given id exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        session_meet_host_id = session_of_id.meet.host_id
        # ? not logged into meet host account
        if request.user.id != session_meet_host_id:
            return Response(
                {
                    "put_success": False,
                    "reason": "not logged into meet host account",
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        session_meet_id = session_of_id.meet_id
        session_of_id.delete()

        meet_of_id = Meet.objects.get(id=session_of_id.meet_id)
        remaining_sessions_of_meet = Session.objects.filter(meet_id=session_meet_id)
        # * update meet begin and end times
        if remaining_sessions_of_meet.count() == 0:
            meet_of_id.begin_time = None
            meet_of_id.end_time = None

            meet_of_id.full_clean()
            meet_of_id.save()
        else:
            earliest_session = remaining_sessions_of_meet.order_by('begin_time')[:1][0]
            meet_of_id.begin_time = earliest_session.begin_time
            latest_session = remaining_sessions_of_meet.order_by('-end_time')[:1][0]
            meet_of_id.end_time = latest_session.end_time

            meet_of_id.full_clean()
            meet_of_id.save()

        return Response({"delete_success": True})
