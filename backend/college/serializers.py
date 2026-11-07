from rest_framework import serializers
from .models import Course


class CourseSerializer(serializers.ModelSerializer):
    teacher_name = serializers.SerializerMethodField()
    student_count = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = ['id', 'name', 'code', 'teacher', 'teacher_name', 'students', 'student_count']

    def get_teacher_name(self, obj):
        return obj.teacher.username if obj.teacher else None

    def get_student_count(self, obj):
        return obj.students.count()