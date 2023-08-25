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

import math
import inflect

p = inflect.engine()

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
                    session__meet_id=model_object.session.meet_id,
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
                    swimmers__in=model_object.swimmers.all(),
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
    event_name = event_object.competing_gender + " "

    if event_object.competing_min_age and event_object.competing_max_age:
        if event_object.competing_min_age == event_object.competing_max_age:
            event_name += str(event_object.competing_min_age) + " Years Old "
        else:
            event_name += (
                str(event_object.competing_min_age)
                + "-"
                + str(event_object.competing_max_age)
                + " Years Old "
            )
    elif event_object.competing_min_age:
        event_name += str(event_object.competing_min_age) + " & Over "
    elif event_object.competing_max_age:
        event_name += str(event_object.competing_max_age) + " & Under "
    else:
        event_name += "Open "

    event_name += str(event_object.distance) + " " + event_object.stroke + " "

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

    # * hours
    if hours == 0:
        pass
    else:
        seed_string += str(hours) + ":"

    # * minutes
    if minutes == 0 and seed_string == "":
        pass
    elif minutes < 10 and seed_string != "":
        seed_string += "0" + str(minutes) + ":"
    else:
        seed_string += str(minutes) + ":"

    # * seconds
    if seconds < 10 and seed_string != "":
        seed_string += "0" + str(seconds) + "."
    else:
        seed_string += str(seconds) + "."

    # * hundredths
    if hundredths < 10:
        seed_string += "0" + str(hundredths)
    else:
        seed_string += str(hundredths)

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

    swimmers_list = [
        assignment.swimmer
        for assignment in relay_entry_object.relay_assignments.all().order_by(
            "order_in_relay"
        )
    ]

    if len(swimmers_list) == 1:
        pass
    elif len(swimmers_list) == 2:
        entry_name += swimmers_list[0].first_name + " and "
    else:
        for i in range(len(swimmers_list) - 1):
            entry_name += swimmers_list[i].first_name + ", "
        entry_name += "and "

    if swimmers_list[-1].first_name.endswith("s"):
        entry_name += swimmers_list[-1].first_name + "' "
    else:
        entry_name += swimmers_list[-1].first_name + "'s "

    entry_name += get_seed_time_string(relay_entry_object.seed_time) + " Entry"

    return entry_name


