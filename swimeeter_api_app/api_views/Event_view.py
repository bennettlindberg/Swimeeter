from rest_framework.views import APIView, Response
from rest_framework import status

from ..models import Event, Individual_entry, Relay_entry
from .. import view_helpers as vh

from django.core.exceptions import ValidationError


class Event_view(APIView):
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

        # $ get event(s) specific too...
        match specific_to:
            # $ ...id
            case "id":
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

                # * get event JSON
                event_JSON = vh.get_JSON_single("Event", event_of_id, True)
                # ? internal error generating JSON
                if isinstance(event_JSON, Response):
                    return event_JSON
                else:
                    return Response(
                        event_JSON,
                        status=status.HTTP_200_OK,
                    )

            # $ ...session
            case "session":
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

                events_of_session = Event.objects.filter(
                    session_id=session_id
                ).order_by("order_in_session")

                # @ apply search filtering
                search__stroke = vh.get_query_param(request, "search__stroke")
                if isinstance(search__stroke, str):
                    events_of_session = events_of_session.filter(stroke__istartswith=search__stroke)

                search__distance = vh.get_query_param(request, "search__distance")
                if isinstance(search__distance, str):
                    search__distance = int(search__distance)
                    events_of_session = events_of_session.filter(distance=search__distance)

                search__competing_min_age = vh.get_query_param(request, "search__competing_min_age")
                if isinstance(search__competing_min_age, str):
                    search__competing_min_age = int(search__competing_min_age)
                    events_of_session = events_of_session.filter(competing_min_age=search__competing_min_age)

                search__competing_max_age = vh.get_query_param(request, "search__competing_max_age")
                if isinstance(search__competing_max_age, str):
                    search__competing_max_age = int(search__competing_max_age)
                    events_of_session = events_of_session.filter(competing_max_age=search__competing_max_age)

                search__competing_gender = vh.get_query_param(request, "search__competing_gender")
                if isinstance(search__competing_gender, str):
                    events_of_session = events_of_session.filter(competing_gender__istartswith=search__competing_gender)

                # * only retrieve request range of values
                events_of_session = events_of_session[lower_bound:upper_bound]

                # * get events JSON
                events_JSON = vh.get_JSON_multiple("Event", events_of_session, True)
                # ? internal error generating JSON
                if isinstance(events_JSON, Response):
                    return events_JSON
                else:
                    return Response(
                        events_JSON,
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

                events_of_meet = Event.objects.filter(
                    session__meet_id=meet_id
                ).order_by(
                    "stroke", "distance", "competing_min_age", "competing_gender"
                )

                # @ apply search filtering
                search__stroke = vh.get_query_param(request, "search__stroke")
                if isinstance(search__stroke, str):
                    events_of_meet = events_of_meet.filter(stroke__istartswith=search__stroke)

                search__distance = vh.get_query_param(request, "search__distance")
                if isinstance(search__distance, str):
                    search__distance = int(search__distance)
                    events_of_meet = events_of_meet.filter(distance=search__distance)

                search__competing_min_age = vh.get_query_param(request, "search__competing_min_age")
                if isinstance(search__competing_min_age, str):
                    search__competing_min_age = int(search__competing_min_age)
                    events_of_meet = events_of_meet.filter(competing_min_age=search__competing_min_age)

                search__competing_max_age = vh.get_query_param(request, "search__competing_max_age")
                if isinstance(search__competing_max_age, str):
                    search__competing_max_age = int(search__competing_max_age)
                    events_of_meet = events_of_meet.filter(competing_max_age=search__competing_max_age)

                search__competing_gender = vh.get_query_param(request, "search__competing_gender")
                if isinstance(search__competing_gender, str):
                    events_of_meet = events_of_meet.filter(competing_gender__istartswith=search__competing_gender)

                search__session_name = vh.get_query_param(request, "search__session_name")
                if isinstance(search__session_name, str):
                    events_of_meet = events_of_meet.filter(session__name__istartswith=search__session_name)

                # * only retrieve request range of values
                events_of_meet = events_of_meet[lower_bound:upper_bound]

                # * get events JSON
                events_JSON = vh.get_JSON_multiple("Event", events_of_meet, True)
                # ? internal error generating JSON
                if isinstance(events_JSON, Response):
                    return events_JSON
                else:
                    return Response(
                        events_JSON,
                        status=status.HTTP_200_OK,
                    )

            # ? invalid "specific_to" specification
            case _:
                return Response(
                    "invalid 'specific_to' specification",
                    status=status.HTTP_400_BAD_REQUEST,
                )

    def post(self, request):
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

        # * create new event
        try:
            # ~ highest order number
            current_highest_order_number = Event.objects.filter(session_id=session_id).count()

            # * generate order number for new event
            if "order_in_session" in request.data:
                if request.data["order_in_session"] == "start":
                    order_number = 1
                elif request.data["order_in_session"] == "end":
                    order_number = current_highest_order_number + 1
                else:
                    order_number = min(
                        request.data["order_in_session"],
                        current_highest_order_number + 1,
                    )  # cap order number at end
            else:
                order_number = current_highest_order_number + 1

            new_event = Event(
                stroke=request.data["stroke"],
                distance=request.data["distance"],
                is_relay=request.data["is_relay"],
                swimmers_per_entry=request.data["swimmers_per_entry"],
                stage=request.data["stage"],
                competing_gender=request.data["competing_gender"],
                competing_max_age=request.data["competing_max_age"],
                competing_min_age=request.data["competing_min_age"],
                order_in_session=order_number,
                # total_heats => null,
                session_id=session_id,
            )

            # * handle any duplicates
            duplicate_handling = vh.get_duplicate_handling(request)
            handle_duplicates = vh.handle_duplicates(duplicate_handling, "Event", new_event)
            # ? error handling duplicates
            if isinstance(handle_duplicates, Response):
                return handle_duplicates

            new_event.full_clean()
            new_event.save()
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

        # * move event order numbers forward
        if "order_in_session" in request.data:
            order_shifted_events = Event.objects.filter(
                session_id=session_id, order_in_session__gte=order_number
            ).exclude(id=new_event.pk)

            for event in order_shifted_events:
                event.order_in_session += 1
                event.save()

        # * get event JSON
        event_JSON = vh.get_JSON_single("Event", new_event, True)
        # ? internal error generating JSON
        if isinstance(event_JSON, Response):
            return event_JSON
        else:
            return Response(
                event_JSON,
                status=status.HTTP_201_CREATED,
            )

    def put(self, request):
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

        check_is_host = vh.check_user_is_host(request, event_of_id.session.meet.host_id)
        # ? user is not meet host
        if isinstance(check_is_host, Response):
            return check_is_host

        # ~ order number variables
        current_highest_order_number = Event.objects.filter(session_id=event_of_id.session_id).count()
        previous_order_number = event_of_id.order_in_session
        requested_order_number = event_of_id.order_in_session

        # * update existing event
        session_changed = False
        try:
            edited_event = Event.objects.get(id=event_id)

            if "stroke" in request.data:
                edited_event.stroke = request.data["stroke"]
            if "distance" in request.data:
                edited_event.distance = request.data["distance"]
            if "is_relay" in request.data:
                edited_event.is_relay = request.data["is_relay"]
            if "swimmers_per_entry" in request.data:
                edited_event.swimmers_per_entry = request.data["swimmers_per_entry"]
            if "stage" in request.data:
                edited_event.stage = request.data["stage"]
            if "competing_gender" in request.data:
                edited_event.competing_gender = request.data["competing_gender"]
            if "competing_max_age" in request.data:
                edited_event.competing_max_age = request.data["competing_max_age"]
            if "competing_min_age" in request.data:
                edited_event.competing_min_age = request.data["competing_min_age"]
            if "order_in_session" in request.data:
                # ~ requested order number
                requested_order_number = request.data["order_in_session"]

            # @ update foreign keys
            session_id = vh.get_query_param(request, "session_id")
            if isinstance(session_id, str):
                session_id = int(session_id)
                
                if (session_id != edited_event.session_id):
                    session_of_id = vh.get_model_of_id("Session", session_id)
                    # ? no session of session_id exists
                    if isinstance(session_of_id, Response):
                        return session_of_id
                    
                    edited_event.session_id = session_id
                    session_changed = True

                    # ~ highest order number
                    current_highest_order_number = Event.objects.filter(session_id=session_id).count()

            # * handle any duplicates
            duplicate_handling = vh.get_duplicate_handling(request)
            handle_duplicates = vh.handle_duplicates(duplicate_handling, "Event", edited_event)
            # ? error handling duplicates
            if isinstance(handle_duplicates, Response):
                return handle_duplicates

            edited_event.full_clean()
            edited_event.save()
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
        seeding_needs_invalidation = False

        if edited_event.is_relay:
            entries_of_event = Relay_entry.objects.filter(event_id=edited_event.pk)
            for entry in entries_of_event:
                for swimmer in entry.swimmers.all():
                    check_compatibility = vh.validate_swimmer_against_event(swimmer, edited_event)
                    # ? swimmer and event are not compatible
                    if isinstance(check_compatibility, Response):
                        entry.delete()
                        seeding_needs_invalidation = True
                        break
        else:
            entries_of_event = Individual_entry.objects.filter(event_id=edited_event.pk)
            for entry in entries_of_event:
                check_compatibility = vh.validate_swimmer_against_event(entry.swimmer, edited_event)
                # ? swimmer and event are not compatible
                if isinstance(check_compatibility, Response):
                    entry.delete()
                    seeding_needs_invalidation = True

        if seeding_needs_invalidation:
            # * invalidate event seeding
            invalidate_hs_data = vh.invalidate_event_seeding(edited_event)
            # ? internal error invalidating event seeding
            if isinstance(invalidate_hs_data, Response):
                return invalidate_hs_data
            
        # ~ calculate true requested order number
        if requested_order_number == "start":
            requested_order_number = 1
        elif requested_order_number == "end":
            requested_order_number = current_highest_order_number + 1
        else:
            requested_order_number = min(
                requested_order_number,
                current_highest_order_number + 1,
            )  # cap order number at end

        # * move event order numbers backward -> self moved forward
        if (session_changed):
            order_shifted_events = Event.objects.filter(
                session_id=edited_event.session_id,
                order_in_session__gte=requested_order_number,
            ).exclude(id=edited_event.pk)

            for event in order_shifted_events:
                event.order_in_session += 1
                event.save()

        elif (previous_order_number < requested_order_number):
            order_shifted_events = Event.objects.filter(
                session_id=edited_event.session_id,
                order_in_session__gt=previous_order_number,
                order_in_session__lte=requested_order_number,
            ).exclude(id=edited_event.pk)

            for event in order_shifted_events:
                event.order_in_session -= 1
                event.save()

        # * move event order numbers forward -> self moved backward
        elif (previous_order_number > requested_order_number):
            order_shifted_events = Event.objects.filter(
                session_id=edited_event.session_id,
                order_in_session__lt=previous_order_number,
                order_in_session__gte=requested_order_number,
            ).exclude(id=edited_event.pk)

            for event in order_shifted_events:
                event.order_in_session += 1
                event.save()

        edited_event.order_in_session = requested_order_number
        edited_event.save()

        # * get event JSON
        event_JSON = vh.get_JSON_single("Event", edited_event, True)
        # ? internal error generating JSON
        if isinstance(event_JSON, Response):
            return event_JSON
        else:
            return Response(
                event_JSON,
                status=status.HTTP_200_OK,
            )

    def delete(self, request):
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

        check_is_host = vh.check_user_is_host(request, event_of_id.session.meet.host_id)
        # ? user is not meet host
        if isinstance(check_is_host, Response):
            return check_is_host

        # * move event order numbers backward
        order_shifted_events = Event.objects.filter(
            session_id=event_of_id.session_id,
            order_in_session__gt=event_of_id.order_in_session,
        )
        for event in order_shifted_events:
            event.order_in_session -= 1
            event.save()

        # * delete existing event
        try:
            event_of_id.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        # ? internal error deleting model
        except Exception as err:
            return Response(
                str(err),
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
