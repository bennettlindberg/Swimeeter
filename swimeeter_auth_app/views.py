from rest_framework.views import APIView, Response
from rest_framework import status
from django.core.exceptions import ValidationError

from django.core.serializers import serialize
import json

from django.contrib.auth import login, logout, authenticate

from .models import Host

from . import view_helpers as vh


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

        login(request, user)

        # * copy user preferences to session data (login associates session with user)
        request.session["screen_mode"] = user.screen_mode
        request.session["data_entry_information"] = user.data_entry_information
        request.session[
            "destructive_action_confirms"
        ] = user.destructive_action_confirms
        request.session["motion_safe"] = user.motion_safe

        # * get user JSON
        user_profile_JSON = vh.get_user_profile(user)
        user_preferences_JSON = vh.get_user_preferences(user)
        return vh.make_full_user_response(user_preferences_JSON, user_profile_JSON)


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

        # ? email already associated with an account
        users_of_email = Host.objects.filter(email=request.data["email"])
        if users_of_email.count() > 0:
            return Response(
                "user with email already exists",
                status=status.HTTP_403_FORBIDDEN,
            )

        # ? user account already exists
        if user is not None and user.is_active:
            return Response(
                "user account already exists",
                status=status.HTTP_403_FORBIDDEN,
            )

        # * create new user
        else:
            try:
                user = Host.objects.create_user(
                    # * credentials
                    username=request.data["email"],
                    email=request.data["email"],
                    password=request.data["password"],
                    # * name
                    first_name=request.data["first_name"],
                    last_name=request.data["last_name"],
                    prefix=request.data.get("prefix", ""),
                    suffix=request.data.get("suffix", ""),
                    middle_initials=request.data.get("middle_initials", ""),
                    # * preferences
                    screen_mode=request.session.get("screen_mode", "system"),
                    data_entry_information=request.session.get(
                        "data_entry_information", True
                    ),
                    destructive_action_confirms=request.session.get(
                        "destructive_action_confirms", True
                    ),
                    motion_safe=request.session.get("motion_safe", True),
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

        # * get user JSON
        user_profile_JSON = vh.get_user_profile(user)
        user_preferences_JSON = vh.get_user_preferences(user)
        return vh.make_full_user_response(user_preferences_JSON, user_profile_JSON)


class Log_out(APIView):
    def post(self, request):
        # ? user not logged in
        if not request.user.is_authenticated:
            return Response(
                "user not logged in",
                status=status.HTTP_401_UNAUTHORIZED,
            )

        logout(request)

        # * get preferences JSON (session resets after logout)
        session_preferences_JSON = vh.get_session_preferences(request)
        return vh.make_session_preferences_response(session_preferences_JSON)


class Update_profile(APIView):
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
                request.user.middle_initials = request.data["middle_initials"]

            # ~ handle password reset
            if "new_password" in request.data:
                # ? current password not provided
                if "old_password" not in request.data:
                    return Response(
                        "must pass current password to update password",
                        status=status.HTTP_403_FORBIDDEN,
                    )

                user = authenticate(
                    username=request.data["email"],
                    password=request.data["old_password"],
                )

                # ? log in credentials invalid or for wrong account
                if user is None or user != request.user:
                    return Response(
                        "log in credentials invalid",
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

        # * get profile JSON
        edited_host_profile_JSON = json.loads(
            serialize(
                "json",
                [request.user],
                fields=[
                    "email",
                    "first_name",
                    "last_name",
                    "prefix",
                    "suffix",
                    "middle_initials",
                ],
            )
        )[0]
        return Response(
            {
                "profile": {
                    **edited_host_profile_JSON["fields"],
                    "id": edited_host_profile_JSON["pk"],
                }
            },
            status=status.HTTP_200_OK,
        )


class Update_preferences(APIView):
    def put(self, request):
        # $ always update session data
        if "screen_mode" in request.data:
            request.session["screen_mode"] = request.data["screen_mode"]
        if "data_entry_information" in request.data:
            request.session["data_entry_information"] = request.data[
                "data_entry_information"
            ]
        if "destructive_action_confirms" in request.data:
            request.session["destructive_action_confirms"] = request.data[
                "destructive_action_confirms"
            ]
        if "motion_safe" in request.data:
            request.session["motion_safe"] = request.data["motion_safe"]

        # $ logged in -> also change user
        if request.user.is_authenticated:
            # * update existing user
            try:
                if "screen_mode" in request.data:
                    request.user.screen_mode = request.data["screen_mode"]
                if "data_entry_information" in request.data:
                    request.user.data_entry_information = request.data[
                        "data_entry_information"
                    ]
                if "destructive_action_confirms" in request.data:
                    request.user.destructive_action_confirms = request.data[
                        "destructive_action_confirms"
                    ]
                if "motion_safe" in request.data:
                    request.user.motion_safe = request.data["motion_safe"]

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

        # * get preferences JSON
        session_preferences_JSON = {
            "screen_mode": request.session.get("screen_mode", "system"),
            "data_entry_information": request.session.get(
                "data_entry_information", True
            ),
            "destructive_action_confirms": request.session.get(
                "destructive_action_confirms", True
            ),
            "motion_safe": request.session.get("motion_safe", True),
        }
        return Response(
            {"preferences": session_preferences_JSON}, status=status.HTTP_200_OK
        )


class Delete_account(APIView):
    def delete(self, request):
        # ? user not logged in
        if not request.user.is_authenticated:
            return Response(
                "user not logged in",
                status=status.HTTP_401_UNAUTHORIZED,
            )

        deleted_user = request.user

        logout(request)

        # * delete existing user
        try:
            deleted_user.delete()

            # * get preferences JSON (session resets after logout)
            session_preferences_JSON = vh.get_session_preferences(request)
            return vh.make_session_preferences_response(session_preferences_JSON)
        # ? internal error deleting user
        except Exception as err:
            return Response(
                str(err),
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class Init_check(APIView):
    def get(self, request):
        # $ back end not logged in
        if not request.user.is_authenticated:
            return Response(
                {
                    "logged_in": False,
                    "preferences": vh.get_session_preferences(request),
                },
                status=status.HTTP_200_OK,
            )

        # $ back end logged in
        else:
            # * get user JSON
            user_profile_JSON = vh.get_user_profile(request.user)
            user_preferences_JSON = vh.get_user_preferences(request.user)
            return Response(
                {
                    "logged_in": True,
                    "profile": {
                        **user_profile_JSON["fields"],
                        "id": user_profile_JSON["pk"],
                    },
                    "preferences": user_preferences_JSON["fields"],
                },
                status=status.HTTP_200_OK,
            )
