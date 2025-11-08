from django.db import models
import uuid
from .user import User
from .ticket import Ticket


class Comment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    ticket = models.ForeignKey(
        Ticket,
        on_delete=models.CASCADE,
        related_name='comments'
    )
    commentor = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='comments'
    )
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'comment'
        ordering = ['created_at']  # Order comments by creation time (oldest first)

    def __str__(self):
        return f"Comment by {self.commentor.name} on Ticket #{self.ticket.id}"

