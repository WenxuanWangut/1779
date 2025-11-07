from django.apps import AppConfig
import sys


class BoardConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'board'
    
    def ready(self):
        # Only run seed data when running the server (not during migrations or other commands)
        # Also avoid running twice due to Django's autoreloader
        if 'runserver' in sys.argv and not hasattr(self, '_seed_data_run'):
            BoardConfig._seed_data_run = True
            self.seed_test_data()
    
    def seed_test_data(self):
        """Create test users, projects, and tickets on startup."""
        from .models import User, Project, Ticket
        
        # Create test users using get_or_create
        user1, created1 = User.objects.get_or_create(
            email='alice@example.com',
            defaults={
                'name': 'Alice Smith',
                'password': 'password123'
            }
        )
        if created1:
            print(f"✓ Created user: {user1.email}")
        
        user2, created2 = User.objects.get_or_create(
            email='bob@example.com',
            defaults={
                'name': 'Bob Johnson',
                'password': 'password456'
            }
        )
        if created2:
            print(f"✓ Created user: {user2.email}")
        
        # Create test projects using get_or_create
        project1, created = Project.objects.get_or_create(
            name='ECE1779 Final Project',
            defaults={
                'created_by': user1
            }
        )
        if created:
            print(f"✓ Created project: {project1.name}")
        
        project2, created = Project.objects.get_or_create(
            name='Personal Website',
            defaults={
                'created_by': user2
            }
        )
        if created:
            print(f"✓ Created project: {project2.name}")
        
        # Create test tickets using get_or_create with project and assignees
        ticket1, created = Ticket.objects.get_or_create(
            name='Setup project repository',
            defaults={
                'description': 'Initialize the Git repository and set up the project structure',
                'status': Ticket.Status.DONE,
                'project': project1,
                'assignee': user1
            }
        )
        if created:
            print(f"✓ Created ticket: {ticket1.name}")
        
        ticket2, created = Ticket.objects.get_or_create(
            name='Design database schema',
            defaults={
                'description': 'Create the database models for users and tickets',
                'status': Ticket.Status.DONE,
                'project': project1,
                'assignee': user2
            }
        )
        if created:
            print(f"✓ Created ticket: {ticket2.name}")
        
        ticket3, created = Ticket.objects.get_or_create(
            name='Implement REST API endpoints',
            defaults={
                'description': 'Create GET /tickets endpoint and user management APIs',
                'status': Ticket.Status.IN_PROGRESS,
                'project': project1,
                'assignee': user1
            }
        )
        if created:
            print(f"✓ Created ticket: {ticket3.name}")
        
        ticket4, created = Ticket.objects.get_or_create(
            name='Add authentication',
            defaults={
                'description': 'Implement user authentication and authorization',
                'status': Ticket.Status.TODO,
                'project': project1,
                'assignee': user2
            }
        )
        if created:
            print(f"✓ Created ticket: {ticket4.name}")
        
        ticket5, created = Ticket.objects.get_or_create(
            name='Deploy to production',
            defaults={
                'description': 'Set up CI/CD pipeline and deploy the application',
                'status': Ticket.Status.TODO,
                'project': project1,
                'assignee': user1
            }
        )
        if created:
            print(f"✓ Created ticket: {ticket5.name}")
        
        ticket6, created = Ticket.objects.get_or_create(
            name='Add real-time notifications',
            defaults={
                'description': 'Implement WebSocket support for real-time updates',
                'status': Ticket.Status.WONT_DO,
                'project': project2,
                'assignee': None
            }
        )
        if created:
            print(f"✓ Created ticket: {ticket6.name}")
        
        print(f"✓ Test data seeding complete!")
        print(f"  - Users: {User.objects.count()} total")
        print(f"  - Projects: {Project.objects.count()} total")
        print(f"  - Tickets: {Ticket.objects.count()} total")

