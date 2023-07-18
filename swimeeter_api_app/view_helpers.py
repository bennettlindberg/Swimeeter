from rest_framework.views import Response
from rest_framework import status

from django.core.serializers import serialize
import json

from .models import (
    Meet,
    Session,
    Event,
    Swimmer,
    Individual_entry,
    Relay_entry,
    Relay_assignment,
)
from ..swimeeter_auth_app.models import Host


# ! DATA CHECKERS AND RETRIEVERS


def get_query_param(request, param_name):
    param = request.query_params.get(param_name)

    if param is None:
        return Response(
            f"no {param_name} query parameter passed",
            status=status.HTTP_400_BAD_REQUEST,
        )
    else:
        return param


def get_model_of_id(model_type, model_id):
    try:
        match model_type:
            case "Host":
                return Host.objects.get(id=model_id)

            case "Meet":
                return Meet.objects.get(id=model_id)

            case "Session":
                return Session.objects.get(id=model_id)

            case "Event":
                return Event.objects.get(id=model_id)

            case "Swimmer":
                return Swimmer.objects.get(id=model_id)

            case "Individual_entry":
                return Individual_entry.objects.get(id=model_id)

            case "Relay_entry":
                return Relay_entry.objects.get(id=model_id)

            case "Relay_assignment":
                return Relay_assignment.objects.get(id=model_id)

            case _:
                return Response(
                    f"{model_type} is not a valid model type",
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
    except:
        return Response(
            f"no {model_type} with the given id exists",
            status=status.HTTP_400_BAD_REQUEST,
        )


def check_user_logged_in(request):
    if not request.user.is_authenticated:
        return Response(
            "user is not logged in",
            status=status.HTTP_401_UNAUTHORIZED,
        )
    else:
        return None


# @ assumes user is logged in
def check_user_is_host(request, host_id):
    if request.user.id != host_id:
        return Response(
            "user is not logged into meet host account",
            status=status.HTTP_403_FORBIDDEN,
        )
    else:
        return None
    

def check_meet_access_allowed(request, meet_object):
    if not meet_object.is_public:
        if not request.user.is_authenticated:
            return Response(
                "meet is private and not logged into host account",
                status=status.HTTP_401_UNAUTHORIZED,
            )
        elif meet_object.host_id != request.user.id:
            return Response(
                "meet is private and not logged into host account",
                status=status.HTTP_403_FORBIDDEN,
            )
    else:
        return None


def check_swimmer_and_event_meets_match(swimmer_object, event_object):
    if swimmer_object.meet_id != event_object.session.meet_id:
        return Response(
            "swimmer and event meets do not match",
            status=status.HTTP_400_BAD_REQUEST,
        )
    else:
        return None


# ! JSON SERIALIZERS


def get_JSON_multiple(model_type, model_objects, get_inner_JSON):
    match model_type:
        case "Host":
            return json.loads(
                serialize(
                    "json",
                    model_objects,
                    fields=[
                        "first_name",
                        "last_name",
                        "prefix",
                        "suffix",
                        "middle_initials",
                    ],
                )
            )

        case "Meet":
            collective_JSON = json.loads(
                serialize(
                    "json",
                    model_objects,
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
            )

            if get_inner_JSON:
                for individual_JSON in collective_JSON:
                    individual_JSON["fields"]["host"] = get_JSON_single(
                        "Host",
                        Host.objects.get(id=individual_JSON["fields"]["host"]),
                        False,
                    )

            return collective_JSON

        case "Session":
            collective_JSON = json.loads(
                serialize(
                    "json",
                    model_objects,
                    fields=[
                        "name",
                        "begin_time",
                        "end_time",
                        "meet",
                    ],
                )
            )

            if get_inner_JSON:
                for individual_JSON in collective_JSON:
                    individual_JSON["fields"]["meet"] = get_JSON_single(
                        "Meet",
                        Meet.objects.get(id=individual_JSON["fields"]["meet"]),
                        False,
                    )

            return collective_JSON

        case "Event":
            collective_JSON = json.loads(
                serialize(
                    "json",
                    model_objects,
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

            if get_inner_JSON:
                for individual_JSON in collective_JSON:
                    individual_JSON["fields"]["session"] = get_JSON_single(
                        "Session",
                        Session.objects.get(id=individual_JSON["fields"]["session"]),
                        False,
                    )

            return collective_JSON

        case "Swimmer":
            collective_JSON = json.loads(
                serialize(
                    "json",
                    model_objects,
                    fields=[
                        "first_name",
                        "last_name",
                        "prefix",
                        "suffix",
                        "middle_initials",
                        "age",
                        "gender",
                        "team_name",
                        "team_acronym",
                        "meet",
                    ],
                )
            )

            if get_inner_JSON:
                for individual_JSON in collective_JSON:
                    individual_JSON["fields"]["meet"] = get_JSON_single(
                        "Meet",
                        Meet.objects.get(id=individual_JSON["fields"]["meet"]),
                        False,
                    )

            return collective_JSON

        case "Individual_entry":
            collective_JSON = json.loads(
                serialize(
                    "json",
                    model_objects,
                    fields=[
                        "seed_time",
                        "heat_number",
                        "lane_number",
                        "swimmer",
                        "event",
                    ],
                )
            )

            if get_inner_JSON:
                for individual_JSON in collective_JSON:
                    individual_JSON["fields"]["swimmer"] = get_JSON_single(
                        "Swimmer",
                        Swimmer.objects.get(id=individual_JSON["fields"]["swimmer"]),
                        False,
                    )
                    individual_JSON["fields"]["event"] = get_JSON_single(
                        "Event",
                        Event.objects.get(id=individual_JSON["fields"]["event"]),
                        False,
                    )

            return collective_JSON

        case "Relay_entry":
            collective_JSON = json.loads(
                serialize(
                    "json",
                    model_objects,
                    fields=[
                        "seed_time",
                        "heat_number",
                        "lane_number",
                        # swimmers => handled by relay_assignments,
                        "relay_assignments",
                        "event",
                    ],
                )
            )

            if get_inner_JSON:
                for individual_JSON in collective_JSON:
                    individual_JSON["fields"]["relay_assignments"] = get_JSON_multiple(
                        "Relay_assignment",
                        Relay_assignment.objects.filter(
                            id__in=individual_JSON["fields"]["relay_assignments"]
                        ),
                        True,
                    )
                    individual_JSON["fields"]["event"] = get_JSON_single(
                        "Event",
                        Event.objects.get(id=individual_JSON["fields"]["event"]),
                        False,
                    )

            return collective_JSON

        case "Relay_assignment":
            collective_JSON = json.loads(
                serialize(
                    "json",
                    model_objects,
                    fields=[
                        "order_in_relay",
                        "swimmer",
                        "relay_entry",
                    ],
                )
            )

            if get_inner_JSON:
                for individual_JSON in collective_JSON:
                    individual_JSON["fields"]["swimmer"] = get_JSON_single(
                        "Swimmer",
                        Swimmer.objects.get(id=individual_JSON["fields"]["swimmer"]),
                        False,
                    )

            return collective_JSON

        case _:
            return Response(
                f"{model_type} is not a valid model type",
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


def get_JSON_single(model_type, model_object, get_inner_JSON):
    collective_JSON = get_JSON_multiple(model_type, [model_object], get_inner_JSON)

    if isinstance(collective_JSON, Response):
        return collective_JSON
    
    return collective_JSON[0]
