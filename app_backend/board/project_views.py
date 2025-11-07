from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Project, User
from .serializers import ProjectSerializer
from .auth import authenticate_request


@api_view(['GET'])
@authenticate_request
def get_projects(request):
    """
    Get all projects (authenticated).
    Returns a list of all projects with their details.
    """
    projects = Project.objects.all()
    serializer = ProjectSerializer(projects, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
@authenticate_request
def create_project(request):
    """
    Create a new project (authenticated).
    The authenticated user will be set as the creator.
    Required fields: name
    """
    name = request.data.get('name')
    if not name:
        return Response(
            {'error': 'name is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Create project with the authenticated user as creator
    project = Project.objects.create(
        name=name,
        created_by=request.user
    )
    
    serializer = ProjectSerializer(project)
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['PATCH'])
@authenticate_request
def update_project(request, project_id):
    """
    Update an existing project (authenticated).
    Only the creator can update the project.
    Optional fields: name
    """
    try:
        project = Project.objects.get(id=project_id)
    except Project.DoesNotExist:
        return Response(
            {'error': 'Project not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Check if the user is the creator
    if project.created_by.id != request.user.id:
        return Response(
            {'error': 'Only the project creator can update this project'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    # Update fields if provided
    name = request.data.get('name')
    if name:
        project.name = name
        project.save()
    
    serializer = ProjectSerializer(project)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['DELETE'])
@authenticate_request
def delete_project(request, project_id):
    """
    Delete a project (authenticated).
    Only the creator can delete the project.
    Note: This will also delete all tickets associated with this project (CASCADE).
    """
    try:
        project = Project.objects.get(id=project_id)
    except Project.DoesNotExist:
        return Response(
            {'error': 'Project not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Check if the user is the creator
    if project.created_by.id != request.user.id:
        return Response(
            {'error': 'Only the project creator can delete this project'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    project_name = project.name
    project.delete()
    
    return Response(
        {'message': f'Project "{project_name}" deleted successfully'},
        status=status.HTTP_200_OK
    )


@api_view(['GET'])
@authenticate_request
def get_project(request, project_id):
    """
    Get a single project by ID (authenticated).
    """
    try:
        project = Project.objects.get(id=project_id)
    except Project.DoesNotExist:
        return Response(
            {'error': 'Project not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    serializer = ProjectSerializer(project)
    return Response(serializer.data, status=status.HTTP_200_OK)

