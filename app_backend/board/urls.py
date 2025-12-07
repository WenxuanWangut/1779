from django.urls import path
from . import ticket_views, project_views, comment_views

urlpatterns = [
    # Authentication
    path('signup', ticket_views.signup, name='signup'),
    path('login', ticket_views.login, name='login'),
    path('logout', ticket_views.logout, name='logout'),
    
    # Users/Assignees
    path('assignees', ticket_views.search_assignees, name='search_assignees'),
    
    # Tickets
    path('tickets', ticket_views.get_tickets, name='get_tickets'),
    path('tickets/create', ticket_views.create_ticket, name='create_ticket'),
    path('tickets/<int:ticket_id>', ticket_views.update_ticket, name='update_ticket'),
    path('tickets/<int:ticket_id>/delete', ticket_views.delete_ticket, name='delete_ticket'),
    
    # Projects
    path('projects', project_views.get_projects, name='get_projects'),
    path('projects/create', project_views.create_project, name='create_project'),
    path('projects/<uuid:project_id>', project_views.get_project, name='get_project'),
    path('projects/<uuid:project_id>/update', project_views.update_project, name='update_project'),
    path('projects/<uuid:project_id>/delete', project_views.delete_project, name='delete_project'),
    
    # Comments
    path('tickets/<int:ticket_id>/comments', comment_views.get_comments, name='get_comments'),
    path('tickets/<int:ticket_id>/comments/create', comment_views.create_comment, name='create_comment'),
    path('comments/<uuid:comment_id>', comment_views.update_comment, name='update_comment'),
    path('comments/<uuid:comment_id>/delete', comment_views.delete_comment, name='delete_comment'),
]

