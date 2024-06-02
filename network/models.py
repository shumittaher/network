from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.exceptions import ValidationError



class User(AbstractUser):
    pass

class Followings(models.Model):
    follower = models.ForeignKey(User, on_delete=models.CASCADE, related_name='followers')
    followed = models.ForeignKey(User, on_delete=models.CASCADE ,related_name='followees')

    def clean(self):
        if self.follower == self.followed:
            raise ValidationError('Follower and followed user cannot be the same.')
        return super().clean()

    def save(self, *args, **kwargs):
        self.clean()
        return super().save(*args, **kwargs)

class Post(models.Model):
    post_id = models.AutoField(primary_key=True)
    post_title = models.CharField(max_length=200)
    post_text = models.TextField()
    post_timestamp = models.DateTimeField('date published', auto_now_add=True)
    poster = models.ForeignKey(User, on_delete=models.DO_NOTHING, related_name='posts_creator')
    likes = models.ManyToManyField(User)

    def to_dict(self):
        return {
            'post_id': self.post_id,
            'post_title': self.post_title,
            'post_text': self.post_text,
            'post_timestamp': self.post_timestamp.isoformat(),
            'poster': self.poster.username,
            'poster_id': self.poster.id,
            'like_ids': [user.id for user in self.likes.all()],
            'likes_count': self.likes.count()
        }