from rest_framework.views import APIView, Response
from rest_framework import status

from .. import view_helpers as vh


class Info_view(APIView):
    def get(self, request):
        info_needed = vh.get_query_param(request, "info_needed")
        # ? no "info_needed" param passed
        if isinstance(info_needed, Response):
            return info_needed
        
        # $ get info regarding...
        match info_needed:

            # $ ...editing access
            case "editing_access":
                # * check if logged in
                if not request.user.is_authenticated:
                    return Response(
                        {"has_editing_access": False},
                        status=status.HTTP_200_OK,
                    )

                model_type = vh.get_query_param(request, "model_type")
                # ? no "model_type" param passed
                if isinstance(model_type, Response):
                    return model_type

                model_id = vh.get_query_param(request, "model_id")
                # ? no "model_id" param passed
                if isinstance(model_id, Response):
                    return model_id
                else:
                    model_id = int(model_id)

                model_object = vh.get_model_of_id(model_type, model_id)
                # ? no model_object of model_id exists
                if isinstance(model_object, Response):
                    return model_object

                # * check editing access
                has_editing_access = vh.check_editing_access(request, model_type, model_object)
                # ? internal error checking editing access
                if isinstance(has_editing_access, Response):
                    return has_editing_access
                else:
                    return Response(
                        {"has_editing_access": has_editing_access},
                        status=status.HTTP_200_OK,
                    )
                
            # $ ...relationship tree
            case "relationship_tree":
                model_type = vh.get_query_param(request, "model_type")
                # ? no "model_type" param passed
                if isinstance(model_type, Response):
                    return model_type

                model_id = vh.get_query_param(request, "model_id")
                # ? no "model_id" param passed
                if isinstance(model_id, Response):
                    return model_id
                else:
                    model_id = int(model_id)

                model_object = vh.get_model_of_id(model_type, model_id)
                # ? no model_object of model_id exists
                if isinstance(model_object, Response):
                    return model_object

                # * get relationship tree
                relationship_tree = vh.get_relationship_tree(model_type, model_object)
                # ? internal error getting relationship tree
                if isinstance(relationship_tree, Response):
                    return relationship_tree
                else:
                    return Response(
                        relationship_tree,
                        status=status.HTTP_200_OK,
                    )
