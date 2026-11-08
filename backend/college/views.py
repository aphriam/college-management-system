from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.decorators import action
from rest_framework.response import Response

from accounts.permissions import IsAdmin, IsTeacher, IsStudent
from .models import Course, Mark, Attendance
from .serializers import (
    CourseSerializer, TeacherCourseSerializer, MarkSerializer,
    AttendanceSerializer, AttendanceBulkSerializer,
)


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


class TeacherAttendanceView(APIView):
    permission_classes = [IsTeacher]

    def get(self, request):
        course_id = request.query_params.get('course')
        date = request.query_params.get('date')
        if not course_id or not date:
            return Response({'detail': 'course and date are required.'}, status=400)

        try:
            course = Course.objects.get(id=course_id, teacher=request.user)
        except (Course.DoesNotExist, ValueError):
            return Response({'detail': 'Course not found.'}, status=404)

        records = Attendance.objects.filter(course=course, date=date)
        return Response(AttendanceSerializer(records, many=True).data)

    def post(self, request):
        serializer = AttendanceBulkSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        course = serializer.validated_data['course']
        date = serializer.validated_data['date']
        records = serializer.validated_data['records']

        if course.teacher != request.user:
            return Response({'detail': 'This is not your course.'}, status=403)

        enrolled_ids = set(course.students.values_list('id', flat=True))
        for item in records:
            student_id = item.get('student')
            status = item.get('status')
            if student_id not in enrolled_ids:
                return Response(
                    {'detail': f'Student {student_id} is not in this course.'},
                    status=400,
                )
            if status not in ('present', 'absent'):
                return Response({'detail': f'Invalid status: {status}'}, status=400)

        saved = 0
        for item in records:
            Attendance.objects.update_or_create(
                course=course,
                student_id=item['student'],
                date=date,
                defaults={'status': item['status']},
            )
            saved += 1

        return Response({'saved': saved})


class StudentSummaryView(APIView):
    permission_classes = [IsStudent]

    def get(self, request):
        student = request.user
        courses = Course.objects.filter(students=student).select_related('teacher')
        marks = {m.course_id: m for m in Mark.objects.filter(student=student)}

        data = []
        for c in courses:
            records = Attendance.objects.filter(student=student, course=c)
            total = records.count()
            present = records.filter(status='present').count()
            mark = marks.get(c.id)

            data.append({
                'course_id': c.id,
                'code': c.code,
                'name': c.name,
                'teacher': c.teacher.username if c.teacher else None,
                'score': mark.score if mark else None,
                'max_score': mark.max_score if mark else None,
                'total_classes': total,
                'present': present,
                'attendance_percent': round(present * 100 / total, 1) if total else None,
            })
        return Response(data)