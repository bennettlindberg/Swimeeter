from rest_framework.views import Response
from rest_framework import status

from django.core.serializers import serialize
import json

def get_session_preferences(request):
    return {
        "screen_mode": request.session.get("screen_mode", "system"),
        "data_entry_information": request.session.get(
            "data_entry_information", True
        ),
        "data_entry_warnings": request.session.get("data_entry_warnings", True),
        "destructive_action_confirms": request.session.get(
            "destructive_action_confirms", True
        ),
        "motion_safe": request.session.get("motion_safe", True),
    }

def get_user_profile(host_object):
    return json.loads(
        serialize(
            "json",
            [host_object],
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

def get_user_preferences(host_object):
    return json.loads(
        serialize(
            "json",
            [host_object],
            fields=[
                "screen_mode",
                "data_entry_information",
                "data_entry_warnings",
                "destructive_action_confirms",
                "motion_safe",
            ],
        )
    )[0]

def make_full_user_response(user_preferences_JSON, user_profile_JSON):
    return Response(
        {
            "profile": {
                **user_profile_JSON["fields"],
                "id": user_profile_JSON["pk"],
            },
            "preferences": user_preferences_JSON["fields"],
        },
        status=status.HTTP_200_OK,
    )

def make_session_preferences_response(session_preferences_JSON):
    return Response(
        {"preferences": session_preferences_JSON}, status=status.HTTP_200_OK
    )

def make_user_profile_response(user_profile_JSON):
    return Response(
        {
            "profile": {
                **user_profile_JSON["fields"],
                "id": user_profile_JSON["pk"],
            }
        },
        status=status.HTTP_200_OK,
    )