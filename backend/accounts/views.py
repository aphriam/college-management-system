from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import CustomTokenSerializer, UserSerializer
from .permissions import IsAdmin, IsTeacher, IsStudent
from rest_framework import viewsets
from .models import User


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


class AdminOnlyView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        return Response({'message': 'Hello Admin'})


class TeacherOnlyView(APIView):
    permission_classes = [IsTeacher]

    def get(self, request):
        return Response({'message': 'Hello Teacher'})


class StudentOnlyView(APIView):
    permission_classes = [IsStudent]

    def get(self, request):
        return Response({'message': 'Hello Student'})


class UserViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdmin]
    serializer_class = UserSerializer

    def get_queryset(self):
        queryset = User.objects.exclude(role='admin').order_by('id')
        role = self.request.query_params.get('role')
        if role:
            queryset = queryset.filter(role=role)
        return queryset