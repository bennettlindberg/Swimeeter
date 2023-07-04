from django.urls import path
from .views import Event_view, Swimmer_view, Entry_view, Meet_view, Heat_view, Heat_assignment_view, Heat_sheet_view

urlpatterns = [
    path('event/', Event_view.as_view()),
    path('swimmer/', Swimmer_view.as_view()),
    path('entry/', Entry_view.as_view()),
    path('meet/', Meet_view.as_view()),
    path('heat/', Heat_view.as_view()),
    path('assignment/', Heat_assignment_view.as_view()),
    path('heat_sheet/', Heat_sheet_view.as_view()),
]

# ! HOST
# edit, delete one host <-- in auth app

# ! EVENT
# edit, delete, create one event
# get all events for a specific meet

# ! SWIMMER
# edit, delete, create one swimmer
# get all swimmers for a specific meet

# ! ENTRY
# edit, delete, create one entry
# get all entries for a specific meet and event
# get all entries for a specific meet and swimmer

# ! HEAT
# get all heats for a specific meet and event

# ! ASSIGNMENT
# get all heat assignments for a specific meet and event and heat

# ! MEET
# get all meets
# get all meets for a specific host
# edit, delete, create one meet

# ! HEAT SHEET
# special: generate heat sheet <-- under Heat_sheet_view