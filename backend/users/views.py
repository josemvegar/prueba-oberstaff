# backend/users/views.py
from rest_framework import generics, viewsets, permissions
from .models import User
from .serializers import UserSerializer, UserCreateSerializer, UserUpdateSerializer, RegisterSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from .permissions import IsAdmin, IsOwnerOrAdmin

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by("id")
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = "id"

    def get_serializer_class(self):
        if self.action in ("create",):
            return UserCreateSerializer
        if self.action in ("update","partial_update"):
            return UserUpdateSerializer
        return UserSerializer

    def get_permissions(self):
        if self.action == "create":
            return [permissions.AllowAny()]  # allow registration
        if self.action in ("list","destroy"):
            # only admins can list or delete users
            return [permissions.IsAuthenticated(), IsAdmin()]
        # update self or admin
        return [permissions.IsAuthenticated(), IsOwnerOrAdmin()]

    @action(detail=False, methods=["get"], permission_classes=[permissions.IsAuthenticated])
    def me(self, request):
        serializer = UserSerializer(request.user, context={"request": request})
        return Response(serializer.data)

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]  # cualquiera puede registrarse
    serializer_class = RegisterSerializer