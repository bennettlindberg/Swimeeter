from rest_framework.views import APIView, Response
from rest_framework import status

from ..models import Team, Swimmer, Individual_entry, Relay_entry
from .. import view_helpers as vh

from django.core.exceptions import ValidationError


class Team_view(APIView):
    def get(self, request):
        specific_to = vh.get_query_param(request, "specific_to")
        # ? no "specific_to" param passed
        if isinstance(specific_to, Response):
            return specific_to

        upper_bound_str = vh.get_query_param(request, "upper_bound")
        # ? no "upper_bound" param passed
        if isinstance(upper_bound_str, Response):
            upper_bound = None
        else:
            upper_bound = int(upper_bound_str)

        lower_bound_str = vh.get_query_param(request, "lower_bound")
        # ? no "lower_bound" param passed
        if isinstance(lower_bound_str, Response):
            lower_bound = None
        else:
            lower_bound = int(lower_bound_str)

        # $ get team(s) specific too...
        match specific_to:
            # $ ...id
            case "id":
                team_id = vh.get_query_param(request, "team_id")
                # ? no "team_id" param passed
                if isinstance(team_id, Response):
                    return team_id
                else:
                    team_id = int(team_id)

                team_of_id = vh.get_model_of_id("Team", team_id)
                # ? no team of team_id exists
                if isinstance(team_of_id, Response):
                    return team_of_id

                check_meet_access = vh.check_meet_access_allowed(
                    request, team_of_id.meet
                )
                # ? private meet access not allowed
                if isinstance(check_meet_access, Response):
                    return check_meet_access

                # * get team JSON
                team_JSON = vh.get_JSON_single("Team", team_of_id, True)
                # ? internal error generating JSON
                if isinstance(team_JSON, Response):
                    return team_JSON
                else:
                    return Response(
                        team_JSON,
                        status=status.HTTP_200_OK,
                    )

            # $ ...meet
            case "meet":
                meet_id = vh.get_query_param(request, "meet_id")
                # ? no "meet_id" param passed
                if isinstance(meet_id, Response):
                    return meet_id
                else:
                    meet_id = int(meet_id)

                meet_of_id = vh.get_model_of_id("Meet", meet_id)
                # ? no meet of meet_id exists
                if isinstance(meet_of_id, Response):
                    return meet_of_id

                check_meet_access = vh.check_meet_access_allowed(request, meet_of_id)
                # ? private meet access not allowed
                if isinstance(check_meet_access, Response):
                    return check_meet_access

                teams_of_meet = Team.objects.filter(meet_id=meet_id).order_by(
                    "name", "acronym"
                )

                # @ apply search filtering
                search__name = vh.get_query_param(request, "search__name")
                if isinstance(search__name, str):
                    teams_of_meet = teams_of_meet.filter(name__istartswith=search__name)

                search__acronym = vh.get_query_param(request, "search__acronym")
                if isinstance(search__acronym, str):
                    teams_of_meet = teams_of_meet.filter(acronym__istartswith=search__acronym)

                # * only retrieve request range of values
                teams_of_meet = teams_of_meet[lower_bound:upper_bound]

                # * get teams JSON
                teams_JSON = vh.get_JSON_multiple("Team", teams_of_meet, True)
                # ? internal error generating JSON
                if isinstance(teams_JSON, Response):
                    return teams_JSON
                else:
                    return Response(
                        teams_JSON,
                        status=status.HTTP_200_OK,
                    )

            # ? invalid "specific_to" specification
            case _:
                return Response(
                    "invalid 'specific_to' specification",
                    status=status.HTTP_400_BAD_REQUEST,
                )

    def post(self, request):
        meet_id = vh.get_query_param(request, "meet_id")
        # ? no "meet_id" param passed
        if isinstance(meet_id, Response):
            return meet_id
        else:
            meet_id = int(meet_id)

        meet_of_id = vh.get_model_of_id("Meet", meet_id)
        # ? no meet of meet_id exists
        if isinstance(meet_of_id, Response):
            return meet_of_id

        check_is_host = vh.check_user_is_host(request, meet_of_id.host_id)
        # ? user is not meet host
        if isinstance(check_is_host, Response):
            return check_is_host

        # * create new team
        try:
            new_team = Team(
                name=request.data["name"],
                acronym=request.data["acronym"],
                meet_id=meet_id,
            )

            # * handle any duplicates
            duplicate_handling = vh.get_duplicate_handling(request)
            handle_duplicates = vh.handle_duplicates(
                duplicate_handling, "Team", new_team
            )
            # ? error handling duplicates
            if isinstance(handle_duplicates, Response):
                return handle_duplicates

            new_team.full_clean()
            new_team.save()
        except ValidationError as err:
            # ? invalid creation data passed -> validators
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

        # * get team JSON
        team_JSON = vh.get_JSON_single("Team", new_team, True)
        # ? internal error generating JSON
        if isinstance(team_JSON, Response):
            return team_JSON
        else:
            return Response(
                team_JSON,
                status=status.HTTP_201_CREATED,
            )

    def put(self, request):
        team_id = vh.get_query_param(request, "team_id")
        # ? no "team_id" param passed
        if isinstance(team_id, Response):
            return team_id
        else:
            team_id = int(team_id)

        team_of_id = vh.get_model_of_id("Team", team_id)
        # ? no team of team_id exists
        if isinstance(team_of_id, Response):
            return team_of_id

        check_is_host = vh.check_user_is_host(request, team_of_id.meet.host_id)
        # ? user is not meet host
        if isinstance(check_is_host, Response):
            return check_is_host

        # * update existing team
        try:
            edited_team = Team.objects.get(id=team_id)

            if "name" in request.data:
                edited_team.name = request.data["name"]
            if "acronym" in request.data:
                edited_team.acronym = request.data["acronym"]

            # * handle any duplicates
            duplicate_handling = vh.get_duplicate_handling(request)
            handle_duplicates = vh.handle_duplicates(
                duplicate_handling, "Team", edited_team
            )
            # ? error handling duplicates
            if isinstance(handle_duplicates, Response):
                return handle_duplicates

            edited_team.full_clean()
            edited_team.save()
        except ValidationError as err:
            # ? invalid creation data passed -> validators
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

        # * get team JSON
        team_JSON = vh.get_JSON_single("Team", edited_team, True)
        # ? internal error generating JSON
        if isinstance(team_JSON, Response):
            return team_JSON
        else:
            return Response(
                team_JSON,
                status=status.HTTP_200_OK,
            )

    def delete(self, request):
        team_id = vh.get_query_param(request, "team_id")
        # ? no "team_id" param passed
        if isinstance(team_id, Response):
            return team_id
        else:
            team_id = int(team_id)

        team_of_id = vh.get_model_of_id("Team", team_id)
        # ? no team of team_id exists
        if isinstance(team_of_id, Response):
            return team_of_id

        check_is_host = vh.check_user_is_host(request, team_of_id.meet.host_id)
        # ? user is not meet host
        if isinstance(check_is_host, Response):
            return check_is_host

        swimmers_of_team = Swimmer.objects.filter(team_id=team_id)
        # ? swimmers associated with team exist
        if swimmers_of_team.count() > 0:
            return Response(
                "cannot delete team with associated swimmers",
                status=status.HTTP_400_BAD_REQUEST,
            )

        # * delete existing swimmer
        try:
            team_of_id.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        # ? internal error deleting model
        except Exception as err:
            return Response(
                str(err),
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
