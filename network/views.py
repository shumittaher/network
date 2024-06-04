from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.contrib.auth.decorators import login_required
import json
from math import ceil

from .models import User, Post, Followings
from .forms import PostForm
from .utils import findExisting, find_follow_based_on_id

def index(request):

    if request.method == "POST":

        filled_post = PostForm(request.POST)
        if filled_post.is_valid():
            filled_post.save()
        
        return HttpResponseRedirect(reverse('index'))
          
    new_post_form  = PostForm(initial={'poster':request.user.id})

    return render(request, "network/index.html", {
        'post_form' : new_post_form,
        'follow_posts': request.path,
        'user_id': request.user.id
    })

@login_required(login_url ='/login')
def follow(request):
    return index(request)

def post_supply(request, post_id, follow = 'false', page = 1):

    follow = follow == 'true'

    if not post_id:
        # Fetch all posts (ordered by timestamp)
        posts = Post.objects.all().order_by('-post_timestamp')

        if follow:
            followed_ids= []
            followed_pairs = find_follow_based_on_id(request.user.id, False)
            for pair in followed_pairs:
                followed_ids.append(pair['followed_id'])
            posts = posts.filter(poster__id__in=followed_ids)

        posts_in_page = posts[(page*10)-10: page*10]
        number_of_posts = posts.count()

    else:
        # Fetch single post and put in an array
        posts_in_page = [Post.objects.get(pk=post_id)]
        number_of_posts = 1
    
    page_required = ceil(number_of_posts/10)
    
    posts_dict = [post.to_dict() for post in posts_in_page]

    # Add "liked" flag and identify last post for each post
    for post_dict in posts_dict:
        post_dict["liked"] = request.user.id in post_dict['like_ids']

    result_dict = {'posts_dict': posts_dict , 'last_page': page_required}

    return JsonResponse(result_dict, safe=False)

@login_required(login_url ='/login')
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

@login_required(login_url ='/login')
def follow_route(request):

    if request.method == 'PUT':

        put_data = json.loads(request.body)
        followee = get_object_or_404(User, pk = put_data['user_id'])

        existing_pair = findExisting(request.user, followee)
        
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

@login_required(login_url ='/login')
def profile(request, user_id):

    profile_user = get_object_or_404(User, pk = user_id)

    if request.user != profile_user:
        existing_pair = findExisting(request.user, profile_user)
        if existing_pair:
            i_follow = True
        else:
            i_follow = False
    else:
        i_follow = 'Self'


    return render(request, 'network/profile.html',{
        'profile_user' : profile_user,
        'i_follow': i_follow,
        })

@login_required(login_url ='/login')
def followers_supply(request, user_id, followers):

    resulting_array = find_follow_based_on_id(user_id, followers)
    
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
