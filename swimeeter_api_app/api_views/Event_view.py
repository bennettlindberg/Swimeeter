from rest_framework.views import APIView, Response
from rest_framework import status

from django.core.serializers import serialize
import json

from ..models import Event, Session, Meet

from django.core.exceptions import ValidationError


class Event_view(APIView):
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
                event_id = request.query_params.get("event_id")
                # ? no event id passed
                if event_id is None:
                    return Response(
                        {"get_success": False, "reason": "no event id passed"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                try:
                    event_of_id = Event.objects.get(id=event_id)
                except:
                    # ? no event with the given id exists
                    return Response(
                        {
                            "get_success": False,
                            "reason": "no event with the given id exists",
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                # * get event JSON
                event_of_id_JSON = json.loads(
                    serialize(
                        "json",
                        [event_of_id],
                        fields=[
                            "stroke",
                            "distance",
                            "is_relay",
                            "swimmers_per_entry",
                            "competing_gender",
                            "competing_max_age",
                            "competing_min_age",
                            "order_in_session",
                            "total_heats",
                            "session",
                        ],
                    )
                )[0]

                # * get FK session JSON
                event_of_id__session = Session.objects.get(id=event_of_id.session_id)
                event_of_id__session_JSON = json.loads(
                    serialize(
                        "json",
                        [event_of_id__session],
                        fields=[
                            "name",
                            "begin_time",
                            "end_time",
                            "meet",
                        ],
                    )
                )[0]
                event_of_id_JSON["fields"]["session"] = event_of_id__session_JSON

                return Response({"get_success": True, "data": event_of_id_JSON})

            case "session":
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
                            "post_success": False,
                            "reason": "no session with the given id exists",
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                # * get events JSON
                events_of_session = Event.objects.filter(
                    session_id=session_id
                ).order_by("order_in_session")[lower_bound:upper_bound]
                events_of_session_JSON = json.loads(
                    serialize(
                        "json",
                        events_of_session,
                        fields=[
                            "stroke",
                            "distance",
                            "is_relay",
                            "swimmers_per_entry",
                            "competing_gender",
                            "competing_max_age",
                            "competing_min_age",
                            "order_in_session",
                            "total_heats",
                            "session",
                        ],
                    )
                )

                # * get FK session JSON
                events_of_session__session_JSON = json.loads(
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
                for event_JSON in events_of_session_JSON:
                    event_JSON["fields"]["session"] = events_of_session__session_JSON

                return Response({"get_success": True, "data": events_of_session_JSON})

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

                # * get events JSON
                events_of_meet = Event.objects.filter(
                    session__meet_id=meet_id
                ).order_by(
                    "stroke", "distance", "competing_min_age", "competing_gender"
                )[
                    lower_bound:upper_bound
                ]
                events_of_meet_JSON = json.loads(
                    serialize(
                        "json",
                        events_of_meet,
                        fields=[
                            "stroke",
                            "distance",
                            "is_relay",
                            "swimmers_per_entry",
                            "competing_gender",
                            "competing_max_age",
                            "competing_min_age",
                            "order_in_session",
                            "total_heats",
                            "session",
                        ],
                    )
                )

                # * get FK sessions JSON
                for event_JSON in events_of_meet_JSON:
                    event_of_meet__session = Session.objects.get(
                        id=event_JSON["fields"]["session"]
                    )
                    event_of_meet__session_JSON = json.loads(
                        serialize(
                            "json",
                            [event_of_meet__session],
                            fields=[
                                "name",
                                "begin_time",
                                "end_time",
                                "meet",
                            ],
                        )
                    )[0]

                    event_JSON["fields"]["session"] = event_of_meet__session_JSON

                return Response({"get_success": True, "data": events_of_meet_JSON})

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

        session_id = request.query_params.get("session_id")
        # ? no session id passed
        if session_id is None:
            return Response(
                {"post_success": False, "reason": "no session id passed"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            session_of_id = Session.objects.get(id=session_id)
        except:
            # ? no session with the given id exists
            return Response(
                {
                    "post_success": False,
                    "reason": "no session with the given id exists",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        meet_host_id = session_of_id.meet.host_id
        # ? not logged into meet host account
        if request.user.id != meet_host_id:
            return Response(
                {"post_success": False, "reason": "not logged into meet host account"},
                status=status.HTTP_403_FORBIDDEN,
            )

        try:
            if "order_in_session" in request.data:
                order_number = request.data["order_in_session"]
            else:
                order_number = (
                    Event.objects.filter(session_id=session_id)
                    .order_by("-order_in_session")[:1][0]
                    .order_in_session
                    + 1
                )

            new_event = Event(
                stroke=request.data["stroke"],
                distance=request.data["distance"],
                is_relay=request.data["is_relay"],
                swimmers_per_entry=request.data["swimmers_per_entry"],
                competing_gender=request.data["competing_gender"],
                competing_max_age=request.data["competing_max_age"],
                competing_min_age=request.data["competing_min_age"],
                order_in_session=order_number,
                # total_heats => null
                session_id=session_id,
            )
            new_event.full_clean()
            new_event.save()
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

        # * move event order numbers forward
        if "order_in_session" in request.data:
            order_shifted_events = Event.objects.filter(
                session_id=session_id, order_in_session__gte=order_number
            ).exclude(id=new_event.id)

            for event in order_shifted_events:
                event.order_in_session += 1
                event.save()

        new_event_JSON = json.loads(
            serialize(
                "json",
                [new_event],
                fields=[
                    "stroke",
                    "distance",
                    "is_relay",
                    "swimmers_per_entry",
                    "competing_gender",
                    "competing_max_age",
                    "competing_min_age",
                    "order_in_session",
                    "total_heats",
                    "session",
                ],
            )
        )[0]
        return Response({"post_success": True, "data": new_event_JSON})

    def put(self, request):
        # ? not logged in
        if not request.user.is_authenticated:
            return Response(
                {"put_success": False, "reason": "not logged in"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        event_id = request.query_params.get("event_id")
        # ? no event id passed
        if event_id is None:
            return Response(
                {"put_success": False, "reason": "no event id passed"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            event_of_id = Event.objects.get(id=event_id)
        except:
            # ? no event with the given id exists
            return Response(
                {"put_success": False, "reason": "no event with the given id exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        meet_host_id = event_of_id.session.meet.host_id
        # ? not logged into meet host account
        if request.user.id != meet_host_id:
            return Response(
                {
                    "put_success": False,
                    "reason": "not logged into meet host account",
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        try:
            current_highest_order_number = (
                Event.objects.filter(session_id=event_of_id.session_id)
                .order_by("-order_in_session")[:1][0]
                .order_in_session
            )

            edited_event = Event.objects.get(id=event_id)

            if "stroke" in request.data:
                edited_event.stroke = request.data["stroke"]
            if "distance" in request.data:
                edited_event.distance = request.data["distance"]
            if "is_relay" in request.data:
                edited_event.is_relay = request.data["is_relay"]
            if "swimmers_per_entry" in request.data:
                edited_event.swimmers_per_entry = request.data["swimmers_per_entry"]
            if "competing_gender" in request.data:
                edited_event.competing_gender = request.data["competing_gender"]
            if "competing_max_age" in request.data:
                edited_event.competing_max_age = request.data["competing_max_age"]
            if "competing_min_age" in request.data:
                edited_event.competing_min_age = request.data["competing_min_age"]
            if "order_in_session" in request.data:
                old_order_number = edited_event.order_in_session

                if request.data["order_in_session"] == "start":
                    edited_event.order_in_session = 1
                elif request.data["order_in_session"] == "end":
                    edited_event.order_in_session = current_highest_order_number + 1
                else:
                    edited_event.order_in_session = min(
                        request.data["order_in_session"],
                        current_highest_order_number + 1,
                    )  # cap order number at end

            edited_event.full_clean()
            edited_event.save()
        except ValidationError as err:
            # ? invalid creation data passed -> validators
            return Response(
                {"put_success": False, "reason": "; ".join(err.messages)},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception as err:
            # ? invalid creation data passed -> general
            return Response(
                {"put_success": False, "reason": str(err)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # * move event order numbers backward -> self moved forward
        if "order_in_session" in request.data and old_order_number < edited_event.order_in_session:
            order_shifted_events = Event.objects.filter(
                session_id=edited_event.session_id,
                order_in_session__gt=old_order_number,
                order_in_session__lte=edited_event.order_in_session,
            ).exclude(id=edited_event.id)

            for event in order_shifted_events:
                event.order_in_session -= 1
                event.save()

        # * move event order numbers forward -> self moved backward
        elif "order_in_session" in request.data and old_order_number > edited_event.order_in_session:
            order_shifted_events = Event.objects.filter(
                session_id=edited_event.session_id,
                order_in_session__lt=old_order_number,
                order_in_session__gte=edited_event.order_in_session,
            ).exclude(id=edited_event.id)
            
            for event in order_shifted_events:
                event.order_in_session += 1
                event.save()

        edited_event_JSON = json.loads(
            serialize(
                "json",
                [edited_event],
                fields=[
                    "stroke",
                    "distance",
                    "is_relay",
                    "swimmers_per_entry",
                    "competing_gender",
                    "competing_max_age",
                    "competing_min_age",
                    "order_in_session",
                    "total_heats",
                    "session",
                ],
            )
        )[0]
        return Response({"put_success": True, "data": edited_event_JSON})

    def delete(self, request):
        # ? not logged in
        if not request.user.is_authenticated:
            return Response(
                {"delete_success": False, "reason": "not logged in"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        event_id = request.query_params.get("event_id")
        # ? no event id passed
        if event_id is None:
            return Response(
                {"delete_success": False, "reason": "no event id passed"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            event_of_id = Event.objects.get(id=event_id)
        except:
            # ? no event with the given id exists
            return Response(
                {
                    "delete_success": False,
                    "reason": "no event with the given id exists",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        meet_host_id = event_of_id.meet.host_id
        # ? not logged into meet host account
        if request.user.id != meet_host_id:
            return Response(
                {
                    "delete_success": False,
                    "reason": "not logged into meet host account",
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        # * move event order numbers backward
        order_shifted_events = Event.objects.filter(session_id=event_of_id.session_id,
            order_in_session__gt=event_of_id.order_in_session
        )
        for event in order_shifted_events:
            event.order_in_session -= 1
            event.save()

        event_of_id.delete()
        return Response({"delete_success": True})
