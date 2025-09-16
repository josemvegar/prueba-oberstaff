# backend/projects/views.py
from rest_framework import viewsets, filters
from .models import Project, Task, Comment, Membership
from .serializers import ProjectSerializer, TaskSerializer, CommentSerializer, MembershipSerializer
from core.permissions import IsProjectAdminOrMemberForUnsafe
from rest_framework.permissions import IsAuthenticated
from django.db import transaction

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all().prefetch_related("members", "tasks")
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated, IsProjectAdminOrMemberForUnsafe]

    def perform_create(self, serializer):
        with transaction.atomic():
            project = serializer.save()
            # hacer al creador manager
            Membership.objects.create(user=self.request.user, project=project, role="admin")

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.select_related("assigned_to","project").all()
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated, IsProjectAdminOrMemberForUnsafe]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["name","description"]
    ordering_fields = ["due_date","created_at","status"]

    def get_queryset(self):
        qs = super().get_queryset()
        project_id = self.request.query_params.get("project")
        if project_id:
            qs = qs.filter(project_id=project_id)
        return qs

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.select_related("author","task__project").all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated, IsProjectAdminOrMemberForUnsafe]

    def get_queryset(self):
        queryset = Comment.objects.all()

        # 🔎 filtrar por task si se pasa en query param
        task_id = self.request.query_params.get("task")
        if task_id:
            queryset = queryset.filter(task_id=task_id)

        return queryset

    def perform_create(self, serializer):
        # Validar que user está asignado a la tarea o es miembro del proyecto o es admin
        task = serializer.validated_data["task"]
        user = self.request.user
        
        print(f"User ID: {user.id}, Role: {user.role}")
        
        # Si NO es admin Y NO está asignado Y NO es miembro del proyecto → ERROR
        if user.role != 'admin' and not (task.assigned_to_id == user.id or task.project.members.filter(id=user.id).exists()):
            raise PermissionDenied("No puedes comentar en esta tarea: no estás asignado ni eres miembro del proyecto.")
        
        serializer.save(author=user)

class MembershipViewSet(viewsets.ModelViewSet):
    queryset = Membership.objects.select_related("user","project").all()
    serializer_class = MembershipSerializer
    permission_classes = [IsAuthenticated, IsProjectAdminOrMemberForUnsafe]