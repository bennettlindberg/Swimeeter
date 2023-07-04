from django.urls import path
from .views import Log_in, Sign_up, Log_out, Update_account, Delete_account

urlpatterns = [
    path('log_in/', Log_in.as_view()),
    path('sign_up/', Sign_up.as_view()),
    path('log_out/', Log_out.as_view()),
    path('update_account/', Update_account.as_view()),
    path('delete_account/', Delete_account.as_view()),
]