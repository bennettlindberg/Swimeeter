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

                relay_entries_of_event = Relay_entry.objects.filter(event_id=event_id)[
                    lower_bound:upper_bound
                ]

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

                relay_entries_of_heat = Relay_entry.objects.filter(
                    event_id=event_id, heat_number=heat_number
                ).order_by("lane_number")[lower_bound:upper_bound]

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
                )[lower_bound:upper_bound]

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

        event_of_id = vh.get_model_of_id("Event", event_id)
        # ? no event of event_id exists
        if isinstance(event_of_id, Response):
            return event_of_id

        check_is_host = vh.check_user_is_host(request, event_of_id.session.meet.host_id)
        # ? user is not meet host
        if isinstance(check_is_host, Response):
            return check_is_host

        try:
            swimmer_ids = []
            for assignment in request.data["assignments"]:
                swimmer_ids.append(assignment["swimmer_id"])
        except Exception as err:
            # ? error retrieving swimmer ids
            return Response(
                str(err),
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        # ? no swimmer ids passed
        if len(swimmer_ids) == 0:
            return Response(
                "no swimmer ids passed",
                status=status.HTTP_400_BAD_REQUEST,
            )

        swimmers_of_ids = list(map(lambda model_id: vh.get_model_of_id("Swimmer", model_id), swimmer_ids))
        for swimmer_of_id in swimmers_of_ids:
            # ? no swimmer of swimmer_id exists
            if isinstance(swimmer_of_id, Response):
                return swimmer_of_id

        # ? relay has incorrect number of swimmers
        if swimmers_of_ids.count() != event_of_id.swimmers_per_entry:
            return Response(
                "relay has incorrect number of swimmers",
                status=status.HTTP_400_BAD_REQUEST,
            )

        for swimmer_of_id in swimmers_of_ids:
            # ? swimmer and event meets do not match
            if swimmer_of_id.meet_id != event_of_id.session.meet_id:
                return Response(
                    "swimmer and event meets do not match",
                    status=status.HTTP_400_BAD_REQUEST,
                )

        # * create new relay_entry
        try:
            new_relay_entry = Relay_entry(
                seed_time=0, # assigned post-creation,
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
            # ~ used to calculate overall relay seed time
            total_relay_time = 0

            for assignment in request.data["assignments"]:
                total_relay_time += assignment["seed_relay_split"]

                new_relay_assignment = Relay_assignment(
                    order_in_relay = assignment["order_in_relay"],
                    seed_relay_split = assignment["seed_relay_split"],
                    swimmer_id = assignment["swimmer_id"],
                    relay_entry = new_relay_entry,
                )

                new_relay_assignment.full_clean()
                new_relay_assignment.save()

            # * update relay_entry with overall seed time
            new_relay_entry.seed_time = total_relay_time
            new_relay_entry.full_clean()
            new_relay_entry.save()
        except ValidationError as err:
            # ? invalid creation data passed -> validators
            assignments = Relay_assignment.objects.filter(relay_entry_id=new_relay_entry.id)
            assignments.delete()
            new_relay_entry.delete()

            return Response(
                "; ".join(err.messages),
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception as err:
            # ? invalid creation data passed -> general
            assignments = Relay_assignment.objects.filter(relay_entry_id=new_relay_entry.id)
            assignments.delete()
            new_relay_entry.delete()

            return Response(
                str(err),
                status=status.HTTP_400_BAD_REQUEST,
            )

        # * get relay_entry JSON
        new_relay_entry_JSON = vh.get_JSON_single(
            "Relay_entry", new_relay_entry, False
        )
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

        relay_entry_of_id = vh.get_model_of_id("Relay_entry", relay_entry_id)
        # ? no relay entry of relay_entry_id exists
        if isinstance(relay_entry_of_id, Response):
            return relay_entry_of_id
        
        check_is_host = vh.check_user_is_host(request, relay_entry_of_id.event.session.meet.host_id)
        # ? user is not meet host
        if isinstance(check_is_host, Response):
            return check_is_host

        # * update existing relay_entry
        try:
            edited_relay_entry = Relay_entry.objects.get(id=relay_entry_id)

            new_assignments_ids = []
            if "assignments" in request.data:
                # ? new relay assignments count and swimmers per relay do not match
                if len(request.data["assignments"]) != edited_relay_entry.event.swimmers_per_entry:
                    raise Exception("new relay assignments count and swimmers per relay do not match")
                
                total_relay_time = 0

                for assignment in request.data["assignments"]:
                    total_relay_time += assignment["seed_relay_split"]

                    swimmer_of_id = vh.get_model_of_id("Swimmer", assignment["swimmer_id"])
                    # ? no swimmer of swimmer_id exists
                    if isinstance(swimmer_of_id, Response):
                        return swimmer_of_id
                    # ? swimmer and relay entry meets do not match
                    elif swimmer_of_id.meet_id != edited_relay_entry.event.session.meet_id:
                        return Response(
                            "swimmer and relay entry meets do not match",
                            status=status.HTTP_400_BAD_REQUEST,
                        )

                    new_relay_assignment = Relay_assignment(
                        order_in_relay = assignment["order_in_relay"],
                        seed_relay_split = assignment["seed_relay_split"],
                        swimmer_id = assignment["swimmer_id"],
                        relay_entry = edited_relay_entry,
                    )

                    new_relay_assignment.full_clean()
                    new_relay_assignment.save()
                    new_assignments_ids.append(new_relay_assignment.id)

                # * update relay_entry with overall seed time
                edited_relay_entry.seed_time = total_relay_time
                edited_relay_entry.full_clean()
                edited_relay_entry.save()

                Relay_assignment.objects.filter(relay_entry_id=edited_relay_entry.id).exclude(id__in=new_assignments_ids).delete()

            edited_relay_entry.full_clean()
            edited_relay_entry.save()
        except ValidationError as err:
            # ? invalid creation data passed -> validators
            Relay_assignment.objects.filter(relay_entry_id=edited_relay_entry.id, id__in=new_assignments_ids).delete()

            return Response(
                "; ".join(err.messages),
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception as err:
            # ? invalid creation data passed -> general
            Relay_assignment.objects.filter(relay_entry_id=edited_relay_entry.id, id__in=new_assignments_ids).delete()

            return Response(
                str(err),
                status=status.HTTP_400_BAD_REQUEST,
            )

        # * get relay_entry JSON
        edited_relay_entry_JSON = vh.get_JSON_single(
            "Relay_entry", edited_relay_entry, False
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

        relay_entry_of_id = vh.get_model_of_id("Relay_entry", relay_entry_id)
        # ? no relay entry of relay_entry_id exists
        if isinstance(relay_entry_of_id, Response):
            return relay_entry_of_id
        
        check_is_host = vh.check_user_is_host(request, relay_entry_of_id.event.session.meet.host_id)
        # ? user is not meet host
        if isinstance(check_is_host, Response):
            return check_is_host

        # * delete existing relay_entry
        try:
            relay_entry_of_id.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        # ? internal error deleting model
        except Exception as err:
            return Response(
                str(err),
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
