from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import User
from .permissions import IsAdmin
from .serializers import CustomTokenSerializer, UserSerializer


class LoginView(TokenObtainPairView):
    serializer_class = CustomTokenSerializer


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'role': user.role,
        })


class UserViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdmin]
    serializer_class = UserSerializer

    def get_queryset(self):
        queryset = User.objects.exclude(role='admin').order_by('id')
        role = self.request.query_params.get('role')
        if role:
            queryset = queryset.filter(role=role)
        return queryset