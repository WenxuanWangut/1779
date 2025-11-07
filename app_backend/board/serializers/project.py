from rest_framework import serializers
from ..models import Project
from .user import UserSerializer


class ProjectSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    
    class Meta:
        model = Project
        fields = ['id', 'name', 'created_by']