def get_relationship_tree(model_type, model_object):
    try:
        match model_type:
            case "Meet":
                return {
                    "MEET": {
                        "title": model_object.name,
                        "id": model_object.id,
                        "route": f"/meets/{model_object.id}",
                    }
                }

            case "Pool":
                return {
                    "MEET": {
                        "title": model_object.meet.name,
                        "id": model_object.meet.id,
                        "route": f"/meets/{model_object.meet.id}",
                    },
                    "POOL": {
                        "title": model_object.name,
                        "id": model_object.id,
                        "route": f"/meets/{model_object.meet.id}/pools/{model_object.id}",
                    },
                }

            case "Session":
                return {
                    "MEET": {
                        "title": model_object.meet.name,
                        "id": model_object.meet.id,
                        "route": f"/meets/{model_object.meet.id}",
                    },
                    "SESSION": {
                        "title": model_object.name,
                        "id": model_object.id,
                        "route": f"/meets/{model_object.meet.id}/sessions/{model_object.id}",
                    },
                }

            case "Event":
                return {
                    "MEET": {
                        "title": model_object.session.meet.name,
                        "id": model_object.session.meet.id,
                        "route": f"/meets/{model_object.session.meet.id}",
                    },
                    "SESSION": {
                        "title": model_object.session.name,
                        "id": model_object.session.id,
                        "route": f"/meets/{model_object.session.meet.id}/sessions/{model_object.session.id}",
                    },
                    "EVENT": {
                        "title": get_event_name(model_object),
                        "id": model_object.id,
                        "route": f"/meets/{model_object.session.meet.id}/events/{'relay' if model_object.is_relay else 'individual'}/{model_object.id}",
                    },
                }

            case "Team":
                return {
                    "MEET": {
                        "title": model_object.meet.name,
                        "id": model_object.meet.id,
                        "route": f"/meets/{model_object.meet.id}",
                    },
                    "TEAM": {
                        "title": model_object.name,
                        "id": model_object.id,
                        "route": f"/meets/{model_object.meet.id}/teams/{model_object.id}",
                    },
                }

            case "Swimmer":
                return {
                    "MEET": {
                        "title": model_object.meet.name,
                        "id": model_object.meet.id,
                        "route": f"/meets/{model_object.meet.id}",
                    },
                    "SWIMMER": {
                        "title": get_swimmer_name(model_object),
                        "id": model_object.id,
                        "route": f"/meets/{model_object.meet.id}/swimmers/{model_object.id}",
                    },
                }

            case "Individual_entry":
                return {
                    "MEET": {
                        "title": model_object.event.session.meet.name,
                        "id": model_object.event.session.meet.id,
                        "route": f"/meets/{model_object.event.session.meet.id}",
                    },
                    "SESSION": {
                        "title": model_object.event.session.name,
                        "id": model_object.event.session.id,
                        "route": f"/meets/{model_object.event.session.meet.id}/sessions/{model_object.event.session.id}",
                    },
                    "EVENT": {
                        "title": get_event_name(model_object.event),
                        "id": model_object.event.id,
                        "route": f"/meets/{model_object.event.session.meet.id}/events/individual/{model_object.event.id}",
                    },
                    "INDIVIDUAL_ENTRY": {
                        "title": get_individual_entry_name(model_object),
                        "id": model_object.id,
                        "route": f"/meets/{model_object.event.session.meet.id}/individual_entries/{model_object.id}",
                    },
                }

            case "Relay_entry":
                return {
                    "MEET": {
                        "title": model_object.event.session.meet.name,
                        "id": model_object.event.session.meet.id,
                        "route": f"/meets/{model_object.event.session.meet.id}",
                    },
                    "SESSION": {
                        "title": model_object.event.session.name,
                        "id": model_object.event.session.id,
                        "route": f"/meets/{model_object.event.session.meet.id}/sessions/{model_object.event.session.id}",
                    },
                    "EVENT": {
                        "title": get_event_name(model_object.event),
                        "id": model_object.event.id,
                        "route": f"/meets/{model_object.event.session.meet.id}/events/relay/{model_object.event.id}",
                    },
                    "RELAY_ENTRY": {
                        "title": get_relay_entry_name(model_object),
                        "id": model_object.id,
                        "route": f"/meets/{model_object.event.session.meet.id}/relay_entries/{model_object.id}",
                    },
                }

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
    fulfilledAge = True
    fulfilledGender = True

    if (
        event_object.competing_max_age is not None
        and swimmer_object.age > event_object.competing_max_age
    ) or (
        event_object.competing_min_age is not None
        and swimmer_object.age < event_object.competing_min_age
    ):
        fulfilledAge = False

    match event_object.competing_gender:
        case "Men" | "Boys":
            if (
                p.plural(swimmer_object.gender) != "Men"
                and p.plural(swimmer_object.gender) != "Boys"
            ):
                fulfilledGender = False

        case "Women" | "Girls":
            if (
                p.plural(swimmer_object.gender) != "Women"
                and p.plural(swimmer_object.gender) != "Girls"
            ):
                fulfilledGender = False

        case "Mixed":
            pass

        case _:
            if p.plural(swimmer_object.gender) != event_object.competing_gender:
                fulfilledGender = False

    if not fulfilledAge or not fulfilledGender:
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


# ! HEAT SHEET SEEDING


