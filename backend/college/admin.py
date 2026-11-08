from django.contrib import admin
from .models import Course, Mark,Attendance

admin.site.register(Course)
admin.site.register(Mark)
admin.site.register(Attendance)