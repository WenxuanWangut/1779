"""
URL configuration for backend project.
"""
from django.urls import path, include

urlpatterns = [
    path('', include('board.urls')),
]

