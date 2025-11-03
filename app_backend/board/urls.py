from django.urls import path
from . import views

urlpatterns = [
    path('tickets', views.get_tickets, name='get_tickets'),
]

