from rest_framework.views import APIView, Response
from rest_framework import status

from django.core.serializers import serialize
import json

from .models import Event, Swimmer, Entry, Meet, Heat, HeatLaneAssignment


class Event_view(APIView):
    def get(self, request):
        # get all events for a specific meet
        if "specific_to" in request.data and request.data["specific_to"] == "meet":
            # ? no meet id passed
            if "meet_id" not in request.data:
                return Response(
                    {"get_success": False, "reason": "no meet id passed"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            events_of_meet = Event.objects.filter(meet_id=request.data["meet_id"])
            events_of_meet_JSON = json.loads(
                serialize(
                    "json",
                    events_of_meet,
                    fields=[
                        "id",
                        "stroke",
                        "distance",
                        "competing_gender",
                        "competing_max_age",
                        "competing_min_age",
                    ],
                )
            )
            return Response({"get_success": True, "event": events_of_meet_JSON})

        # ? invalid 'specific_to' specification
        else:
            return Response(
                {"get_success": False, "reason": "invalid 'specific_to' specification"},
                status=status.HTTP_400_BAD_REQUEST,
            )

    def post(self, request):
        # ? not logged in
        if not request.user.is_authenticated:
            return Response(
                {"post_success": False, "reason": "not logged in"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        # ? not logged in to meet host account
        meet_host_id = Meet.objects.get(id=request.data["meet_id"]).host_id
        if request.user.id != meet_host_id:
            return Response(
                {"post_success": False, "reason": "not logged in to meet host account"},
                status=status.HTTP_403_FORBIDDEN,
            )

        try:
            new_event = Event(
                stroke=request.data["stroke"],
                distance=request.data["distance"],
                competing_gender=request.data["competing_gender"],
                competing_max_age=request.data["competing_max_age"],
                competing_min_age=request.data["competing_min_age"],
                meet_id=request.data["meet_id"],
            )
            new_event.full_clean()
            new_event.save()
        except:
            # ? invalid creation data passed
            return Response(
                {"post_success": False, "reason": "invalid creation data passed"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        new_event_JSON = json.loads(
            serialize(
                "json",
                [new_event],
                fields=[
                    "id",
                    "stroke",
                    "distance",
                    "competing_gender",
                    "competing_max_age",
                    "competing_min_age",
                ],
            )
        )[0]
        return Response({"post_success": True, "event": new_event_JSON})

    def delete(self, request):
        # ? not logged in
        if not request.user.is_authenticated:
            return Response(
                {"delete_success": False, "reason": "not logged in"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        # ? no event id passed
        if "event_id" not in request.data:
            return Response(
                {"delete_success": False, "reason": "no event id passed"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # ? not logged in to meet host account
        meet_host_id = Event.objects.get(id=request.data["event_id"]).meet.host_id
        if request.user.id != meet_host_id:
            return Response(
                {
                    "delete_success": False,
                    "reason": "not logged in to meet host account",
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        Event.objects.get(id=request.data["event_id"]).delete()
        return Response({"delete_success": True})


class Swimmer_view(APIView):
    def get(self, request):
        # get all swimmers for a specific meet
        if "specific_to" in request.data and request.data["specific_to"] == "meet":
            # ? no meet id passed
            if "meet_id" not in request.data:
                return Response(
                    {"get_success": False, "reason": "no meet id passed"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            swimmers_of_meet = Swimmer.objects.filter(meet_id=request.data["meet_id"])
            swimmers_of_meet_JSON = json.loads(
                serialize(
                    "json",
                    swimmers_of_meet,
                    fields=["id", "first_name", "last_name", "age", "gender", "team"],
                )
            )
            return Response({"get_success": True, "swimmer": swimmers_of_meet_JSON})

        # ? invalid 'specific_to' specification
        else:
            return Response(
                {"get_success": False, "reason": "invalid 'specific_to' specification"},
                status=status.HTTP_400_BAD_REQUEST,
            )

    def post(self, request):
        # ? not logged in
        if not request.user.is_authenticated:
            return Response(
                {"post_success": False, "reason": "not logged in"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        # ? not logged in to meet host account
        meet_host_id = Meet.objects.get(id=request.data["meet_id"]).host_id
        if request.user.id != meet_host_id:
            return Response(
                {"post_success": False, "reason": "not logged in to meet host account"},
                status=status.HTTP_403_FORBIDDEN,
            )

        try:
            new_swimmer = Swimmer(
                first_name=request.data["first_name"],
                last_name=request.data["last_name"],
                age=request.data["age"],
                gender=request.data["gender"],
                team=request.data["team"],
                meet_id=request.data["meet_id"],
            )
            new_swimmer.full_clean()
            new_swimmer.save()
        except:
            # ? invalid creation data passed
            return Response(
                {"post_success": False, "reason": "invalid creation data passed"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        new_swimmer_JSON = json.loads(
            serialize(
                "json",
                [new_swimmer],
                fields=["id", "first_name", "last_name", "age", "gender", "team"],
            )
        )[0]
        return Response({"post_success": True, "swimmer": new_swimmer_JSON})

    def delete(self, request):
        # ? not logged in
        if not request.user.is_authenticated:
            return Response(
                {"delete_success": False, "reason": "not logged in"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        # ? no swimmer id passed
        if "swimmer_id" not in request.data:
            return Response(
                {"delete_success": False, "reason": "no swimmer id passed"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # ? not logged in to meet host account
        meet_host_id = Swimmer.objects.get(id=request.data["swimmer_id"]).meet.host_id
        if request.user.id != meet_host_id:
            return Response(
                {
                    "delete_success": False,
                    "reason": "not logged in to meet host account",
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        Swimmer.objects.get(id=request.data["swimmer_id"]).delete()
        return Response({"delete_success": True})


class Entry_view(APIView):
    def get(self, request):
        # get all swimmers for a specific meet event
        if (
            "specific_to" in request.data
            and request.data["specific_to"] == "meet_event"
        ):
            # ? no meet id passed
            if "meet_id" not in request.data:
                return Response(
                    {"get_success": False, "reason": "no meet id passed"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            # ? no event id passed
            if "event_id" not in request.data:
                return Response(
                    {"get_success": False, "reason": "no event id passed"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            entries_of_meet_event = Entry.objects.filter(
                event_id=request.data["event_id"],
                event__meet_id=request.data["meet_id"],
            )
            entries_of_meet_event_JSON = json.loads(
                serialize(
                    "json", entries_of_meet_event, fields=["id", "seed_time", "swimmer"]
                )
            )
            return Response({"get_success": True, "entry": entries_of_meet_event_JSON})

        # get all swimmers for a specific meet swimmer
        elif (
            "specific_to" in request.data
            and request.data["specific_to"] == "meet_swimmer"
        ):
            # ? no meet id passed
            if "meet_id" not in request.data:
                return Response(
                    {"get_success": False, "reason": "no meet id passed"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            # ? no swimmer id passed
            if "swimmer_id" not in request.data:
                return Response(
                    {"get_success": False, "reason": "no swimmer id passed"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            entries_of_meet_swimmer = Entry.objects.filter(
                swimmer_id=request.data["swimmer_id"],
                swimmer__meet_id=request.data["meet_id"],
            )
            entries_of_meet_swimmer_JSON = json.loads(
                serialize(
                    "json", entries_of_meet_swimmer, fields=["id", "seed_time", "event"]
                )
            )
            return Response(
                {"get_success": True, "entry": entries_of_meet_swimmer_JSON}
            )

        # ? invalid 'specific_to' specification
        else:
            return Response(
                {"get_success": False, "reason": "invalid 'specific_to' specification"},
                status=status.HTTP_400_BAD_REQUEST,
            )

    def post(self, request):
        # ? not logged in
        if not request.user.is_authenticated:
            return Response(
                {"post_success": False, "reason": "not logged in"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        # ? not logged in to meet host account
        meet_host_id = Swimmer.objects.get(id=request.data["swimmer_id"]).meet.host_id
        if request.user.id != meet_host_id:
            return Response(
                {"post_success": False, "reason": "not logged in to meet host account"},
                status=status.HTTP_403_FORBIDDEN,
            )

        try:
            new_entry = Entry(
                seed_time=request.data["seed_time"],
                event_id=request.data["event_id"],
                swimmer_id=request.data["swimmer_id"],
            )
            new_entry.full_clean()
            new_entry.save()
        except:
            # ? invalid creation data passed
            return Response(
                {"post_success": False, "reason": "invalid creation data passed"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        new_entry_JSON = json.loads(
            serialize(
                "json", [new_entry], fields=["id", "seed_time", "swimmer", "event"]
            )
        )[0]
        return Response({"post_success": True, "entry": new_entry_JSON})

    def delete(self, request):
        # ? not logged in
        if not request.user.is_authenticated:
            return Response(
                {"delete_success": False, "reason": "not logged in"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        # ? no entry id passed
        if "entry_id" not in request.data:
            return Response(
                {"delete_success": False, "reason": "no entry id passed"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # ? not logged in to meet host account
        meet_host_id = Entry.objects.get(
            id=request.data["entry_id"]
        ).swimmer.meet.host_id
        if request.user.id != meet_host_id:
            return Response(
                {
                    "delete_success": False,
                    "reason": "not logged in to meet host account",
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        Entry.objects.get(id=request.data["entry_id"]).delete()
        return Response({"delete_success": True})


class Meet_view(APIView):
    def get(self, request):
        # get all meets
        if "specific_to" in request.data and request.data["specific_to"] == "all":
            meets_of_all = Meet.objects.all()
            meets_of_all_JSON = json.loads(
                serialize(
                    "json",
                    meets_of_all,
                    fields=["id", "name", "lanes", "measure_unit", "host"],
                )
            )
            return Response({"get_success": True, "data": meets_of_all_JSON})

        # get all meets for a specific host
        elif "specific_to" in request.data and request.data["specific_to"] == "host":
            # ? no host id passed
            if "host_id" not in request.data:
                return Response(
                    {"get_success": False, "reason": "no host id passed"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            meets_of_host = Meet.objects.filter(host_id=request.data["host_id"])
            meets_of_host_JSON = json.loads(
                serialize(
                    "json",
                    meets_of_host,
                    fields=["id", "name", "lanes", "measure_unit"],
                )
            )
            return Response({"get_success": True, "meet": meets_of_host_JSON})

        # ? invalid 'specific_to' specification
        else:
            return Response(
                {"get_success": False, "reason": "invalid 'specific_to' specification"},
                status=status.HTTP_400_BAD_REQUEST,
            )

    def post(self, request):
        # ? not logged in
        if not request.user.is_authenticated:
            return Response(
                {"post_success": False, "reason": "not logged in"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        try:
            new_meet = Meet(
                name=request.data["name"],
                lanes=request.data["lanes"],
                measure_unit=request.data["measure_unit"],
                host_id=request.data["host_id"],
            )
            new_meet.full_clean()
            new_meet.save()
        except:
            # ? invalid creation data passed
            return Response(
                {"post_success": False, "reason": "invalid creation data passed"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        new_meet_JSON = json.loads(
            serialize(
                "json", [new_meet], fields=["id", "name", "lanes", "measure_unit"]
            )
        )[0]
        return Response({"post_success": True, "meet": new_meet_JSON})

    def delete(self, request):
        # ? not logged in
        if not request.user.is_authenticated:
            return Response(
                {"delete_success": False, "reason": "not logged in"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        # ? no meet id passed
        if "meet_id" not in request.data:
            return Response(
                {"delete_success": False, "reason": "no meet id passed"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # ? not logged in to meet host account
        meet_host_id = Meet.objects.get(id=request.data["meet_id"]).host_id
        if request.user.id != meet_host_id:
            return Response(
                {
                    "delete_success": False,
                    "reason": "not logged in to meet host account",
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        Meet.objects.get(id=request.data["meet_id"]).delete()
        return Response({"delete_success": True})


class Heat_view(APIView):
    def get(self, request):
        # get all heats for a specific meet event
        if (
            "specific_to" in request.data
            and request.data["specific_to"] == "meet_event"
        ):
            # ? no meet id passed
            if "meet_id" not in request.data:
                return Response(
                    {"get_success": False, "reason": "no meet id passed"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            # ? no event id passed
            if "event_id" not in request.data:
                return Response(
                    {"get_success": False, "reason": "no event id passed"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            heats_of_meet_event = Heat.objects.filter(
                event_id=request.data["event_id"],
                event__meet_id=request.data["meet_id"],
            )
            heats_of_meet_event_JSON = json.loads(
                serialize("json", heats_of_meet_event, fields=["id", "order_in_event"])
            )
            return Response({"get_success": True, "heat": heats_of_meet_event_JSON})

        # ? invalid 'specific_to' specification
        else:
            return Response(
                {"get_success": False, "reason": "invalid 'specific_to' specification"},
                status=status.HTTP_400_BAD_REQUEST,
            )


class Heat_assignment_view(APIView):
    def get(self, request):
        # get all heat-lane assignments for a specific meet event heat
        if (
            "specific_to" in request.data
            and request.data["specific_to"] == "meet_event_heat"
        ):
            # ? no meet id passed
            if "meet_id" not in request.data:
                return Response(
                    {"get_success": False, "reason": "no meet id passed"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            # ? no event id passed
            if "event_id" not in request.data:
                return Response(
                    {"get_success": False, "reason": "no event id passed"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            # ? no heat id passed
            if "heat_id" not in request.data:
                return Response(
                    {"get_success": False, "reason": "no heat id passed"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            assignments_of_meet_event_heat = HeatLaneAssignment.objects.filter(
                heat_id=request.data["heat_id"],
                heat__event_id=request.data["event_id"],
                heat__event__meet_id=request.data["meet_id"],
            )
            assignments_of_meet_event_heat_JSON = json.loads(
                serialize(
                    "json",
                    assignments_of_meet_event_heat,
                    fields=["id", "lane", "entry"],
                )
            )
            return Response(
                {"get_success": True, "assignment": assignments_of_meet_event_heat_JSON}
            )

        # ? invalid 'specific_to' specification
        else:
            return Response(
                {"get_success": False, "reason": "invalid 'specific_to' specification"},
                status=status.HTTP_400_BAD_REQUEST,
            )


# TODO: implement generating a heat sheet
class Heat_sheet_view(APIView):
    def get(self, request):
        return Response({"get_success": False, "reason": "feature not yet implemented"})
