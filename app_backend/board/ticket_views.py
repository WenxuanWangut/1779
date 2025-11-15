from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Ticket, User, Project
from .serializers import TicketSerializer, UserSerializer
from .auth import authenticate_request, create_token, delete_token, get_user_from_token

# Signup token - in production, this should be in environment variables
SIGNUP_TOKEN = "secret-signup-token-2025"


@api_view(['POST'])
def signup(request):
    """
    Register a new user with email, password, name, and signup token.
    """
    email = request.data.get('email')
    password = request.data.get('password')
    name = request.data.get('name')
    signup_token = request.data.get('signup_token')
    
    # Validate required fields
    if not all([email, password, name, signup_token]):
        return Response(
            {'error': 'Email, password, name, and signup_token are required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Check if user already exists
    if User.objects.filter(email=email).exists():
        return Response(
            {'error': 'User with this email already exists'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Verify signup token
    if signup_token != SIGNUP_TOKEN:
        return Response(
            {'error': 'Invalid signup token'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    # Create the user
    user = User.objects.create(
        email=email,
        password=password,  # In production, use proper password hashing
        name=name
    )
    
    # Generate token and return user data
    token = create_token(user)
    return Response({
        'token': token,
        'user': UserSerializer(user).data
    }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
def login(request):
    """
    Login with email and password, returns authentication token.
    """
    email = request.data.get('email')
    password = request.data.get('password')
    
    if not email or not password:
        return Response(
            {'error': 'Email and password are required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        user = User.objects.get(email=email)
        if user.password == password:  # In production, use proper password hashing
            token = create_token(user)
            return Response({
                'token': token,
                'user': UserSerializer(user).data
            }, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        pass
    
    return Response(
        {'error': 'Invalid credentials'},
        status=status.HTTP_401_UNAUTHORIZED
    )


@api_view(['POST'])
@authenticate_request
def logout(request):
    """
    Logout (invalidate token).
    """
    auth_header = request.headers.get('Authorization', '')
    token = auth_header.replace('Token ', '', 1).strip()
    delete_token(token)
    
    return Response(
        {'message': 'Successfully logged out'},
        status=status.HTTP_200_OK
    )


@api_view(['GET'])
@authenticate_request
def get_tickets(request):
    """
    Get all tickets grouped by status (authenticated).
    Returns: {
        "TODO": [...],
        "IN_PROGRESS": [...],
        "DONE": [...],
        "WONT_DO": [...]
    }
    """
    tickets = Ticket.objects.all()
    
    # Group tickets by status
    grouped_tickets = {
        'TODO': [],
        'IN_PROGRESS': [],
        'DONE': [],
        'WONT_DO': []
    }
    
    for ticket in tickets:
        serialized_ticket = TicketSerializer(ticket).data
        grouped_tickets[ticket.status].append(serialized_ticket)
    
    return Response(grouped_tickets, status=status.HTTP_200_OK)


@api_view(['POST'])
@authenticate_request
def create_ticket(request):
    """
    Create a new ticket (authenticated).
    Requires project_id in request body.
    """
    # Project is required
    project_id = request.data.get('project_id')
    if not project_id:
        return Response(
            {'error': 'project_id is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        project = Project.objects.get(id=project_id)
    except Project.DoesNotExist:
        return Response(
            {'error': 'Project not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    serializer = TicketSerializer(data=request.data)
    if serializer.is_valid():
        # Handle assignee_id if provided
        assignee = None
        assignee_id = request.data.get('assignee_id')
        if assignee_id:
            try:
                assignee = User.objects.get(id=assignee_id)
            except User.DoesNotExist:
                return Response(
                    {'error': 'Assignee not found'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        # Save with project and assignee
        ticket = serializer.save(project=project, assignee=assignee)
        
        return Response(TicketSerializer(ticket).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PATCH', 'PUT'])
@authenticate_request
def update_ticket(request, ticket_id):
    """
    Update an existing ticket (authenticated).
    Optional fields: name, description, status, assignee_id, project_id
    """
    try:
        ticket = Ticket.objects.get(id=ticket_id)
    except Ticket.DoesNotExist:
        return Response(
            {'error': 'Ticket not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Prepare update kwargs
    update_kwargs = {}
    
    # Handle assignee_id if provided
    assignee_id = request.data.get('assignee_id')
    if assignee_id:
        try:
            assignee = User.objects.get(id=assignee_id)
            update_kwargs['assignee'] = assignee
        except User.DoesNotExist:
            return Response(
                {'error': 'Assignee not found'},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    # Handle project_id if provided
    project_id = request.data.get('project_id')
    if project_id:
        try:
            project = Project.objects.get(id=project_id)
            update_kwargs['project'] = project
        except Project.DoesNotExist:
            return Response(
                {'error': 'Project not found'},
                status=status.HTTP_404_NOT_FOUND
            )
    
    serializer = TicketSerializer(ticket, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save(**update_kwargs)
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@authenticate_request
def delete_ticket(request, ticket_id):
    """
    Delete a ticket (authenticated).
    """
    try:
        ticket = Ticket.objects.get(id=ticket_id)
    except Ticket.DoesNotExist:
        return Response(
            {'error': 'Ticket not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    ticket.delete()
    
    return Response(
        {'message': 'Ticket deleted successfully'},
        status=status.HTTP_200_OK
    )

