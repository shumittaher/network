from django import forms
from .models import Post
from django.forms import widgets


class PostForm(forms.ModelForm):
  class Meta:
    model = Post
    fields = ['post_title', 'post_text', 'poster']
    widgets = {
        'post_title': widgets.TextInput(attrs={'class': 'form-control'}),
        'post_text': widgets.Textarea(attrs={'class': 'form-control'}),
        'poster': widgets.HiddenInput
    }

    labels = {
        'post_title': 'Title',
        'post_text': 'Post'
    }
