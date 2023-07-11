from rest_framework.views import APIView, Response
from rest_framework import status

from django.core.serializers import serialize
import json

from ..models import Meet
from swimeeter_auth_app.models import Host

class Meet_view(APIView):
    def get(self, request):
        specific_to = request.query_params.get("specific_to")

        # set record range
        upper_bound = int(request.query_params.get("upper_bound"))
        lower_bound = int(request.query_params.get("lower_bound"))

        # get all meets for a specific...
        match specific_to:
            case "id":
                meet_id = request.query_params.get("meet_id")
                # ? no meet id passed
                if meet_id is None:
                    return Response(
                        {"get_success": False, "reason": "no meet id passed"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                meet_of_id = Meet.objects.get(id=meet_id)
                # ? no meet with the given id exists
                if meet_of_id is None:
                    return Response(
                        {
                            "get_success": False,
                            "reason": "no meet with the given id exists",
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                meet_of_id_JSON = json.loads(
                    serialize(
                        "json",
                        [meet_of_id],
                        fields=[
                            "name",
                            "lanes",
                            "measure_unit",
                            "host",
                        ],
                    )
                )[0]
                return Response({"get_success": True, "data": meet_of_id_JSON})

            case "host":
                host_id = request.query_params.get("host_id")
                # ? no host id passed
                if host_id is None:
                    return Response(
                        {"get_success": False, "reason": "no host id passed"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                host_of_id = Host.objects.get(id=host_id)
                # ? no meet with the given id exists
                if host_of_id is None:
                    return Response(
                        {
                            "post_success": False,
                            "reason": "no host with the given id exists",
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                meets_of_host = Meet.objects.filter(host_id=host_id)[lower_bound:upper_bound]
                meets_of_host_JSON = json.loads(
                    serialize(
                        "json",
                        meets_of_host,
                        fields=[
                            "name",
                            "lanes",
                            "measure_unit",
                            "host",
                        ],
                    )
                )
                return Response({"get_success": True, "data": meets_of_host_JSON})

            case "all":
                meets_of_all = Meet.objects.all()[lower_bound:upper_bound]
                meets_of_all_JSON = json.loads(
                    serialize(
                        "json",
                        meets_of_all,
                        fields=[
                            "name",
                            "lanes",
                            "measure_unit",
                            "host",
                        ],
                    )
                )
                return Response({"get_success": True, "data": meets_of_all_JSON})

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

        try:
            new_meet = Meet(
                name=request.data["name"],
                lanes=request.data["lanes"],
                measure_unit=request.data["measure_unit"],
                host_id=request.user.id,
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
                "json",
                [new_meet],
                fields=["name", "lanes", "measure_unit" "host"],
            )
        )[0]
        return Response({"post_success": True, "data": new_meet_JSON})

    def put(self, request):
        # ? not logged in
        if not request.user.is_authenticated:
            return Response(
                {"put_success": False, "reason": "not logged in"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        meet_id = request.query_params.get("meet_id")
        # ? no meet id passed
        if meet_id is None:
            return Response(
                {"put_success": False, "reason": "no meet id passed"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        meet_of_id = Meet.objects.get(id=meet_id)
        # ? no meet with the given id exists
        if meet_of_id is None:
            return Response(
                {"put_success": False, "reason": "no meet with the given id exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        meet_host_id = meet_of_id.host_id
        # ? not logged in to meet host account
        if request.user.id != meet_host_id:
            return Response(
                {
                    "put_success": False,
                    "reason": "not logged in to meet host account",
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        try:
            edited_meet = Meet.objects.get(id=meet_id)

            if "name" in request.data:
                edited_meet.name = request.data["name"]
            if "lanes" in request.data:
                edited_meet.lanes = request.data["lanes"]
            if "measure_unit" in request.data:
                edited_meet.measure_unit = request.data["measure_unit"]

            edited_meet.full_clean()
            edited_meet.save()
        except:
            # ? invalid creation data passed
            return Response(
                {"put_success": False, "reason": "invalid editing data passed"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        edited_meet_JSON = json.loads(
            serialize(
                "json",
                [edited_meet],
                fields=[
                    "name",
                    "lanes",
                    "measure_unit",
                    "host",
                ],
            )
        )[0]
        return Response({"put_success": True, "data": edited_meet_JSON})

    def delete(self, request):
        # ? not logged in
        if not request.user.is_authenticated:
            return Response(
                {"delete_success": False, "reason": "not logged in"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        meet_id = request.query_params.get("meet_id")
        # ? no meet id passed
        if meet_id is None:
            return Response(
                {"delete_success": False, "reason": "no meet id passed"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        meet_of_id = Meet.objects.get(id=meet_id)
        # ? no meet with the given id exists
        if meet_of_id is None:
            return Response(
                {"delete_success": False, "reason": "no meet with the given id exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        meet_host_id = meet_of_id.host_id
        # ? not logged in to meet host account
        if request.user.id != meet_host_id:
            return Response(
                {
                    "delete_success": False,
                    "reason": "not logged in to meet host account",
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        meet_of_id.delete()
        return Response({"delete_success": True})