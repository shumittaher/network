
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("follow", views.index, name="follow"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("post_supply", views.post_supply, name="post_supply"),
    path("followed_post/<str:follow>", views.post_supply, name="follwed_post"),
    path("followers_supply/<int:user_id>/<str:followers>", views.followers_supply, name="followers_supply"),
    path("fetch_post/<int:post_id>", views.post_supply, name="fetch_post"),
    path("like_route", views.like_route, name="like_route"),
    path("profile/<int:user_id>", views.profile, name="profile"),
    path("follow_route", views.follow_route, name="follow_route")
]
