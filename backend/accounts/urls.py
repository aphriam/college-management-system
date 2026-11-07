from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    LoginView, MeView, AdminOnlyView, TeacherOnlyView, StudentOnlyView, UserViewSet
)

router = DefaultRouter()
router.register('users', UserViewSet, basename='users')

urlpatterns = [
    path('login/', LoginView.as_view()),
    path('token/refresh/', TokenRefreshView.as_view()),
    path('me/', MeView.as_view()),
    path('admin-only/', AdminOnlyView.as_view()),
    path('teacher-only/', TeacherOnlyView.as_view()),
    path('student-only/', StudentOnlyView.as_view()),
    path('', include(router.urls)),
]