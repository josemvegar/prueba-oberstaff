"""
Este archivo define los permisos personalizados para la API REST.
Incluye reglas para acceso de administradores, colaboradores y miembros.
"""
from rest_framework import permissions
from projects.models import Project, Membership, Task

class IsAdmin(permissions.BasePermission):
    """
    Permite acceso solo a usuarios con rol 'admin' o 'collab'.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role in ("admin", "collab"))

class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Permite modificaciones si el usuario es admin, collab o el propio recurso.
    """
    def has_object_permission(self, request, view, obj):
        if request.user.is_authenticated and (
            request.user.role in ("admin", "collab")
        ):
            return True

        # Si el objeto es un usuario y coincide con el usuario autenticado
        if hasattr(obj, "id") and getattr(obj, "id", None) == request.user.id:
            return True

        return False


class IsProjectAdminOrMemberForUnsafe(permissions.BasePermission):
    """
    Permisos avanzados para proyectos:
    - Requiere autenticación.
    - Métodos seguros (GET/HEAD/OPTIONS): solo miembros pueden leer.
    - Métodos inseguros (POST/PUT/PATCH/DELETE): solo admin/collab pueden modificar.
    """

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False

        # Permitir a admin y collab en cualquier acción global de usuarios
        if getattr(view, "basename", "") == "user":
            return request.user.role in ("admin", "collab")

        if view.action == "create" and getattr(view, "basename", "") == "project":
            return request.user.role in ("admin", "collab")

        return True

    def has_object_permission(self, request, view, obj):
        # Admin y collab tienen poder total
        if request.user.is_admin() or request.user.role == "collab":
            return True

        if request.method in permissions.SAFE_METHODS:
            # Lectura: permitir solo a miembros
            if hasattr(obj, "members"):
                return obj.members.filter(id=request.user.id).exists()
            if hasattr(obj, "project"):
                return obj.project.members.filter(id=request.user.id).exists()
            return False

        # Escritura:
        if isinstance(obj, Project):
            try:
                membership = obj.membership_set.get(user=request.user)
                return membership.role in ("admin", "collab")
            except Membership.DoesNotExist:
                return False

        if isinstance(obj, Task):
            return obj.project.members.filter(id=request.user.id).exists()

        if hasattr(obj, "author"):
            return (
                obj.author_id == request.user.id
                or obj.task.project.members.filter(id=request.user.id).exists()
            )

        return False
