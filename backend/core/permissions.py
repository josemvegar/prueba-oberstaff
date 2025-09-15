# backend/core/permissions.py
from rest_framework import permissions
from projects.models import Project, Membership, Task

class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_admin())

class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Permite modificaciones si es admin, o si el usuario es el propio recurso (por ejemplo user).
    """
    def has_object_permission(self, request, view, obj):
        if request.user.is_authenticated and request.user.is_admin():
            return True
        # si el objeto es un User
        if hasattr(obj, "id") and getattr(obj, "id", None) == request.user.id:
            return True
        return False

class IsProjectAdminOrMemberForUnsafe(permissions.BasePermission):
    """
    - Require authentication.
    - SAFE_METHODS allowed for authenticated members (or even for all authenticated depending),
    - For unsafe methods (POST/PUT/PATCH/DELETE):
        - Create project: user.role in ('admin','collab')
        - Update/Delete project: admin OR membership.role == 'manager'
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False

        if view.action == "create" and getattr(view, "basename", "") == "project":
            return request.user.role in ("admin", "collab")
        # other actions permission will be object-level
        return True

    def has_object_permission(self, request, view, obj):
        # obj can be Project, Task or Comment
        if request.user.is_admin():
            return True

        if request.method in permissions.SAFE_METHODS:
            # allow read to members (and perhaps to other authenticated users as needed)
            if hasattr(obj, "members"):
                return obj.members.filter(id=request.user.id).exists()
            if hasattr(obj, "project"):
                return obj.project.members.filter(id=request.user.id).exists()
            return False

        # For writing:
        # If obj is a Project: only admin or project manager can update/delete
        if isinstance(obj, Project):
            try:
                membership = obj.membership_set.get(user=request.user)
                return membership.role == "manager"
            except Membership.DoesNotExist:
                return False

        # If obj is Task: allow if user is member and has role collab/manager
        if isinstance(obj, Task):
            return obj.project.members.filter(id=request.user.id).exists()

        # If obj is Comment: allow if user is author or project member
        if hasattr(obj, "author"):
            return obj.author_id == request.user.id or obj.task.project.members.filter(id=request.user.id).exists()

        return False
