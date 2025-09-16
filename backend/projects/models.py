from django.db import models
from django.conf import settings

class Project(models.Model):
    STATUS_CHOICES = (
        ("pending", "Pendiente"),
        ("in_progress", "En progreso"),
        ("completed", "Completado"),
        ("cancelled", "Cancelado"),
    )
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    members = models.ManyToManyField(settings.AUTH_USER_MODEL, through="Membership", related_name="projects")

    def __str__(self):
        return self.name

class Membership(models.Model):
    ROLE_IN_PROJECT = (("admin", "Administrador"), ("collab", "Collaborator"), ("viewer", "Viewer"))
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    role = models.CharField(max_length=10, choices=ROLE_IN_PROJECT, default="collab")
    class Meta:
        unique_together = ("user", "project")

class Task(models.Model):
    STATUS = (("pending","Pendiente"),("in_progress","En progreso"),("completed","Completada"))
    project = models.ForeignKey(Project, related_name="tasks", on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS, default="pending")
    assigned_to = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL)
    due_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    

class Comment(models.Model):
    task = models.ForeignKey(Task, related_name="comments", on_delete=models.CASCADE)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
