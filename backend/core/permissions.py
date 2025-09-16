# backend/core/permissions.py
from rest_framework import permissions
from projects.models import Project, Membership, Task

class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role in ("admin", "collab"))

class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Permite modificaciones si es admin o collab,
    o si el usuario es el propio recurso (por ejemplo User).
    """
    def has_object_permission(self, request, view, obj):
        if request.user.is_authenticated and (
            request.user.role in ("admin", "collab")
        ):
            return True

        # si el objeto es un User y coincide con el usuario autenticado
        if hasattr(obj, "id") and getattr(obj, "id", None) == request.user.id:
            return True

        return False


class IsProjectAdminOrMemberForUnsafe(permissions.BasePermission):
    """
    - Require authentication.
    - SAFE_METHODS allowed for authenticated members.
    - For unsafe methods (POST/PUT/PATCH/DELETE):
        - Create project: user.role in ('admin','collab')
        - Update/Delete project: admin OR collab
    """

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False

        # 👇 Permitir a admin y collab en cualquier acción global de users
        if getattr(view, "basename", "") == "user":
            return request.user.role in ("admin", "collab")

        if view.action == "create" and getattr(view, "basename", "") == "project":
            return request.user.role in ("admin", "collab")

        return True

    def has_object_permission(self, request, view, obj):
        # admin y collab tienen poder total
        if request.user.is_admin() or request.user.role == "collab":
            return True

        if request.method in permissions.SAFE_METHODS:
            # lectura: permitir solo a miembros
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
