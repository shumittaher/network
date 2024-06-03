from .models import Followings, User
from django.shortcuts import get_object_or_404


def findExisting(follower_user, followed_user):
    try:
        existing_pair = Followings.objects.get(
            follower=follower_user, 
            followed=followed_user
        )
    except Followings.DoesNotExist:
        existing_pair = None

    return existing_pair

def find_follow_based_on_id(user_id, find_followers):
    
    target_user = get_object_or_404(User, pk = user_id)
    resulting_array = []

    if find_followers == 'True':
        target_pairs = target_user.followees.all()
        
    else:
        target_pairs = target_user.followers.all()
      
    for pair in target_pairs:
        resulting_array.append({'follower': pair.follower.username,
                                'follower_id': pair.follower.id,
                                'followed': pair.followed.username,
                                'followed_id': pair.followed.id,})
        
    return resulting_array