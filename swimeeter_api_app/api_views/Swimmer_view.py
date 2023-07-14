from rest_framework.views import APIView, Response
from rest_framework import status

from django.core.serializers import serialize
import json

from ..models import Event, Swimmer, Meet


class Swimmer_view(APIView):
    def get(self, request):
        specific_to = request.query_params.get("specific_to")

        # set record range
        upper_bound = int(request.query_params.get("upper_bound"))
        lower_bound = int(request.query_params.get("lower_bound"))

        # get all swimmers for a specific...
        match specific_to:
            case "id":
                swimmer_id = request.query_params.get("swimmer_id")
                # ? no swimmer id passed
                if swimmer_id is None:
                    return Response(
                        {"get_success": False, "reason": "no swimmer id passed"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                try:
                    swimmer_of_id = Swimmer.objects.get(id=swimmer_id)
                except:
                    # ? no swimmer with the given id exists
                    return Response(
                        {
                            "get_success": False,
                            "reason": "no swimmer with the given id exists",
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                # * get swimmer JSON
                swimmer_of_id_JSON = json.loads(
                    serialize(
                        "json",
                        [swimmer_of_id],
                        fields=[
                            "first_name",
                            "last_name",
                            "age",
                            "gender",
                            "team",
                            "meet",
                        ],
                    )
                )[0]

                # * get FK meet JSON
                swimmer_of_id__meet = Meet.objects.get(id=swimmer_of_id.meet_id)
                swimmer_of_id__meet_JSON = json.loads(
                    serialize(
                        "json",
                        [swimmer_of_id__meet],
                        fields=[
                            "name",
                            "lanes",
                            "measure_unit",
                            "host",
                        ],
                    )
                )[0]
                swimmer_of_id_JSON["fields"]["meet"] = swimmer_of_id__meet_JSON

                return Response({"get_success": True, "data": swimmer_of_id_JSON})

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

                # * get swimmers JSON
                swimmers_of_meet = Swimmer.objects.filter(meet_id=meet_id)[
                    lower_bound:upper_bound
                ]
                swimmers_of_meet_JSON = json.loads(
                    serialize(
                        "json",
                        swimmers_of_meet,
                        fields=[
                            "first_name",
                            "last_name",
                            "age",
                            "gender",
                            "team",
                            "meet",
                        ],
                    )
                )

                # * get FK meet JSON
                swimmers_of_meet__meet_JSON = json.loads(
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
                for swimmer_JSON in swimmers_of_meet_JSON:
                    swimmer_JSON["fields"]["meet"] = swimmers_of_meet__meet_JSON

                return Response({"get_success": True, "data": swimmers_of_meet_JSON})

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
        # ? not logged in to meet host account
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
                meet_id=meet_id,
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
                fields=[
                    "first_name",
                    "last_name",
                    "age",
                    "gender",
                    "team",
                    "meet",
                ],
            )
        )[0]
        return Response({"post_success": True, "data": new_swimmer_JSON})

    def put(self, request):
        # ? not logged in
        if not request.user.is_authenticated:
            return Response(
                {"put_success": False, "reason": "not logged in"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        swimmer_id = request.query_params.get("swimmer_id")
        # ? no swimmer id passed
        if swimmer_id is None:
            return Response(
                {"put_success": False, "reason": "no swimmer id passed"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            swimmer_of_id = Swimmer.objects.get(id=swimmer_id)
        except:
            # ? no swimmer with the given id exists
            return Response(
                {"put_success": False, "reason": "no swimmer with the given id exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        swimmer_meet_host_id = swimmer_of_id.meet.host_id
        # ? not logged in to meet host account swimmer meet host account
        if request.user.id != swimmer_meet_host_id:
            return Response(
                {
                    "put_success": False,
                    "reason": "not logged in to meet host account",
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        try:
            edited_swimmer = Swimmer.objects.get(id=swimmer_id)

            if "first_name" in request.data:
                edited_swimmer.first_name = request.data["first_name"]
            if "last_name" in request.data:
                edited_swimmer.last_name = request.data["last_name"]
            if "age" in request.data:
                edited_swimmer.age = request.data["age"]
            if "gender" in request.data:
                edited_swimmer.gender = request.data["gender"]
            if "team" in request.data:
                edited_swimmer.team = request.data["team"]

            edited_swimmer.full_clean()
            edited_swimmer.save()
        except:
            # ? invalid creation data passed
            return Response(
                {"put_success": False, "reason": "invalid editing data passed"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        edited_swimmer_JSON = json.loads(
            serialize(
                "json",
                [edited_swimmer],
                fields=[
                    "first_name",
                    "last_name",
                    "age",
                    "gender",
                    "team",
                    "meet",
                ],
            )
        )[0]
        return Response({"put_success": True, "data": edited_swimmer_JSON})

    def delete(self, request):
        # ? not logged in
        if not request.user.is_authenticated:
            return Response(
                {"delete_success": False, "reason": "not logged in"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        swimmer_id = request.query_params.get("swimmer_id")
        # ? no swimmer id passed
        if swimmer_id is None:
            return Response(
                {"delete_success": False, "reason": "no swimmer id passed"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            swimmer_of_id = Event.objects.get(id=swimmer_id)
        except:
            # ? no event with the given id exists
            return Response(
                {
                    "delete_success": False,
                    "reason": "no swimmer with the given id exists",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        meet_host_id = swimmer_of_id.meet.host_id
        # ? not logged in to meet host account
        if request.user.id != meet_host_id:
            return Response(
                {
                    "delete_success": False,
                    "reason": "not logged in to meet host account",
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        swimmer_of_id.delete()
        return Response({"delete_success": True})
