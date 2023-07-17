from rest_framework.views import APIView, Response
from rest_framework import status

from django.core.serializers import serialize
import json

from ..models import Swimmer, Meet

from django.core.exceptions import ValidationError


class Swimmer_view(APIView):
    def get(self, request):
        specific_to = request.query_params.get("specific_to")

        # set record range
        upper_bound_str = request.query_params.get("upper_bound")
        if upper_bound_str is not None:
            upper_bound = int(upper_bound_str)

        lower_bound_str = request.query_params.get("lower_bound")
        if lower_bound_str is not None:
            lower_bound = int(lower_bound_str)

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
                )[0]

                # * get FK meet JSON
                swimmer_of_id__meet = Meet.objects.get(id=swimmer_of_id.meet_id)
                swimmer_of_id__meet_JSON = json.loads(
                    serialize(
                        "json",
                        [swimmer_of_id__meet],
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
                swimmers_of_meet = Swimmer.objects.filter(meet_id=meet_id).order_by('last_name', 'first_name')[
                    lower_bound:upper_bound
                ]
                swimmers_of_meet_JSON = json.loads(
                    serialize(
                        "json",
                        swimmers_of_meet,
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

                # * get FK meet JSON
                swimmers_of_meet__meet_JSON = json.loads(
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
            formatted_mi = ""
            if "middle_initials" in request.data and request.data["middle_initials"] is not None:
                for initial in request.data["middle_initials"]:
                    formatted_mi += initial + " "
                formatted_mi = formatted_mi[:-1] # remove trailing space

            new_swimmer = Swimmer(
                first_name=request.data["first_name"],
                last_name=request.data["last_name"],
                prefix=request.data["prefix"],
                suffix=request.data["suffix"],
                middle_initials=formatted_mi,
                age=request.data["age"],
                gender=request.data["gender"],
                team_name=request.data["team_name"],
                team_acronym=request.data["team_acronym"],
                meet_id=meet_id,
            )
            new_swimmer.full_clean()
            new_swimmer.save()
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

        new_swimmer_JSON = json.loads(
            serialize(
                "json",
                [new_swimmer],
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
        # ? not logged in to meet host account
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
            if "prefix" in request.data:
                edited_swimmer.prefix = request.data["prefix"]
            if "suffix" in request.data:
                edited_swimmer.suffix = request.data["suffix"]
            if "middle_initials" in request.data:
                formatted_mi = ""
                if request.data["middle_initials"] is not None:
                    for initial in request.data["middle_initials"]:
                        formatted_mi += initial + " "
                    formatted_mi = formatted_mi[:-1] # remove trailing space
                edited_swimmer.middle_initials = formatted_mi
            if "age" in request.data:
                edited_swimmer.age = request.data["age"]
            if "gender" in request.data:
                edited_swimmer.gender = request.data["gender"]
            if "team_name" in request.data:
                edited_swimmer.team_name = request.data["team_name"]
            if "team_acronym" in request.data:
                edited_swimmer.team_acronym = request.data["team_acronym"]

            edited_swimmer.full_clean()
            edited_swimmer.save()
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

        edited_swimmer_JSON = json.loads(
            serialize(
                "json",
                [edited_swimmer],
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
            swimmer_of_id = Swimmer.objects.get(id=swimmer_id)
        except:
            # ? no swimmer with the given id exists
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
