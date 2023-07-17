from rest_framework.views import APIView, Response
from rest_framework import status
from django.core.exceptions import ValidationError

from django.core.serializers import serialize
import json

from django.contrib.auth import login, logout, authenticate

from .models import Host


class Log_in(APIView):
    def post(self, request):
        # ? already logged in
        if request.user.is_authenticated:
            return Response(
                {"log_in_success": False, "reason": "already logged in"},
                status=status.HTTP_403_FORBIDDEN,
            )

        user = authenticate(
            username=request.data["email"], password=request.data["password"]
        )

        # ? account does not exist
        if user is None or not user.is_active:
            return Response(
                {"log_in_success": False, "reason": "account does not exist"},
                status=status.HTTP_403_FORBIDDEN,
            )

        login(request, user)

        # * get host JSON
        userJSON = json.loads(
            serialize(
                "json",
                [user],
                fields=[
                    "first_name",
                    "last_name",
                    "prefix",
                    "suffix",
                    "middle_initials",
                ],
            )
        )[0]
        return Response({"log_in_success": True, "user": userJSON})


class Sign_up(APIView):
    def post(self, request):
        # ? already logged in
        if request.user.is_authenticated:
            return Response(
                {"sign_up_success": False, "reason": "already logged in"},
                status=status.HTTP_403_FORBIDDEN,
            )

        user = authenticate(
            username=request.data["email"], password=request.data["password"]
        )

        # ? account already exists
        if user is not None and user.is_active:
            return Response(
                {"sign_up_success": False, "reason": "account already exists"},
                status=status.HTTP_403_FORBIDDEN,
            )

        try:
            formatted_mi = ""
            if "middle_initials" in request.data and request.data["middle_initials"] is not None:
                for initial in request.data["middle_initials"]:
                    formatted_mi += initial + " "
                formatted_mi = formatted_mi[:-1] # remove trailing space

            new_host = Host.objects.create_user(
                username=request.data["email"],
                email=request.data["email"],
                password=request.data["password"],
                first_name=request.data["first_name"],
                last_name=request.data["last_name"],
                prefix=request.data["prefix"],
                suffix=request.data["suffix"],
                middle_initials=formatted_mi,
            )

            new_host.full_clean()
        except ValidationError as err:
            # ? invalid creation data passed -> validators
            new_host.delete()

            return Response(
                {"sign_up_success": False, "reason": "; ".join(err.messages)},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception as err:
            # ? invalid creation data passed -> general
            new_host.delete()

            return Response(
                {"sign_up_success": False, "reason": str(err)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        login(request, user)

        # * get host JSON
        new_host_JSON = json.loads(
            serialize(
                "json",
                [new_host],
                fields=[
                    "first_name",
                    "last_name",
                    "prefix",
                    "suffix",
                    "middle_initials",
                ],
            )
        )[0]
        return Response({"sign_up_success": True, "user": new_host_JSON})


class Log_out(APIView):
    def post(self, request):
        # ? not logged in
        if not request.user.is_authenticated:
            return Response(
                {"log_out_success": False, "reason": "not logged in"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        logout(request)

        return Response({"log_out_success": True})


class Update_account(APIView):
    def put(self, request):
        host_id = request.query_params.get("host_id")
        # ? no host id passed
        if host_id is None:
            return Response(
                {"put_success": False, "reason": "no host id passed"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # ? not logged into account requested to be edited
        if not request.user.is_authenticated:
            return Response(
                {
                    "delete_success": False,
                    "reason": "not logged into account requested to be edited",
                },
                status=status.HTTP_401_UNAUTHORIZED,
            )
        elif request.user.id != host_id:
            return Response(
                {
                    "delete_success": False,
                    "reason": "not logged into account requested to be edited",
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        try:
            edited_host = Host.objects.get(id=host_id)

            if "first_name" in request.data:
                edited_host.first_name = request.data["first_name"]
            if "last_name" in request.data:
                edited_host.last_name = request.data["last_name"]
            if "prefix" in request.data:
                edited_host.prefix = request.data["prefix"]
            if "suffix" in request.data:
                edited_host.suffix = request.data["suffix"]
            if "middle_initials" in request.data:
                formatted_mi = ""
                if request.data["middle_initials"] is not None:
                    for initial in request.data["middle_initials"]:
                        formatted_mi += initial + " "
                    formatted_mi = formatted_mi[:-1] # remove trailing space
                edited_host.middle_initials = formatted_mi

            edited_host.full_clean()
            edited_host.save()
        except ValidationError as err:
            # ? invalid update data passed -> validators
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

        # * get host JSON
        edited_host_JSON = json.loads(
            serialize(
                "json",
                [edited_host],
                fields=[
                    "first_name",
                    "last_name",
                    "prefix",
                    "suffix",
                    "middle_initials",
                ],
            )
        )[0]
        return Response({"put_success": True, "user": edited_host_JSON})


class Delete_account(APIView):
    def delete(self, request):
        host_id = request.query_params.get("host_id")
        # ? no host id passed
        if host_id is None:
            return Response(
                {"delete_success": False, "reason": "no host id passed"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # ? not logged into account requested to be edited
        if not request.user.is_authenticated:
            return Response(
                {
                    "delete_success": False,
                    "reason": "not logged into account requested to be deleted",
                },
                status=status.HTTP_401_UNAUTHORIZED,
            )
        elif request.user.id != host_id:
            return Response(
                {
                    "delete_success": False,
                    "reason": "not logged into account requested to be deleted",
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        try:
            host_of_id = Host.objects.get(id=host_id)
        except:
            # ? no host with the given id exists
            return Response(
                {
                    "delete_success": False,
                    "reason": "no host with the given id exists",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        host_of_id.delete()

        return Response({"delete_success": True})


class Init_check(APIView):
    def get(self, request):
        # ? back end not logged in
        if not request.user.is_authenticated:
            return Response({"get_success": False, "reason": "back end not logged in"})

        # * get host JSON
        current_host_JSON = json.loads(
            serialize(
                "json",
                [request.user],
                fields=[
                    "first_name",
                    "last_name",
                    "prefix",
                    "suffix",
                    "middle_initials",
                ],
            )
        )[0]
        return Response({"get_success": True, "user": current_host_JSON})
