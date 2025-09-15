from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = (
        ("admin", "Administrador"),
        ("collab", "Colaborador"),
        ("viewer", "Visor"),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default="viewer")

    def is_admin(self):
        return self.role == "admin"
