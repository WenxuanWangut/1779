from django.core.management.base import BaseCommand
from board.models import User, Project, Ticket


class Command(BaseCommand):
    help = 'Seeds the database with test users, projects, and tickets'

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
        
        # Create test projects using get_or_create
        project1, created = Project.objects.get_or_create(
            name='ECE1779 Final Project',
            defaults={
                'created_by': user1
            }
        )
        if created:
            self.stdout.write(self.style.SUCCESS(f'✓ Created project: {project1.name}'))
        else:
            self.stdout.write(f'  Project already exists: {project1.name}')
        
        project2, created = Project.objects.get_or_create(
            name='Personal Website',
            defaults={
                'created_by': user2
            }
        )
        if created:
            self.stdout.write(self.style.SUCCESS(f'✓ Created project: {project2.name}'))
        else:
            self.stdout.write(f'  Project already exists: {project2.name}')
        
        # Create test tickets using get_or_create with project and assignees
        tickets_data = [
            ('Setup project repository', 'Initialize the Git repository and set up the project structure', Ticket.Status.DONE, project1, user1),
            ('Design database schema', 'Create the database models for users and tickets', Ticket.Status.DONE, project1, user2),
            ('Implement REST API endpoints', 'Create GET /tickets endpoint and user management APIs', Ticket.Status.IN_PROGRESS, project1, user1),
            ('Add authentication', 'Implement user authentication and authorization', Ticket.Status.TODO, project1, user2),
            ('Deploy to production', 'Set up CI/CD pipeline and deploy the application', Ticket.Status.TODO, project1, user1),
            ('Add real-time notifications', 'Implement WebSocket support for real-time updates', Ticket.Status.WONT_DO, project2, None),
        ]
        
        for name, description, status, project, assignee in tickets_data:
            ticket, created = Ticket.objects.get_or_create(
                name=name,
                defaults={
                    'description': description,
                    'status': status,
                    'project': project,
                    'assignee': assignee
                }
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'✓ Created ticket: {ticket.name}'))
            else:
                self.stdout.write(f'  Ticket already exists: {ticket.name}')
        
        self.stdout.write('\n' + self.style.SUCCESS('✓ Test data seeding complete!'))
        self.stdout.write(f'  - Users: {User.objects.count()} total')
        self.stdout.write(f'  - Projects: {Project.objects.count()} total')
        self.stdout.write(f'  - Tickets: {Ticket.objects.count()} total')

