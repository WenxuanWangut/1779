from django.core.management.base import BaseCommand
from board.models import User, Project, Ticket, Comment


class Command(BaseCommand):
    help = 'Seeds the database with test users, projects, tickets, and comments'

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
        
        user3, created3 = User.objects.get_or_create(
            email='zyjnflsic@gmail.com',
            defaults={
                'name': 'Crown',
                'password': 'password789'
            }
        )
        if created3:
            self.stdout.write(self.style.SUCCESS(f'✓ Created user: {user3.email}'))
        else:
            self.stdout.write(f'  User already exists: {user3.email}')
        
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
            ('Write technical documentation', 'Document the API endpoints and deployment process', Ticket.Status.IN_PROGRESS, project1, user3),
        ]
        
        tickets = []
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
            tickets.append(ticket)
            if created:
                self.stdout.write(self.style.SUCCESS(f'✓ Created ticket: {ticket.name}'))
            else:
                self.stdout.write(f'  Ticket already exists: {ticket.name}')
        
        # Create test comments
        ticket1, ticket2, ticket3, ticket4, ticket5, ticket6, ticket7 = tickets
        
        comments_data = [
            (ticket1, user1, 'Repository initialized with basic structure'),
            (ticket1, user2, 'Added .gitignore and README files'),
            (ticket3, user2, 'Started working on the authentication endpoints'),
            (ticket3, user1, 'Login and logout endpoints are working. Need to add token refresh.'),
            (ticket3, user2, 'Looks good! Can you also add rate limiting?'),
            (ticket4, user2, 'Should we use JWT or session-based auth?'),
            (ticket4, user1, 'I think token-based would be better for our use case'),
            (ticket7, user3, 'Starting with API documentation. Will use OpenAPI/Swagger format.'),
            (ticket7, user1, 'Great! Please also include deployment instructions.'),
        ]
        
        for ticket, commentor, content in comments_data:
            comment, created = Comment.objects.get_or_create(
                ticket=ticket,
                commentor=commentor,
                content=content,
                defaults={}
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'✓ Created comment on: {ticket.name}'))
            else:
                self.stdout.write(f'  Comment already exists on: {ticket.name}')
        
        self.stdout.write('\n' + self.style.SUCCESS('✓ Test data seeding complete!'))
        self.stdout.write(f'  - Users: {User.objects.count()} total')
        self.stdout.write(f'  - Projects: {Project.objects.count()} total')
        self.stdout.write(f'  - Tickets: {Ticket.objects.count()} total')
        self.stdout.write(f'  - Comments: {Comment.objects.count()} total')

