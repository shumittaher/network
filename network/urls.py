
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("follow", views.index, name="follow"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("profile/<int:user_id>", views.profile, name="profile"),
    #json requests
    path("post_supply", views.post_supply),
    path("followed_post/<str:follow>", views.post_supply),
    path("fetch_post/<int:post_id>", views.post_supply),
    path("followers_supply/<int:user_id>/<str:followers>", views.followers_supply),
    path("like_route", views.like_route),
    path("follow_route", views.follow_route)
]
