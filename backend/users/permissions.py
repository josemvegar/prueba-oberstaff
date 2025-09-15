from rest_framework import permissions

class IsAdmin(permissions.BasePermission):
    """
    Permiso personalizado: Solo usuarios con rol 'admin' pueden acceder
    """
    def has_permission(self, request, view):
        # Verifica si el usuario está autenticado Y es admin
        return bool(request.user and request.user.is_authenticated and request.user.is_admin())

class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Permiso personalizado: Solo el dueño del recurso o un admin pueden acceder
    """
    def has_object_permission(self, request, view, obj):
        # Admin puede hacer cualquier cosa
        if request.user.is_admin():
            return True
        
        # Usuario normal solo puede acceder a su propio recurso
        return obj == request.user