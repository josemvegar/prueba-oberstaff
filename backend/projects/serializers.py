# backend/projects/serializers.py
from rest_framework import serializers
from .models import Project, Task, Comment, Membership
from users.serializers import UserSimpleSerializer
from users.models import User

class CommentSerializer(serializers.ModelSerializer):
    author = UserSimpleSerializer(read_only=True)
    class Meta:
        model = Comment
        fields = ("id","task","author","message","created_at")
        read_only_fields = ("author","created_at")

class TaskSerializer(serializers.ModelSerializer):
    assigned_to = UserSimpleSerializer(read_only=True)
    assigned_to_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), write_only=True, source="assigned_to", required=False, allow_null=True
    )
    comments = CommentSerializer(many=True, read_only=True)

    class Meta:
        model = Task
        fields = ("id","project","name","description","status","assigned_to","assigned_to_id","due_date","created_at","comments")

    def validate(self, data):
        # Si se asigna un usuario, validar que sea miembro del proyecto
        assigned = data.get("assigned_to") or getattr(self.instance, "assigned_to", None)
        project = data.get("project") or getattr(self.instance, "project", None)
        if assigned and project:
            if not project.members.filter(id=assigned.id).exists():
                raise serializers.ValidationError("El usuario asignado no es miembro del proyecto.")
        return data

class ProjectSerializer(serializers.ModelSerializer):
    tasks = TaskSerializer(many=True, read_only=True)
    members = UserSimpleSerializer(many=True, read_only=True)
    members_ids = serializers.PrimaryKeyRelatedField(
        many=True, write_only=True, queryset=User.objects.all(), required=False
    )

    class Meta:
        model = Project
        fields = ("id","name","description","start_date","end_date","status","members","members_ids","tasks")

    def create(self, validated_data):
        members_ids = validated_data.pop("members_ids", [])
        project = Project.objects.create(**validated_data)
        # Crear membership para cada id
        for u in members_ids:
            Membership.objects.create(user=u, project=project, role="collab")
        return project

    def update(self, instance, validated_data):
        members_ids = validated_data.pop("members_ids", None)
        for k,v in validated_data.items():
            setattr(instance, k, v)
        instance.save()
        if members_ids is not None:
            # sincronizar miembros (esta lógica depende de reglas de negocio)
            instance.members.set(members_ids)
        return instance

class MembershipSerializer(serializers.ModelSerializer):
    user = UserSimpleSerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        source="user",
        write_only=True
    )

    class Meta:
        model = Membership
        fields = ("id", "user", "user_id", "project", "role")