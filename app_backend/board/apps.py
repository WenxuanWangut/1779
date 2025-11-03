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
        """Create test users and tickets on startup."""
        from .models import User, Ticket
        
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
        
        # Create test tickets using get_or_create with assignees
        ticket1, created = Ticket.objects.get_or_create(
            name='Setup project repository',
            defaults={
                'description': 'Initialize the Git repository and set up the project structure',
                'status': Ticket.Status.DONE,
                'assignee': user1
            }
        )
        if created:
            print(f"✓ Created ticket: {ticket1.name}")
        # Update assignee if not set
        if not ticket1.assignee:
            ticket1.assignee = user1
            ticket1.save()
        
        ticket2, created = Ticket.objects.get_or_create(
            name='Design database schema',
            defaults={
                'description': 'Create the database models for users and tickets',
                'status': Ticket.Status.DONE,
                'assignee': user2
            }
        )
        if created:
            print(f"✓ Created ticket: {ticket2.name}")
        if not ticket2.assignee:
            ticket2.assignee = user2
            ticket2.save()
        
        ticket3, created = Ticket.objects.get_or_create(
            name='Implement REST API endpoints',
            defaults={
                'description': 'Create GET /tickets endpoint and user management APIs',
                'status': Ticket.Status.IN_PROGRESS,
                'assignee': user1
            }
        )
        if created:
            print(f"✓ Created ticket: {ticket3.name}")
        if not ticket3.assignee:
            ticket3.assignee = user1
            ticket3.save()
        
        ticket4, created = Ticket.objects.get_or_create(
            name='Add authentication',
            defaults={
                'description': 'Implement user authentication and authorization',
                'status': Ticket.Status.TODO,
                'assignee': user2
            }
        )
        if created:
            print(f"✓ Created ticket: {ticket4.name}")
        if not ticket4.assignee:
            ticket4.assignee = user2
            ticket4.save()
        
        ticket5, created = Ticket.objects.get_or_create(
            name='Deploy to production',
            defaults={
                'description': 'Set up CI/CD pipeline and deploy the application',
                'status': Ticket.Status.TODO,
                'assignee': user1
            }
        )
        if created:
            print(f"✓ Created ticket: {ticket5.name}")
        if not ticket5.assignee:
            ticket5.assignee = user1
            ticket5.save()
        
        ticket6, created = Ticket.objects.get_or_create(
            name='Add real-time notifications',
            defaults={
                'description': 'Implement WebSocket support for real-time updates',
                'status': Ticket.Status.WONT_DO,
                'assignee': None
            }
        )
        if created:
            print(f"✓ Created ticket: {ticket6.name}")
        
        print(f"✓ Test data seeding complete!")
        print(f"  - Users: {User.objects.count()} total")
        print(f"  - Tickets: {Ticket.objects.count()} total")

