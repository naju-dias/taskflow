from django.contrib.auth import get_user_model
from django.db.models import Count, Q
from rest_framework import generics, permissions, viewsets
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Project, Task
from .serializers import ProjectSerializer, RegisterSerializer, TaskSerializer

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer

    def get_queryset(self):
        return Project.objects.filter(
            owner=self.request.user
        ).annotate(
            task_count=Count("tasks", distinct=True),
            completed_count=Count(
                "tasks",
                filter=Q(tasks__status=Task.Status.DONE),
                distinct=True,
            ),
        ).order_by("-created_at", "-id")

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    @action(detail=True, methods=["get"])
    def summary(self, request, pk=None):
        project = self.get_object()
        tasks = project.tasks
        return Response({
            "total": tasks.count(),
            "todo": tasks.filter(status=Task.Status.TODO).count(),
            "in_progress": tasks.filter(status=Task.Status.IN_PROGRESS).count(),
            "done": tasks.filter(status=Task.Status.DONE).count(),
        })


class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    filterset_fields = ["status", "priority", "project"]
    search_fields = ["title", "description", "project__name"]
    ordering_fields = ["created_at", "updated_at", "due_date", "title", "priority"]

    def get_queryset(self):
        queryset = (
            Task.objects
            .filter(owner=self.request.user)
            .select_related("project")
            .order_by("-created_at", "-id")
        )

        project_id = self.request.query_params.get("project")
        if project_id:
            try:
                int(project_id)
            except (TypeError, ValueError):
                raise ValidationError({
                    "project": "Informe um ID de projeto válido."
                })
            queryset = queryset.filter(project_id=project_id)

        return queryset

    def perform_create(self, serializer):
        project = serializer.validated_data["project"]
        if project.owner_id != self.request.user.id:
            raise ValidationError({"project": "Projeto inválido."})
        serializer.save(owner=self.request.user)

    def perform_update(self, serializer):
        project = serializer.validated_data.get("project", serializer.instance.project)
        if project.owner_id != self.request.user.id:
            raise ValidationError({"project": "Projeto inválido."})
        serializer.save()
