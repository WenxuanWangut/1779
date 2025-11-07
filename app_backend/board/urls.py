from django.urls import path
from . import views, project_views

urlpatterns = [
    # Authentication
    path('login', views.login, name='login'),
    path('logout', views.logout, name='logout'),
    
    # Tickets
    path('tickets', views.get_tickets, name='get_tickets'),
    path('tickets/create', views.create_ticket, name='create_ticket'),
    path('tickets/<int:ticket_id>', views.update_ticket, name='update_ticket'),
    path('tickets/<int:ticket_id>/delete', views.delete_ticket, name='delete_ticket'),
    
    # Projects
    path('projects', project_views.get_projects, name='get_projects'),
    path('projects/create', project_views.create_project, name='create_project'),
    path('projects/<uuid:project_id>', project_views.get_project, name='get_project'),
    path('projects/<uuid:project_id>/update', project_views.update_project, name='update_project'),
    path('projects/<uuid:project_id>/delete', project_views.delete_project, name='delete_project'),
]

