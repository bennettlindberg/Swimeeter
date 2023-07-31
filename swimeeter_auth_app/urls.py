from django.urls import path
from .views import Log_in, Sign_up, Log_out, Update_profile, Update_preferences, Delete_account, Init_check

urlpatterns = [
    path('log_in/', Log_in.as_view()),
    path('sign_up/', Sign_up.as_view()),
    path('log_out/', Log_out.as_view()),
    path('update_profile/', Update_profile.as_view()),
    path('update_preferences/', Update_preferences.as_view()),
    path('delete_account/', Delete_account.as_view()),
    path('init_check/', Init_check.as_view()),
]