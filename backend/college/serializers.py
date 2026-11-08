from rest_framework import serializers
from .models import Course
from .models import Course, Mark, Attendance



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


from django.contrib.auth import get_user_model
from .models import Course, Mark

User = get_user_model()


class StudentBasicSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name']


class TeacherCourseSerializer(serializers.ModelSerializer):
    students = StudentBasicSerializer(many=True, read_only=True)

    class Meta:
        model = Course
        fields = ['id', 'name', 'code', 'students']


class MarkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mark
        fields = ['id', 'course', 'student', 'score', 'max_score']
        validators = []

    def validate(self, data):
        max_score = data.get('max_score', 100)
        if data['score'] > max_score:
            raise serializers.ValidationError('Score cannot be greater than max score.')
        return data



class AttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendance
        fields = ['id', 'course', 'student', 'date', 'status']
        validators = []


class AttendanceBulkSerializer(serializers.Serializer):
    course = serializers.PrimaryKeyRelatedField(queryset=Course.objects.all())
    date = serializers.DateField()
    records = serializers.ListField(
        child=serializers.DictField(), allow_empty=False
    )