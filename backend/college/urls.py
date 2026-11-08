from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import CourseViewSet, TeacherCourseViewSet, TeacherMarkView,TeacherAttendanceView,StudentSummaryView

router = DefaultRouter()
router.register('courses', CourseViewSet, basename='courses')
router.register('teacher/courses', TeacherCourseViewSet, basename='teacher-courses')

urlpatterns = router.urls + [
    path('teacher/marks/', TeacherMarkView.as_view()),
    path('teacher/attendance/', TeacherAttendanceView.as_view()),
    path('student/summary/', StudentSummaryView.as_view()),
]