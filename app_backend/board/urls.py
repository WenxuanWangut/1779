from django.urls import path
from . import views

urlpatterns = [
    path('login', views.login, name='login'),
    path('logout', views.logout, name='logout'),
    path('tickets', views.get_tickets, name='get_tickets'),
    path('tickets/create', views.create_ticket, name='create_ticket'),
    path('tickets/<int:ticket_id>', views.update_ticket, name='update_ticket'),
    path('tickets/<int:ticket_id>/delete', views.delete_ticket, name='delete_ticket'),
]

