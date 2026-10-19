from django.contrib import admin
from .models import Project, Task

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ("name", "owner", "created_at")
    search_fields = ("name", "owner__username")

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ("title", "project", "owner", "status", "priority", "due_date")
    list_filter = ("status", "priority")
    search_fields = ("title", "project__name", "owner__username")
