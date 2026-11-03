from django.urls import path
from .views import csrf_token_view, register_view, login_view, logout_view, me_view

urlpatterns = [
    path('csrf/', csrf_token_view, name='auth_csrf'),
    path('register/', register_view, name='auth_register'),
    path('login/', login_view, name='auth_login'),
    path('logout/', logout_view, name='auth_logout'),
    path('me/', me_view, name='auth_me'),
]
