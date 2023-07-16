from django.urls import path
# from .api_views.Host_view import Host_view
from .api_views.Meet_view import Meet_view
from .api_views.Session_view import Session_view
from .api_views.Swimmer_view import Swimmer_view
from .api_views.Event_view import Event_view
from .api_views.Entry_view import Entry_view
from .api_views.Heat_sheet_view import Heat_sheet_view

urlpatterns = [
    # path("hosts/", Host_view.as_view()),
    path("meets/", Meet_view.as_view()),
    path("sessions/", Session_view.as_view()),
    path("swimmers/", Swimmer_view.as_view()),
    path("events/", Event_view.as_view()),
    path("entries/", Entry_view.as_view()),
    path("heat_sheets/", Heat_sheet_view.as_view()),
]
