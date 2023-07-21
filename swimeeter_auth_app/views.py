from rest_framework.views import APIView, Response
from rest_framework import status
from django.core.exceptions import ValidationError

from django.core.serializers import serialize
import json

from django.contrib.auth import login, logout, authenticate

from .models import Host


class Log_in(APIView):
    def post(self, request):
        # ? user already logged in
        if request.user.is_authenticated:
            return Response(
                "user already logged in",
                status=status.HTTP_403_FORBIDDEN,
            )

        user = authenticate(
            username=request.data["email"], password=request.data["password"]
        )

        # ? user account does not exist
        if user is None:
            return Response(
                "user account does not exist",
                status=status.HTTP_401_UNAUTHORIZED,
            )

        # ~ reactivating deactivated account
        if not user.is_active:
            user.is_active = True
            user.save()

        login(request, user)

        # * get user JSON
        user_JSON = json.loads(
            serialize(
                "json",
                [user],
                fields=[
                    "first_name",
                    "last_name",
                    "prefix",
                    "suffix",
                    "middle_initials",
                    "screen_mode",
                    "data_entry_warnings",
                    "destructive_action_confirms",
                ],
            )
        )[0]
        return Response(user_JSON, status=status.HTTP_200_OK)


class Sign_up(APIView):
    def post(self, request):
        # ? user already logged in
        if request.user.is_authenticated:
            return Response(
                "user already logged in",
                status=status.HTTP_403_FORBIDDEN,
            )

        user = authenticate(
            username=request.data["email"], password=request.data["password"]
        )

        # ? user account already exists
        if user is not None and user.is_active:
            return Response(
                "user account already exists",
                status=status.HTTP_403_FORBIDDEN,
            )

        # ~ reactivating deactivated account
        if user is not None and not user.is_active:
            user.is_active = True
            user.save()

        # * create new user
        else:
            try:
                # * format middle initials ("ABC" -> "A B C")
                formatted_mi = ""
                if (
                    "middle_initials" in request.data
                    and request.data["middle_initials"] is not None
                ):
                    for initial in request.data["middle_initials"]:
                        formatted_mi += initial + " "
                    formatted_mi = formatted_mi[:-1]  # remove trailing space

                user = Host.objects.create_user(
                    username=request.data["email"],
                    email=request.data["email"],
                    password=request.data["password"],
                    first_name=request.data["first_name"],
                    last_name=request.data["last_name"],
                    prefix=request.data["prefix"],
                    suffix=request.data["suffix"],
                    middle_initials=formatted_mi,
                    screen_mode="system",
                    data_entry_warnings=True,
                    destructive_action_confirms=True,
                )

                user.full_clean()
            except ValidationError as err:
                # ? invalid creation data passed -> validators
                user.delete()

                return Response(
                    "; ".join(err.messages),
                    status=status.HTTP_400_BAD_REQUEST,
                )
            except Exception as err:
                # ? invalid creation data passed -> general
                user.delete()

                return Response(
                    str(err),
                    status=status.HTTP_400_BAD_REQUEST,
                )

        login(request, user)

        # * get host JSON
        user_JSON = json.loads(
            serialize(
                "json",
                [user],
                fields=[
                    "first_name",
                    "last_name",
                    "prefix",
                    "suffix",
                    "middle_initials",
                    "screen_mode",
                    "data_entry_warnings",
                    "destructive_action_confirms",
                ],
            )
        )[0]
        return Response(user_JSON, status=status.HTTP_201_CREATED)


class Log_out(APIView):
    def post(self, request):
        # ? user not logged in
        if not request.user.is_authenticated:
            return Response(
                "user not logged in",
                status=status.HTTP_401_UNAUTHORIZED,
            )

        logout(request)

        return Response(status=status.HTTP_204_NO_CONTENT)


