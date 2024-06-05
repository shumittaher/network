from django.test import TestCase
from django.template import Template, Context
from django.test.client import Client
from .models import Followings, User
from django.core.exceptions import ValidationError
from django.db import IntegrityError


client = Client()

# Create your tests here.

class Tests(TestCase):

    def test_check_postsupply(self):
        """check post supply is ok"""
        response = client.get('/post_supply/1/false/0')
        assert response.status_code == 200

    def test_valid_follow(self):

        """check following is ok"""

        user1 = User.objects.create(username = '1') 
        user2 = User.objects.create(username = '2') 

        f1 = Followings.objects.create(follower = user1, followed = user2)
        f3 = Followings.objects.create(follower = user2, followed = user1)
        
        self.assertTrue(f3.cannot_follow_self())
        self.assertTrue(f1.cannot_follow_self())
        
        with self.assertRaises(ValidationError):
            Followings.objects.create(follower=user1, followed=user1)        
        with self.assertRaises(IntegrityError):
            Followings.objects.create(follower=user1, followed=user2)        