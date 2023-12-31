from django.urls import path
from .api_views.Meet_view import Meet_view
from .api_views.Pool_view import Pool_view
from .api_views.Session_view import Session_view
from .api_views.Event_view import Event_view
from .api_views.Team_view import Team_view
from .api_views.Swimmer_view import Swimmer_view
from .api_views.Individual_entry_view import Individual_entry_view
from .api_views.Relay_entry_view import Relay_entry_view
from .api_views.Heat_sheet_view import Heat_sheet_view
from .api_views.Info_view import Info_view

urlpatterns = [
    path("meets/", Meet_view.as_view()),
    path("pools/", Pool_view.as_view()),
    path("sessions/", Session_view.as_view()),
    path("events/", Event_view.as_view()),
    path("teams/", Team_view.as_view()),
    path("swimmers/", Swimmer_view.as_view()),
    path("individual_entries/", Individual_entry_view.as_view()),
    path("relay_entries/", Relay_entry_view.as_view()),
    path("heat_sheets/", Heat_sheet_view.as_view()),
    path("info/", Info_view.as_view()),
]
