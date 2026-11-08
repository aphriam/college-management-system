from rest_framework import viewsets
from accounts.permissions import IsAdmin
from .models import Course
from .serializers import CourseSerializer
from rest_framework.views import APIView
from rest_framework.decorators import action
from rest_framework.response import Response
from accounts.permissions import IsAdmin, IsTeacher
from .models import Course, Mark
from .serializers import (CourseSerializer, TeacherCourseSerializer, MarkSerializer)


class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all().order_by('id')
    serializer_class = CourseSerializer
    permission_classes = [IsAdmin]



class TeacherCourseViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsTeacher]
    serializer_class = TeacherCourseSerializer

    def get_queryset(self):
        return Course.objects.filter(teacher=self.request.user)

    @action(detail=True, methods=['get'])
    def marks(self, request, pk=None):
        course = self.get_object()
        marks = Mark.objects.filter(course=course)
        return Response(MarkSerializer(marks, many=True).data)


class TeacherMarkView(APIView):
    permission_classes = [IsTeacher]

    def post(self, request):
        serializer = MarkSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        course = serializer.validated_data['course']
        student = serializer.validated_data['student']

        if course.teacher != request.user:
            return Response({'detail': 'This is not your course.'}, status=403)
        if not course.students.filter(id=student.id).exists():
            return Response({'detail': 'Student is not in this course.'}, status=400)

        mark, _ = Mark.objects.update_or_create(
            course=course,
            student=student,
            defaults={
                'score': serializer.validated_data['score'],
                'max_score': serializer.validated_data.get('max_score', 100),
            },
        )
        return Response(MarkSerializer(mark).data)