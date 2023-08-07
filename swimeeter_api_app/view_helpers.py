from rest_framework.views import Response
from rest_framework import status

from django.core.serializers import serialize
import json

from .models import (
    Meet,
    Pool,
    Session,
    Event,
    Team,
    Swimmer,
    Individual_entry,
    Relay_entry,
    Relay_assignment,
)
from swimeeter_auth_app.models import Host


# ! GENERAL


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
            
            case "Pool":
                return Pool.objects.get(id=model_id)

            case "Meet":
                return Meet.objects.get(id=model_id)

            case "Session":
                return Session.objects.get(id=model_id)

            case "Event":
                return Event.objects.get(id=model_id)
            
            case "Team":
                return Team.objects.get(id=model_id)

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


# ! DUPLICATES


def get_all_duplicates(model_type, model_object):
    try:
        match model_type:
            case "Host":
                return Response(
                    f"{model_type} is not supported for duplicate checking",
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
            
            case "Pool":
                return Pool.objects.filter(
                    meet_id=model_object.meet_id,
                    name=model_object.name,
                    lanes=model_object.lanes,
                    side_length=model_object.side_length,
                    measure_unit=model_object.measure_unit,
                ).exclude(id=model_object.pk)

            case "Meet":
                return Meet.objects.filter(
                    host_id=model_object.host_id,
                    name=model_object.name,
                ).exclude(id=model_object.pk)

            case "Session":
                return Session.objects.filter(
                    meet_id=model_object.meet_id,
                    pool_id=model_object.pool_id,
                    name=model_object.name,
                ).exclude(id=model_object.pk)

            case "Event":
                return Event.objects.filter(
                    session__meet_id=model_object.session__meet_id,
                    stroke=model_object.stroke,
                    distance=model_object.distance,
                    is_relay=model_object.is_relay,
                    swimmers_per_entry=model_object.swimmers_per_entry,
                    stage=model_object.stage,
                    competing_gender=model_object.competing_gender,
                    competing_max_age=model_object.competing_max_age,
                    competing_min_age=model_object.competing_min_age,
                ).exclude(id=model_object.pk)
            
            case "Team":
                return Team.objects.filter(
                    meet_id=model_object.meet_id,
                    name=model_object.name,
                    acronym=model_object.acronym,
                ).exclude(id=model_object.pk)

            case "Swimmer":
                return Swimmer.objects.filter(
                    meet_id=model_object.meet_id,
                    team_id=model_object.team_id,
                    first_name=model_object.first_name,
                    last_name=model_object.last_name,
                    age=model_object.age,
                    gender=model_object.gender,
                ).exclude(id=model_object.pk)

            case "Individual_entry":
                return Individual_entry.objects.filter(
                    event_id=model_object.event_id,
                    swimmer_id=model_object.swimmer_id,
                ).exclude(id=model_object.pk)

            case "Relay_entry":
                return Relay_entry.objects.filter(
                    event_id=model_object.event_id,
                    swimmers__in=model_object.swimmers,
                ).exclude(id=model_object.pk)

            case "Relay_assignment":
                return Response(
                    f"{model_type} is not supported for duplicate checking",
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )

            case _:
                return Response(
                    f"{model_type} is not a valid model type",
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
    except Exception as err:
        return Response(
            str(err),
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


def handle_duplicates(duplicate_handling, model_type, new_model_object):
    if duplicate_handling == "keep_both":
        # ! entry types do not support keeping duplicates
        if model_type == "Relay_entry" or model_type == "Individual_entry":
            return Response(
                "'keep_both' is invalid; cannot retain duplicate entries",
                status=status.HTTP_400_BAD_REQUEST,
            )
        else:
            return None

    original_duplicates = get_all_duplicates(model_type, new_model_object)
    # ? error inside of get_all_duplicates
    if isinstance(original_duplicates, Response):
        return original_duplicates

    # ~ no duplicates exist
    if original_duplicates.count() == 0:
        return None

    if duplicate_handling == "unhandled":
        return Response(
            "unhandled duplicates exist",
            status=status.HTTP_409_CONFLICT,
        )

    if duplicate_handling == "keep_new":
        original_duplicates.delete()
        return None

    if duplicate_handling == "keep_originals":
        return Response(
            f"new model is a duplicate; new model not added",
            status=status.HTTP_200_OK,
        )

    else:
        return Response(
            f"{duplicate_handling} is not a valid duplicate handling specification",
            status=status.HTTP_400_BAD_REQUEST,
        )


def get_duplicate_handling(request):
    duplicate_handling = request.query_params.get("duplicate_handling")

    if (
        duplicate_handling != "unhandled"
        and duplicate_handling != "keep_both"
        and duplicate_handling != "keep_new"
        and duplicate_handling != "keep_originals"
    ):
        return "unhandled"
    else:
        return duplicate_handling


def get_entry_duplicate_handling(request):
    duplicate_handling = request.query_params.get("duplicate_handling")

    if (
        duplicate_handling != "unhandled"
        and duplicate_handling != "keep_new"
        and duplicate_handling != "keep_originals"
    ):
        return "unhandled"
    else:
        return duplicate_handling


# ! LOG IN/SIGN UP


def check_user_logged_in(request):
    if not request.user.is_authenticated:
        return Response(
            "user is not logged in",
            status=status.HTTP_401_UNAUTHORIZED,
        )
    else:
        return None


def check_user_is_host(request, host_id):
    if not request.user.is_authenticated:
        return Response(
            "user is not logged in",
            status=status.HTTP_401_UNAUTHORIZED,
        )
    elif request.user.id != host_id:
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


# ! FRONT-END INFO RETRIEVAL


def check_editing_access(request, model_type, model_object):
    if not request.user.is_authenticated:
        return False

    try:
        match model_type:
            case "Host":
                return model_object.id == request.user.id
            
            case "Pool":
                return model_object.meet.host.id == request.user.id

            case "Meet":
                return model_object.host.id == request.user.id

            case "Session":
                return model_object.meet.host.id == request.user.id

            case "Event":
                return model_object.session.meet.host.id == request.user.id
            
            case "Team":
                return model_object.meet.host.id == request.user.id

            case "Swimmer":
                return model_object.meet.host.id == request.user.id

            case "Individual_entry":
                return model_object.swimmer.meet.host.id == request.user.id

            case "Relay_entry":
                return model_object.event.session.meet.host.id == request.user.id

            case "Relay_assignment":
                return model_object.swimmer.meet.host.id == request.user.id

            case _:
                return Response(
                    f"{model_type} is not a valid model type",
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
    except:
        return Response(
            "unable to determine editing access",
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
    
def get_swimmer_name(swimmer_object: Swimmer):
    swimmer_name = ""

    if swimmer_object.prefix != "":
        swimmer_name += swimmer_object.prefix + " "

    swimmer_name += swimmer_object.first_name + " "

    if swimmer_object.middle_initials != "":
        swimmer_name += swimmer_object.middle_initials + " "

    swimmer_name += swimmer_object.last_name

    if swimmer_object.suffix != "":
        swimmer_name += " " + swimmer_object.suffix + " "

    return swimmer_name

def get_event_name(event_object: Event):
    event_name = event_object.competing_gender + "s "

    if event_object.competing_min_age and event_object.competing_max_age:
        event_name += event_object.competing_min_age + "-" + event_object.competing_max_age + " "
    elif event_object.competing_min_age:
        event_name += event_object.competing_min_age + " & Over "
    elif event_object.competing_max_age:
        event_name += event_object.competing_max_age + " & Under "
    else:
        event_object += "Open "

    event_name += event_object.distance + " " + event_object.stroke + " "

    if event_object.is_relay:
        event_name += "Relay "

    event_name += event_object.stage

    return event_name

def get_seed_time_string(hundredths: int):
    hours = hundredths // 360000
    hundredths %= 360000

    minutes = hundredths // 6000
    hundredths %= 6000

    seconds = hundredths // 100
    hundredths %= 100

    seed_string = ""

    for amountTuple in [(hours, ':'), (minutes, ":"), (seconds, "."), (hundredths, "")]:
        if amountTuple[0] > 0 and amountTuple[0] < 10:
            seed_string += "0"
        seed_string += str(amountTuple[0]) + amountTuple[1]

    return seed_string

def get_individual_entry_name(individual_entry_object: Individual_entry):
    entry_name = "" 
    
    if individual_entry_object.swimmer.first_name.endswith("s"):
        entry_name += individual_entry_object.swimmer.first_name + "' "
    else:
        entry_name += individual_entry_object.swimmer.first_name + "'s "

    entry_name += get_seed_time_string(individual_entry_object.seed_time) + " Entry"

    return entry_name

def get_relay_entry_name(relay_entry_object: Relay_entry):
    entry_name = "" 

    swimmers_list = list(relay_entry_object.swimmers)
    for i in range(len(swimmers_list) - 1):
        entry_name += swimmers_list[i].first_name + ", "

    entry_name += "and "
    
    if relay_entry_object.swimmers.last.first_name.endswith("s"):
        entry_name += relay_entry_object.swimmers.last.first_name + "' "
    else:
        entry_name += relay_entry_object.swimmers.last.first_name + "'s "

    entry_name += get_seed_time_string(relay_entry_object.seed_time) + " Entry"

    return entry_name

def get_relationship_tree(model_type, model_object):
    try:
        match model_type:
            case "Meet":
                return [
                    {
                        "model": "MEET",
                        "title": model_object.name,
                        "id": model_object.id,
                        "route": f"/meets/{model_object.id}"
                    }
                ]
            
            case "Pool":
                return [
                    {
                        "model": "MEET",
                        "title": model_object.meet.name,
                        "id": model_object.meet.id,
                        "route": f"/meets/{model_object.meet.id}"
                    },
                    {
                        "model": "POOL",
                        "title": model_object.name,
                        "id": model_object.id,
                        "route": f"/meets/{model_object.meet.id}/pools/{model_object.id}"
                    }
                ]

            case "Session":
                return [
                    {
                        "model": "MEET",
                        "title": model_object.meet.name,
                        "id": model_object.meet.id,
                        "route": f"/meets/{model_object.meet.id}"
                    },
                    {
                        "model": "SESSION",
                        "title": model_object.name,
                        "id": model_object.id,
                        "route": f"/meets/{model_object.meet.id}/sessions/{model_object.id}"
                    }
                ]

            case "Event":
                return [
                    {
                        "model": "MEET",
                        "title": model_object.session.meet.name,
                        "id": model_object.session.meet.id,
                        "route": f"/meets/{model_object.session.meet.id}"
                    },
                    {
                        "model": "SESSION",
                        "title": model_object.session.name,
                        "id": model_object.session.id,
                        "route": f"/meets/{model_object.session.meet.id}/sessions/{model_object.session.id}"
                    },
                    {
                        "model": "EVENT",
                        "title": get_event_name(model_object),
                        "id": model_object.id,
                        "route": f"/meets/{model_object.session.meet.id}/events/{model_object.id}"
                    }
                ]
            
            case "Team":
                return [
                    {
                        "model": "MEET",
                        "title": model_object.meet.name,
                        "id": model_object.meet.id,
                        "route": f"/meets/{model_object.meet.id}"
                    },
                    {
                        "model": "TEAM",
                        "title": model_object.name,
                        "id": model_object.id,
                        "route": f"/meets/{model_object.meet.id}/teams/{model_object.id}"
                    }
                ]

            case "Swimmer":
                return [
                    {
                        "model": "MEET",
                        "title": model_object.meet.name,
                        "id": model_object.meet.id,
                        "route": f"/meets/{model_object.meet.id}"
                    },
                    {
                        "model": "SWIMMER",
                        "title": get_swimmer_name(model_object),
                        "id": model_object.id,
                        "route": f"/meets/{model_object.meet.id}/swimmers/{model_object.id}"
                    }
                ]

            case "Individual_entry":
                return [
                    {
                        "model": "MEET",
                        "title": model_object.event.meet.name,
                        "id": model_object.event.meet.id,
                        "route": f"/meets/{model_object.event.meet.id}"
                    },
                    {
                        "model": "EVENT",
                        "title": get_event_name(model_object.event),
                        "id": model_object.event.id,
                        "route": f"/meets/{model_object.event.meet.id}/events/{model_object.event.id}"
                    },
                    {
                        "model": "INDIVIDUAL_ENTRY",
                        "title": get_individual_entry_name(model_object),
                        "id": model_object.id,
                        "route": f"/meets/{model_object.event.meet.id}/individual_entries/{model_object.id}"
                    }
                ]

            case "Relay_entry":
                return [
                    {
                        "model": "MEET",
                        "title": model_object.event.meet.name,
                        "id": model_object.event.meet.id,
                        "route": f"/meets/{model_object.event.meet.id}"
                    },
                    {
                        "model": "EVENT",
                        "title": get_event_name(model_object.event),
                        "id": model_object.event.id,
                        "route": f"/meets/{model_object.event.meet.id}/events/{model_object.event.id}"
                    },
                    {
                        "model": "RELAY_ENTRY",
                        "title": get_relay_entry_name(model_object),
                        "id": model_object.id,
                        "route": f"/meets/{model_object.event.meet.id}/relay_entries/{model_object.id}"
                    }
                ]

            case _:
                return Response(
                    f"{model_type} is not a valid model type",
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
    except:
        return Response(
            "error retrieving relationship tree",
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


# ! ENTRIES


def check_swimmers_against_others(swimmer_ids):
    for i in range(len(swimmer_ids)):
        for j in range(i + 1, len(swimmer_ids)):
            if swimmer_ids[i] == swimmer_ids[j]:
                return Response(
                    "duplicate swimmers exist inside relay",
                    status=status.HTTP_400_BAD_REQUEST,
                )
            
    swimmer_objects = list(Swimmer.objects.filter(id__in=swimmer_ids))
    first_team_id = swimmer_objects[0].team_id
    for swimmer in swimmer_objects:
        if swimmer.team_id != first_team_id:
            return Response(
                    "swimmers of different teams exist inside relay",
                    status=status.HTTP_400_BAD_REQUEST,
                )

    return None


def validate_swimmer_against_event(swimmer_object, event_object):
    if (
        (
            event_object.competing_max_age is not None
            and swimmer_object.age > event_object.competing_max_age
        )
        or (
            event_object.competing_min_age is not None
            and swimmer_object.age < event_object.competing_min_age
        )
        or (
            event_object.competing_gender != "Open"
            and swimmer_object.gender != event_object.competing_gender
        )
    ):
        return Response(
            "swimmer and event are incompatible",
            status=status.HTTP_400_BAD_REQUEST,
        )
    else:
        return None


def invalidate_event_seeding(event_object):
    try:
        # data already invalidated
        if event_object.total_heats is None:
            return None

        event_object.total_heats = None
        event_object.save()

        if event_object.is_relay:
            entries_of_event = Relay_entry.objects.get(event_id=event_object.pk)
        else:
            entries_of_event = Individual_entry.objects.get(event_id=event_object.pk)

        for entry in entries_of_event:
            entry.heat_number = None
            entry.lane_number = None
            entry.save()

        return None
    except Exception as err:
        return Response(
            "heat sheet invalidation failed",
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


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
        
        case "Pool":
            collective_JSON = json.loads(
                serialize(
                    "json",
                    model_objects,
                    fields=[
                        "name",
                        "street_address",
                        "city",
                        "state",
                        "country",
                        "zipcode",
                        "lanes",
                        "side_length",
                        "measure_unit",
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
                        "pool",
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
                    individual_JSON["fields"]["pool"] = get_JSON_single(
                        "Pool",
                        Pool.objects.get(id=individual_JSON["fields"]["pool"]),
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
                        "stage",
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
        
        case "Team":
            collective_JSON = json.loads(
                serialize(
                    "json",
                    model_objects,
                    fields=[
                        "name",
                        "acronym",
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
                        "meet",
                        "team",
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
                    individual_JSON["fields"]["team"] = get_JSON_single(
                        "Team",
                        Team.objects.get(id=individual_JSON["fields"]["team"]),
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
                            relay_entry_id=individual_JSON["pk"]
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
                        "seed_relay_split",
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
