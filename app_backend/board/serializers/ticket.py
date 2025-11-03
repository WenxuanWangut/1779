from rest_framework import serializers
from ..models import Ticket
from .user import UserSerializer


class TicketSerializer(serializers.ModelSerializer):
    assignee = UserSerializer(read_only=True)
    
    class Meta:
        model = Ticket
        fields = ['id', 'name', 'description', 'status', 'assignee']

