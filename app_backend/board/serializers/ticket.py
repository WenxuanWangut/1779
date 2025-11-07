from rest_framework import serializers
from ..models import Ticket
from .user import UserSerializer
from .project import ProjectSerializer


class TicketSerializer(serializers.ModelSerializer):
    assignee = UserSerializer(read_only=True)
    project = ProjectSerializer(read_only=True)
    
    class Meta:
        model = Ticket
        fields = ['id', 'name', 'description', 'status', 'project', 'assignee']

