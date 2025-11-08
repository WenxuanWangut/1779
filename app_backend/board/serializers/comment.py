from rest_framework import serializers
from ..models import Comment
from .user import UserSerializer


class CommentSerializer(serializers.ModelSerializer):
    commentor = UserSerializer(read_only=True)
    
    class Meta:
        model = Comment
        fields = ['id', 'ticket', 'commentor', 'content', 'created_at']
        read_only_fields = ['id', 'created_at', 'commentor']

