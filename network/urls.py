
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("post_supply", views.post_supply, name="post_supply"),
    path("like_route", views.like_route, name="like_route")
]
