from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from .models import Project, Task

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8, style={"input_type": "password"})

    class Meta:
        model = User
        fields = ("id", "username", "email", "password")

    def validate_password(self, value):
        validate_password(value)
        return value

    def validate_email(self, value):
        value = value.strip().lower()
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("Já existe uma conta com este e-mail.")
        return value

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class ProjectSerializer(serializers.ModelSerializer):
    task_count = serializers.IntegerField(read_only=True, default=0)
    completed_count = serializers.IntegerField(read_only=True, default=0)

    class Meta:
        model = Project
        fields = ("id", "name", "description", "task_count", "completed_count", "created_at", "updated_at")
        read_only_fields = ("id", "task_count", "completed_count", "created_at", "updated_at")

    def validate_name(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError("O nome do projeto é obrigatório.")
        return value


class TaskSerializer(serializers.ModelSerializer):
    project_name = serializers.CharField(source="project.name", read_only=True)

    class Meta:
        model = Task
        fields = (
            "id", "title", "description", "status", "priority", "due_date",
            "project", "project_name", "created_at", "updated_at",
        )
        read_only_fields = ("id", "project_name", "created_at", "updated_at")

    def validate_project(self, project):
        request = self.context.get("request")
        if request and project.owner_id != request.user.id:
            raise serializers.ValidationError("Projeto inválido.")
        return project

    def validate_title(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError("O título da tarefa é obrigatório.")
        return value
