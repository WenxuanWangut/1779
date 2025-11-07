from django.db import models
import uuid
from .user import User


class Project(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='created_projects'
    )
    name = models.CharField(max_length=255)

    class Meta:
        db_table = 'project'

    def __str__(self):
        return self.name

