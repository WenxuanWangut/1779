from django.db import models
from .user import User
from .project import Project


class Ticket(models.Model):
    class Status(models.TextChoices):
        TODO = 'TODO', 'To Do'
        IN_PROGRESS = 'IN_PROGRESS', 'In Progress'
        DONE = 'DONE', 'Done'
        WONT_DO = 'WONT_DO', "Won't Do"
    
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    description = models.TextField()
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.TODO
    )
    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name='tickets'
    )
    assignee = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='assigned_tickets'
    )

    class Meta:
        db_table = 'ticket'

    def __str__(self):
        return self.name

