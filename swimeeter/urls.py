from django.urls import path, re_path, include
from django.shortcuts import render
from django.views.decorators.csrf import ensure_csrf_cookie

@ensure_csrf_cookie
def render_app(request):
    return render(request, 'index.html')

urlpatterns = [
    path('api/v1/', include('swimeeter_api_app.urls')),
    path('auth/', include('swimeeter_auth_app.urls')),
    re_path(r'^', render_app),
]