def generate_event_seeding(options, event_object: Event):
    # ~ options:
    #   $ min_entries_per_heat: number
    #   $ seeding_type: "standard" | "circle"
    #   ! (circle seeding only) num_circle_seeded_heats: number | "All full heats"

    # 25 25 25 6 --> need 20

    # * get entries of event
    if event_object.is_relay:
        entries_list = list(
            Relay_entry.objects.filter(event_id=event_object.pk).order_by("-seed_time")
        )
    else:
        entries_list = list(
            Individual_entry.objects.filter(event_id=event_object.pk).order_by(
                "-seed_time"
            )
        )

    # * calculate entries per lane
    total_entries = entries_list.count()
    lanes_per_heat = event_object.session.pool.lanes

    heat_entry_counts = []

    for i in range(total_entries // lanes_per_heat):
        heat_entry_counts.append(lanes_per_heat)

    first_heat_leftover = total_entries % lanes_per_heat
    if first_heat_leftover != 0:
        heat_entry_counts.insert(0, first_heat_leftover)

    # ~ deal with minimum entries needed per heat
    for i in range(1, len(heat_entry_counts)):
        # * first heat already meets min requirement
        needed_entries = options.min_entries_per_heat - heat_entry_counts[0]
        if needed_entries <= 0:
            break

        # * no entries are available to carry over -> fail to meet min requirement
        available_entries = heat_entry_counts[i] - options.min_entries_per_heat
        if available_entries == 0:
            break

        # * enough entries available to meet min requirement
        if needed_entries <= available_entries:
            heat_entry_counts[0] += needed_entries
            heat_entry_counts[i] -= needed_entries
            break

        # * not enough entries available, but at least some
        heat_entry_counts[0] += available_entries
        heat_entry_counts[i] -= available_entries

    # * define standard lane order
    standard_lane_order = []
    current = math.ceil(lanes_per_heat / 2)
    change = 1
    while current >= 1 and current <= lanes_per_heat:
        standard_lane_order.append(current)
        current += change
        change = -1 * (change + 1)

    # $ assign heat and lanes using...
    match (options.seeding_type):
        # $ ...standard seeding
        case "standard":
            entry_index = 0

            # * standard seed all heats
            for heat_index in range(len(heat_entry_counts)):
                for lane_index in range(heat_entry_counts[heat_index]):
                    entries_list[entry_index].heat_number = heat_index + 1
                    entries_list[entry_index].lane_number = standard_lane_order[
                        lane_index
                    ]
                    entry_index += 1

        # $ ...circle seeding
        case "circle":
            # * determine heats that will be circle seeded
            max_heat_entry_count = max(heat_entry_counts)

            can_circle_seed_heats = 0
            for i in range(len(heat_entry_counts) - 1, -1, -1):
                if heat_entry_counts[i] == max_heat_entry_count:
                    can_circle_seed_heats += 1

            will_circle_seed_heats = min(
                can_circle_seed_heats, options.num_circle_seeded_heats
            )

            entry_index = 0

            # * standard seed beginning heats
            for heat_index in range(len(heat_entry_counts) - will_circle_seed_heats):
                for lane_index in range(heat_entry_counts[heat_index]):
                    entries_list[entry_index].heat_number = heat_index + 1
                    entries_list[entry_index].lane_number = standard_lane_order[
                        lane_index
                    ]
                    entry_index += 1

            # * circle seed ending heats
            for lane_index in range(max_heat_entry_count - 1, -1, -1):
                for heat_index in range(
                    len(heat_entry_counts) - will_circle_seed_heats,
                    len(heat_entry_counts),
                ):
                    entries_list[entry_index].heat_number = heat_index + 1
                    entries_list[entry_index].lane_number = standard_lane_order[
                        lane_index
                    ]
                    entry_index += 1

        # ? invalid seeding type
        case _:
            return Response("invalid seeding type", status=status.HTTP_400_BAD_REQUEST)

    event_object.total_heats = len(heat_entry_counts)

    # * save event and entry seeding data
    try:
        event_object.full_clean()
        event_object.save()

        for entry in entries_list:
            entry.full_clean()
            entry.save()

        return True
    except:
        event_object.total_heats = None
        event_object.save()

        for entry in entries_list:
            entry.heat_number = None
            entry.lane_number = None
            entry.save()

        # ? error saving event and entries
        return Response(
            "error saving event and entries",
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


def get_heat_seeding_data(event_object, heat_number):
    heat_seeding_data = {"heat_number": heat_number, "lanes_data": []}

    if event_object.is_relay:
        entries_list = list(
            Relay_entry.objects.filter(
                event_id=event_object.pk, heat_number=heat_number
            ).order_by("lane_number")
        )

        starting_lane_number = entries_list[0].lane_number
        ending_lane_number = entries_list[-1].lane_number
        total_lanes = event_object.session.pool.lanes

        for i in range(1, starting_lane_number):
            heat_seeding_data["lanes_data"].append(
                {"lane_number": i, "entry_data": None}
            )

        lane_counter = starting_lane_number
        for entry in entries_list:
            heat_seeding_data["lanes_data"].append(
                {
                    "lane_number": lane_counter,
                    "entry_data": {
                        "entry_id": entry.pk,
                        "entry_name": get_relay_entry_name(entry),
                        "entry_team": list(entry.swimmers.all())[0].team.name,
                        "entry_seed_time": entry.seed_time,
                    },
                }
            )
            lane_counter += 1

        for i in range(ending_lane_number + 1, total_lanes + 1):
            heat_seeding_data["lanes_data"].append(
                {"lane_number": i, "entry_data": None}
            )

    else:
        entries_list = list(
            Individual_entry.objects.filter(
                event_id=event_object.pk, heat_number=heat_number
            ).order_by("lane_number")
        )

        starting_lane_number = entries_list[0].lane_number
        ending_lane_number = entries_list[-1].lane_number
        total_lanes = event_object.session.pool.lanes

        for i in range(1, starting_lane_number):
            heat_seeding_data["lanes_data"].append(
                {"lane_number": i, "entry_data": None}
            )

        lane_counter = starting_lane_number
        for entry in entries_list:
            heat_seeding_data["lanes_data"].append(
                {
                    "lane_number": lane_counter,
                    "entry_data": {
                        "entry_id": entry.pk,
                        "entry_name": get_swimmer_name(entry.swimmer),
                        "entry_team": entry.swimmer.team.name,
                        "entry_seed_time": entry.seed_time,
                    },
                }
            )
            lane_counter += 1

        for i in range(ending_lane_number + 1, total_lanes + 1):
            heat_seeding_data["lanes_data"].append(
                {"lane_number": i, "entry_data": None}
            )

    return heat_seeding_data


def generate_session_number_map(meet_object):
    session_number_map = {}

    sessions_list = list(
        Session.objects.filter(meet_id=meet_object.pk).order_by(
            "begin_time", "end_time", "name"
        )
    )

    for i in range(len(sessions_list)):
        session_number_map[sessions_list[i].pk] = i + 1

    return session_number_map


def get_seeding_data(model_type, model_object):
    try:
        session_number_map = {}

        match (model_type):
            case "Meet":
                session_number_map = generate_session_number_map(model_object)

                seeding_data = {
                    "meet_id": model_object.pk,
                    "meet_name": model_object.name,
                    "sessions_data": [],
                }

                sessions_list = list(
                    Session.objects.filter(meet_id=model_object.pk).order_by(
                        "begin_time", "end_time", "name"
                    )
                )

                for session in sessions_list:
                    events_list = list(
                        Event.objects.filter(session_id=session.pk).order_by(
                            "order_in_session"
                        )
                    )

                    events_data = []
                    for event in events_list:
                        if event.total_heats == None:
                            events_data.append(
                                {
                                    "event_id": event.pk,
                                    "event_name": get_event_name(event),
                                    "event_number": event.order_in_session,
                                    "event_is_relay": event.is_relay,
                                    "heats_data": None,
                                }
                            )
                            continue

                        num_heats = event.total_heats
                        heats_data = []
                        for i in range(1, num_heats + 1):
                            heats_data.append(get_heat_seeding_data(event, i))

                        events_data.append(
                            {
                                "event_id": event.pk,
                                "event_name": get_event_name(event),
                                "event_number": event.order_in_session,
                                "event_is_relay": event.is_relay,
                                "heats_data": [],
                            }
                        )

                    seeding_data["sessions_data"].append(
                        {
                            "session_id": session.pk,
                            "session_name": session.name,
                            "session_number": session_number_map[session.pk],
                            "events_data": events_data,
                        }
                    )

                return seeding_data

            case "Pool":
                session_number_map = generate_session_number_map(model_object.meet)

                seeding_data = {
                    "pool_id": model_object.pk,
                    "pool_name": model_object.name,
                    "sessions_data": [],
                }

                sessions_list = list(
                    Session.objects.filter(pool_id=model_object.pk).order_by(
                        "begin_time", "end_time", "name"
                    )
                )

                for session in sessions_list:
                    events_list = list(
                        Event.objects.filter(session_id=session.pk).order_by(
                            "order_in_session"
                        )
                    )

                    events_data = []
                    for event in events_list:
                        if event.total_heats == None:
                            events_data.append(
                                {
                                    "event_id": event.pk,
                                    "event_name": get_event_name(event),
                                    "event_number": event.order_in_session,
                                    "event_is_relay": event.is_relay,
                                    "heats_data": None,
                                }
                            )
                            continue

                        num_heats = event.total_heats
                        heats_data = []
                        for i in range(1, num_heats + 1):
                            heats_data.append(get_heat_seeding_data(event, i))

                        events_data.append(
                            {
                                "event_id": event.pk,
                                "event_name": get_event_name(event),
                                "event_number": event.order_in_session,
                                "event_is_relay": event.is_relay,
                                "heats_data": [],
                            }
                        )

                    seeding_data["sessions_data"].append(
                        {
                            "session_id": session.pk,
                            "session_name": session.name,
                            "session_number": session_number_map[session.pk],
                            "events_data": events_data,
                        }
                    )

                return seeding_data

            case "Team":
                session_number_map = generate_session_number_map(model_object.meet)

                seeding_data = {
                    "team_id": model_object.pk,
                    "team_name": model_object.name,
                    "sessions_data": [],
                }

                # ! determine sessions with team members in them
                sessions_query_set = Session.objects.filter(
                    meet_id=model_object.meet.pk,
                    events__individual_entries__swimmer__team__pk__contains=model_object.pk,
                ) | Session.objects.filter(
                    meet_id=model_object.meet.pk,
                    events__relay_entries__swimmers__team__pk__contains=model_object.pk,
                )
                sessions_list = list(
                    sessions_query_set.order_by("begin_time", "end_time", "name")
                    .order_by("id")
                    .distinct("id")
                )

                for session in sessions_list:
                    # ! determine events with team members in them
                    events_query_set = Event.objects.filter(
                        session_id=session.pk,
                        individual_entries__swimmer__team__pk__contains=model_object.pk,
                    ) | Event.objects.filter(
                        session_id=session.pk,
                        relay_entries__swimmers__team__pk__contains=model_object.pk,
                    )

                    events_list = list(
                        events_query_set.order_by("order_in_session")
                        .order_by("id")
                        .distinct("id")
                    )

                    events_data = []
                    for event in events_list:
                        if event.total_heats == None:
                            events_data.append(
                                {
                                    "event_id": event.pk,
                                    "event_name": get_event_name(event),
                                    "event_number": event.order_in_session,
                                    "event_is_relay": event.is_relay,
                                    "heats_data": None,
                                }
                            )
                            continue

                        num_heats = event.total_heats
                        heats_data = []
                        for i in range(1, num_heats + 1):
                            # ! get heats with team members in them
                            if event.is_relay:
                                entries_of_team = Relay_entry.objects.filter(
                                    event_id=event.pk,
                                    heat_number=i,
                                    swimmers__team__pk__contains=model_object.pk,
                                )
                            else:
                                entries_of_team = Individual_entry.objects.filter(
                                    event_id=event.pk,
                                    heat_number=i,
                                    swimmer__team__pk=model_object.pk,
                                )

                            if entries_of_team.count() > 0:
                                heats_data.append(get_heat_seeding_data(event, i))

                        events_data.append(
                            {
                                "event_id": event.pk,
                                "event_name": get_event_name(event),
                                "event_number": event.order_in_session,
                                "event_is_relay": event.is_relay,
                                "heats_data": [],
                            }
                        )

                    seeding_data["sessions_data"].append(
                        {
                            "session_id": session.pk,
                            "session_name": session.name,
                            "session_number": session_number_map[session.pk],
                            "events_data": events_data,
                        }
                    )

                return seeding_data

            case "Swimmer":
                session_number_map = generate_session_number_map(model_object.meet)

                seeding_data = {
                    "swimmer_id": model_object.pk,
                    "swimmer_name": get_swimmer_name(model_object),
                    "sessions_data": [],
                }

                # ! determine sessions with swimmer in them
                sessions_query_set = Session.objects.filter(
                    meet_id=model_object.meet.pk,
                    events__individual_entries__swimmer__pk__contains=model_object.pk,
                ) | Session.objects.filter(
                    meet_id=model_object.meet.pk,
                    events__relay_entries__swimmers__pk__contains=model_object.pk,
                )
                sessions_list = list(
                    sessions_query_set.order_by("begin_time", "end_time", "name")
                    .order_by("id")
                    .distinct("id")
                )

                for session in sessions_list:
                    # ! determine events with swimmer in them
                    events_query_set = Event.objects.filter(
                        session_id=session.pk,
                        individual_entries__swimmer__pk__contains=model_object.pk,
                    ) | Event.objects.filter(
                        session_id=session.pk,
                        relay_entries__swimmers__pk__contains=model_object.pk,
                    )

                    events_list = list(
                        events_query_set.order_by("order_in_session")
                        .order_by("id")
                        .distinct("id")
                    )

                    events_data = []
                    for event in events_list:
                        if event.total_heats == None:
                            events_data.append(
                                {
                                    "event_id": event.pk,
                                    "event_name": get_event_name(event),
                                    "event_number": event.order_in_session,
                                    "event_is_relay": event.is_relay,
                                    "heat_data": None,
                                }
                            )
                            continue

                        # ! determine heat with swimmer in it
                        if event.is_relay:
                            swimmer_heat_num = Relay_entry.objects.get(
                                event_id=event.pk,
                                swimmers__pk__contains=model_object.pk,
                            ).heat_number
                        else:
                            swimmer_heat_num = Individual_entry.objects.get(
                                event_id=event.pk, swimmer_id=model_object.pk
                            ).heat_number

                        events_data.append(
                            {
                                "event_id": event.pk,
                                "event_name": get_event_name(event),
                                "event_number": event.order_in_session,
                                "event_is_relay": event.is_relay,
                                "heat_data": get_heat_seeding_data(
                                    event, swimmer_heat_num
                                ),
                            }
                        )

                    seeding_data["sessions_data"].append(
                        {
                            "session_id": session.pk,
                            "session_name": session.name,
                            "session_number": session_number_map[session.pk],
                            "events_data": events_data,
                        }
                    )

                return seeding_data

            case "Session":
                session_number_map = generate_session_number_map(model_object.meet)

                seeding_data = {
                    "session_id": model_object.pk,
                    "session_name": model_object.name,
                    "session_number": session_number_map[model_object.pk],
                    "events_data": [],
                }

                events_list = list(
                    Event.objects.filter(session_id=model_object.pk).order_by(
                        "order_in_session"
                    )
                )

                events_data = []
                for event in events_list:
                    if event.total_heats == None:
                        events_data.append(
                            {
                                "event_id": event.pk,
                                "event_name": get_event_name(event),
                                "event_number": event.order_in_session,
                                "event_is_relay": event.is_relay,
                                "heats_data": None,
                            }
                        )
                        continue

                    num_heats = event.total_heats
                    heats_data = []
                    for i in range(1, num_heats + 1):
                        heats_data.append(get_heat_seeding_data(event, i))

                    events_data.append(
                        {
                            "event_id": event.pk,
                            "event_name": get_event_name(event),
                            "event_number": event.order_in_session,
                            "event_is_relay": event.is_relay,
                            "heats_data": [],
                        }
                    )

                seeding_data["events_data"] = events_data

                return seeding_data

            case "Event":
                if model_object.total_heats == None:
                    return {
                        "event_id": model_object.pk,
                        "event_name": get_event_name(model_object),
                        "event_number": model_object.order_in_session,
                        "event_is_relay": model_object.is_relay,
                        "heats_data": None,
                    }

                seeding_data = {
                    "event_id": model_object.pk,
                    "event_name": get_event_name(model_object),
                    "event_number": model_object.order_in_session,
                    "event_is_relay": model_object.is_relay,
                    "heats_data": [],
                }

                num_heats = model_object.total_heats
                heats_data = []
                for i in range(1, num_heats + 1):
                    heats_data.append(get_heat_seeding_data(model_object, i))

                seeding_data["heats_data"] = heats_data

                return seeding_data

            case "Relay_entry":
                if model_object.heat_number == None:
                    return {
                        "entry_id": model_object.pk,
                        "entry_name": get_relay_entry_name(model_object),
                        "heat_data": None,
                    }

                return {
                    "entry_id": model_object.pk,
                    "entry_name": get_relay_entry_name(model_object),
                    "heat_data": get_heat_seeding_data(
                        model_object.event, model_object.heat_number
                    ),
                }

            case "Individual_entry":
                if model_object.heat_number == None:
                    return {
                        "entry_id": model_object.pk,
                        "entry_name": get_swimmer_name(model_object.swimmer),
                        "heat_data": None,
                    }

                return {
                    "entry_id": model_object.pk,
                    "entry_name": get_swimmer_name(model_object.swimmer),
                    "heat_data": get_heat_seeding_data(
                        model_object.event, model_object.heat_number
                    ),
                }

            # ? invalid "specific_to" specification
            case _:
                return Response(
                    "invalid model type",
                    status=status.HTTP_400_BAD_REQUEST,
                )
    except:
        return Response(
            "error retrieving seeding data",
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
                        True,
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
                        True,
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
