from .models import Followings

def findExisting(follower_user, followed_user):
    try:
        existing_pair = Followings.objects.get(
            follower=follower_user, 
            followed=followed_user
        )
    except Followings.DoesNotExist:
        existing_pair = None

    return existing_pair