from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Comment, Ticket
from .serializers import CommentSerializer
from .auth import authenticate_request
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

API_KEY = "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"

@api_view(['GET'])
@authenticate_request
def get_comments(request, ticket_id):
    """
    Get all comments for a specific ticket (authenticated).
    """
    try:
        ticket = Ticket.objects.get(id=ticket_id)
    except Ticket.DoesNotExist:
        return Response(
            {'error': 'Ticket not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    comments = Comment.objects.filter(ticket=ticket)
    serializer = CommentSerializer(comments, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
@authenticate_request
def create_comment(request, ticket_id):
    """
    Create a new comment on a ticket (authenticated).
    The authenticated user will be set as the commentor.
    Required fields: content
    """
    try:
        ticket = Ticket.objects.get(id=ticket_id)
    except Ticket.DoesNotExist:
        return Response(
            {'error': 'Ticket not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    content = request.data.get('content')
    if not content or not content.strip():
        return Response(
            {'error': 'content is required and cannot be empty'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Create comment with authenticated user as commentor
    comment = Comment.objects.create(
        ticket=ticket,
        commentor=request.user,
        content=content.strip()
    )

    # Sending email with the truncated comment
    comment_words = content.strip().split()
    truncated_comment = ' '.join(comment_words[:10])
    if len(comment_words) > 10:
        truncated_comment += '...'

    message = Mail(
        from_email='ticket-update@cloud-collab.com',
        to_emails=ticket.assignee.email,
        subject='New comment on your ticket',
        html_content=f'<strong>{request.user.name}</strong> commented on your ticket <strong>{ticket.name}</strong>:<br><br>"{truncated_comment}"',
    )
    try:
        sg = SendGridAPIClient(API_KEY)
        response = sg.send(message)
        print(response.status_code)
        print(response.body)
        print(response.headers)
    except Exception as e:
        print(e.message)

    serializer = CommentSerializer(comment)
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['PATCH', 'PUT'])
@authenticate_request
def update_comment(request, comment_id):
    """
    Update a comment (authenticated).
    Only the commentor can update their own comment.
    Optional fields: content
    """
    try:
        comment = Comment.objects.get(id=comment_id)
    except Comment.DoesNotExist:
        return Response(
            {'error': 'Comment not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Check if the user is the commentor
    if comment.commentor.id != request.user.id:
        return Response(
            {'error': 'Only the commentor can update this comment'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    content = request.data.get('content')
    if content:
        if not content.strip():
            return Response(
                {'error': 'content cannot be empty'},
                status=status.HTTP_400_BAD_REQUEST
            )
        comment.content = content.strip()
        comment.save()
    
    serializer = CommentSerializer(comment)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['DELETE'])
@authenticate_request
def delete_comment(request, comment_id):
    """
    Delete a comment (authenticated).
    Only the commentor can delete their own comment.
    """
    try:
        comment = Comment.objects.get(id=comment_id)
    except Comment.DoesNotExist:
        return Response(
            {'error': 'Comment not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Check if the user is the commentor
    if comment.commentor.id != request.user.id:
        return Response(
            {'error': 'Only the commentor can delete this comment'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    comment.delete()
    
    return Response(
        {'message': 'Comment deleted successfully'},
        status=status.HTTP_200_OK
    )

