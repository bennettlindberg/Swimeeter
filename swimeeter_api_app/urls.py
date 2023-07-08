from django.urls import path
from .views import Event_view, Swimmer_view, Entry_view, Meet_view, Heat_view, Heat_assignment_view, Heat_sheet_view

urlpatterns = [
    path('events/', Event_view.as_view()),
    path('swimmers/', Swimmer_view.as_view()),
    path('entries/', Entry_view.as_view()),
    path('meets/', Meet_view.as_view()),
    path('heats/', Heat_view.as_view()),
    path('assignments/', Heat_assignment_view.as_view()),
    path('heat_sheets/', Heat_sheet_view.as_view()),
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