class Update_account(APIView):
    def put(self, request):
        # ? user not logged in
        if not request.user.is_authenticated:
            return Response(
                "user not logged in",
                status=status.HTTP_401_UNAUTHORIZED,
            )

        # * update existing user
        try:
            if "first_name" in request.data:
                request.user.first_name = request.data["first_name"]
            if "last_name" in request.data:
                request.user.last_name = request.data["last_name"]
            if "prefix" in request.data:
                request.user.prefix = request.data["prefix"]
            if "suffix" in request.data:
                request.user.suffix = request.data["suffix"]

            if "middle_initials" in request.data:
                # * format middle initials ("ABC" -> "A B C")
                formatted_mi = ""
                if request.data["middle_initials"] is not None:
                    for initial in request.data["middle_initials"]:
                        formatted_mi += initial + " "
                    formatted_mi = formatted_mi[:-1]  # remove trailing space
                request.user.middle_initials = formatted_mi

            # ~ handle password reset
            if "new_password" in request.data:
                # ? original password not provided
                if "old_password" not in request.data:
                    return Response(
                        "must pass original password to update password",
                        status=status.HTTP_403_FORBIDDEN,
                    )

                user = authenticate(
                    username=request.data["email"],
                    password=request.data["old_password"],
                )

                # ? log in credentials invalid
                if user is None:
                    return Response(
                        "log in credentials invalid",
                        status=status.HTTP_401_UNAUTHORIZED,
                    )

                # ? log in credentials for wrong account
                if user != request.user:
                    return Response(
                        "log in credentials invalid (wrong account)",
                        status=status.HTTP_401_UNAUTHORIZED,
                    )

                request.user.set_password(request.data["new_password"])

            request.user.full_clean()
            request.user.save()
        except ValidationError as err:
            # ? invalid update data passed -> validators
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

        # * get host JSON
        edited_host_JSON = json.loads(
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
        return Response(edited_host_JSON, status=status.HTTP_200_OK)


class Delete_account(APIView):
    def delete(self, request):
        # ? user not logged in
        if not request.user.is_authenticated:
            return Response(
                "user not logged in",
                status=status.HTTP_401_UNAUTHORIZED,
            )

        # * delete existing user
        try:
            request.user.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        # ? internal error deleting user
        except Exception as err:
            return Response(
                str(err),
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class Deactivate_account(APIView):
    def put(self, request):
        # ? user not logged in
        if not request.user.is_authenticated:
            return Response(
                "user not logged in",
                status=status.HTTP_401_UNAUTHORIZED,
            )

        # ? user account already deactivated
        if not request.user.is_active:
            return Response(
                "user account already deactivated",
                status=status.HTTP_403_FORBIDDEN,
            )

        # * deactivate existing user
        try:
            request.user.is_active = False
            request.user.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        # ? internal error deactivating user
        except Exception as err:
            return Response(
                str(err),
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class Init_check(APIView):
    def get(self, request):
        # ? back end not logged in
        if not request.user.is_authenticated:
            return Response(
                {
                    "screen_mode": request.session.get("screen_mode", "system"),
                    "data_entry_warnings": request.session.get(
                        "data_entry_warnings", True
                    ),
                    "destructive_action_confirms": request.session.get(
                        "destructive_action_confirms", True
                    ),
                },
                status=status.HTTP_200_OK,
            )

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
                    "screen_mode",
                    "data_entry_warnings",
                    "destructive_action_confirms",
                ],
            )
        )[0]
        return Response(current_host_JSON, status=status.HTTP_200_OK)


class Update_settings(APIView):
    def put(self, request):
        # $ always update session data
        if "screen_mode" in request.data:
            request.session["screen_mode"] = request.data["screen_mode"]
        if "data_entry_warnings" in request.data:
            request.session["data_entry_warnings"] = request.data["data_entry_warnings"]
        if "destructive_action_confirms" in request.data:
            request.session["destructive_action_confirms"] = request.data[
                "destructive_action_confirms"
            ]

        # $ logged in -> also change user
        if request.user.is_authenticated:
            # * update existing user
            try:
                if "screen_mode" in request.data:
                    request.user.screen_mode = request.data["screen_mode"]
                if "data_entry_warnings" in request.data:
                    request.user.data_entry_warnings = request.data[
                        "data_entry_warnings"
                    ]
                if "destructive_action_confirms" in request.data:
                    request.user.destructive_action_confirms = request.data[
                        "destructive_action_confirms"
                    ]

                request.user.full_clean()
                request.user.save()
            except ValidationError as err:
                # ? invalid update data passed -> validators
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

        return Response(status=status.HTTP_200_OK)
