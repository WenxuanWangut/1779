from django.db import models
import uuid


class User(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.CharField(max_length=255, unique=True)
    password = models.CharField(max_length=255)
    name = models.CharField(max_length=255)

    class Meta:
        db_table = 'user'

    def __str__(self):
        return self.email

