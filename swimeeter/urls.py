from django.urls import re_path, include
from django.shortcuts import render

def render_app(request):
    return render(request, 'index.html')

urlpatterns = [
    re_path(r'^api/', include('swimeeter_api_app.urls')),
    re_path(r'^auth/', include('swimeeter_auth_app.urls')),
    re_path(r'^', render_app),
]
