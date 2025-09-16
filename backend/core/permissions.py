# backend/core/permissions.py
from rest_framework import permissions, request
from projects.models import Project, Membership, Task, Comment

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
    - SAFE_METHODS: miembros del proyecto pueden leer
    - Unsafe methods: 
        - Admin: puede hacer TODO
        - Collaborators: pueden crear/editar pero NO asignar proyectos a otros
        - Viewers: solo lectura en sus tareas asignadas
    """
    
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False

        # Crear proyecto: admin y collaborators pueden crear
        if view.action == "create" and getattr(view, "basename", "") == "project":
            return request.user.role in ("admin", "collab")
            
        return True

    def has_object_permission(self, request, view, obj):
        # ADMINS pueden hacer TODO
        if request.user.is_admin():
            return True

        # READ operations (GET, HEAD, OPTIONS)
        if request.method in permissions.SAFE_METHODS:
            return self._can_read_object(request.user, obj)

        # WRITE operations (POST, PUT, PATCH, DELETE)
        return self._can_write_object(request.user, obj, request.method)

    def _can_read_object(self, user, obj):
        """Verifica permisos de lectura según rol y objeto"""
        # Proyecto: miembros pueden ver
        if isinstance(obj, Project):
            return obj.members.filter(id=user.id).exists()
            
        # Tarea: ver si el usuario es miembro del proyecto O tiene la tarea asignada
        if isinstance(obj, Task):
            project_member = obj.project.members.filter(id=user.id).exists()
            assigned_to_me = obj.assigned_to_id == user.id
            return project_member or assigned_to_me
            
        # Comentario: ver si el usuario puede ver la tarea padre
        if isinstance(obj, Comment):
            return self._can_read_object(user, obj.task)
            
        return False

    def _can_write_object(self, user, obj, method):
        """Verifica permisos de escritura según rol y objeto"""
        # COLLABORATORS y VIEWERS tienen restricciones
        if user.role == "viewer":
            return False  # Viewers solo lectura
            
        # COLLABORATORS
        if user.role == "collab":
            return self._collab_can_write(user, obj, method)
            
        return False

    def _collab_can_write(self, user, obj, method):
        """Permisos específicos para collaborators"""
        
        # Crear/Editar Proyecto: solo si es manager del proyecto
        if isinstance(obj, Project):
            if method in ["PUT", "PATCH", "DELETE"]:
                try:
                    membership = obj.membership_set.get(user=user)
                    return membership.role == "manager"
                except Membership.DoesNotExist:
                    return False
            return True  # POST de proyectos ya manejado en has_permission

        # Crear/Editar Tarea: miembros del proyecto pueden crear/editar tareas
        # PERO NO pueden asignar a otros usuarios (solo admins)
        if isinstance(obj, Task):
            if method == "POST":
                return obj.project.members.filter(id=user.id).exists()
                
            if method in ["PUT", "PATCH"]:
                # Collaborators pueden editar pero NO re-asignar a otros
                if "assigned_to" in request.data and request.data["assigned_to"] != user.id:
                    return False  # No puede asignar a otros
                return obj.project.members.filter(id=user.id).exists()
                
            if method == "DELETE":
                return False  # Solo admins pueden eliminar tareas

        # Comentarios: collaborators pueden comentar SOLO en tareas asignadas
        if isinstance(obj, Comment):
            if method == "POST":
                # Solo puede comentar en tareas que le estén asignadas
                return obj.task.assigned_to_id == user.id
            return False  # No puede editar/eliminar comentarios

        return False
