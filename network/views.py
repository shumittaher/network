from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django.http import JsonResponse
import json
from django.shortcuts import get_object_or_404

from .models import User, Post, Followings
from .forms import PostForm

def index(request):

    if request.method == "POST":

        filled_post = PostForm(request.POST)
        if filled_post.is_valid():
            filled_post.save()
        
        return HttpResponseRedirect(reverse('index'))
          
    new_post_form  = PostForm(initial={'poster':request.user.id})

    return render(request, "network/index.html", {
        'post_form' : new_post_form,
    })

def post_supply(request, post_id = None):

    if not post_id:
        # Fetch all posts (ordered by timestamp)
        posts = Post.objects.all().order_by('-post_timestamp')
        posts_dict = [post.to_dict() for post in posts]
    else:
        # Fetch single post
        post = Post.objects.get(pk=post_id)
        posts_dict = [post.to_dict()]

    # Add "liked" flag for each post
    for post_dict in posts_dict:
        post_dict["liked"] = request.user.id in post_dict['like_ids']

    return JsonResponse(posts_dict, safe=False)

def like_route(request):
        
    if request.method == 'PUT':

        put_data = json.loads(request.body)
        required_post = get_object_or_404(Post, pk = put_data['post_id'])

        if (put_data['enable']):
            required_post.likes.add(request.user)
        
        if (not put_data['enable']):
            required_post.likes.remove(request.user)

        required_post.save()

        return JsonResponse({},status = 200)
    
    else:
        return JsonResponse({'error': 'Invalid operation'},status = 400)

def follow_route(request):

    if request.method == 'PUT':

        put_data = json.loads(request.body)
        followee = get_object_or_404(User, pk = put_data['user_id'])

        try:
            existing_pair = Followings.objects.get(
                follower=request.user, 
                followed=followee
            )
        except Followings.DoesNotExist:
            existing_pair = None  
        
        if put_data['follow']:
            if not existing_pair:
                follow_pair = Followings(follower = request.user, followed = followee)
                follow_pair.save()
                return JsonResponse({"status": "Followed"},status = 200)
            return JsonResponse({"status": "Already Followed"},status = 200)
        else:
            if not existing_pair:
                return JsonResponse({"status": "Already un-Followed"},status = 200)
            existing_pair.delete()
            return JsonResponse({"status": "un-Followed"},status = 200)

def profile(request, user_id):

    profile_user = get_object_or_404(User, pk = user_id)
    follow_incoming = profile_user.followees.all()

    i_follow = False

    for pair in follow_incoming:
        if request.user.id == pair.follower.id:
            i_follow = True

    return render(request, 'network/profile.html',{
        'profile_user' : profile_user,
        'i_follow': i_follow,
        })

def followers_supply(request, user_id, followers):

    profile_user = get_object_or_404(User, pk = user_id)
    resulting_array = []

    if followers == 'True':
        target_pairs = profile_user.followees.all()
        
    else:
        target_pairs = profile_user.followers.all()
      
    for pair in target_pairs:
        resulting_array.append({'follower': pair.follower.username,
                                'followed': pair.followed.username,})
    
    return JsonResponse(resulting_array, status = 200, safe=False)

def login_view(request):

    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")

def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))

def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")
