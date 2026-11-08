from django.conf import settings
from django.db import models


class Course(models.Model):
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=20, unique=True)
    teacher = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        limit_choices_to={'role': 'teacher'},
        related_name='courses_taught',
    )
    students = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        blank=True,
        limit_choices_to={'role': 'student'},
        related_name='courses_enrolled',
    )

    def __str__(self):
        return f'{self.code} - {self.name}'


class Mark(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='marks')
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        limit_choices_to={'role': 'student'},
        related_name='marks',
    )
    score = models.PositiveIntegerField()
    max_score = models.PositiveIntegerField(default=100)

    class Meta:
        unique_together = ('course', 'student')

    def __str__(self):
        return f'{self.student} - {self.course.code}: {self.score}/{self.max_score}'