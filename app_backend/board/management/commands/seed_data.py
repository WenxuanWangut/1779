from django.core.management.base import BaseCommand
from board.models import User, Ticket


class Command(BaseCommand):
    help = 'Seeds the database with test users and tickets'

    def handle(self, *args, **options):
        self.stdout.write('Seeding database with test data...\n')
        
        # Create test users using get_or_create
        user1, created1 = User.objects.get_or_create(
            email='alice@example.com',
            defaults={
                'name': 'Alice Smith',
                'password': 'password123'
            }
        )
        if created1:
            self.stdout.write(self.style.SUCCESS(f'✓ Created user: {user1.email}'))
        else:
            self.stdout.write(f'  User already exists: {user1.email}')
        
        user2, created2 = User.objects.get_or_create(
            email='bob@example.com',
            defaults={
                'name': 'Bob Johnson',
                'password': 'password456'
            }
        )
        if created2:
            self.stdout.write(self.style.SUCCESS(f'✓ Created user: {user2.email}'))
        else:
            self.stdout.write(f'  User already exists: {user2.email}')
        
        # Create test tickets using get_or_create with assignees
        tickets_data = [
            ('Setup project repository', 'Initialize the Git repository and set up the project structure', Ticket.Status.DONE, user1),
            ('Design database schema', 'Create the database models for users and tickets', Ticket.Status.DONE, user2),
            ('Implement REST API endpoints', 'Create GET /tickets endpoint and user management APIs', Ticket.Status.IN_PROGRESS, user1),
            ('Add authentication', 'Implement user authentication and authorization', Ticket.Status.TODO, user2),
            ('Deploy to production', 'Set up CI/CD pipeline and deploy the application', Ticket.Status.TODO, user1),
            ('Add real-time notifications', 'Implement WebSocket support for real-time updates', Ticket.Status.WONT_DO, None),
        ]
        
        for name, description, status, assignee in tickets_data:
            ticket, created = Ticket.objects.get_or_create(
                name=name,
                defaults={
                    'description': description,
                    'status': status,
                    'assignee': assignee
                }
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'✓ Created ticket: {ticket.name}'))
            else:
                self.stdout.write(f'  Ticket already exists: {ticket.name}')
                # Update assignee if not set
                if not ticket.assignee and assignee:
                    ticket.assignee = assignee
                    ticket.save()
                    self.stdout.write(f'  Updated assignee for: {ticket.name}')
        
        self.stdout.write('\n' + self.style.SUCCESS('✓ Test data seeding complete!'))
        self.stdout.write(f'  - Users: {User.objects.count()} total')
        self.stdout.write(f'  - Tickets: {Ticket.objects.count()} total')

