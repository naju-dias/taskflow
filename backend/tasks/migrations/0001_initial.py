# Initial database schema for TaskFlow.
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True
    dependencies = [migrations.swappable_dependency(settings.AUTH_USER_MODEL)]
    operations = [
        migrations.CreateModel(
            name="Project",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(max_length=120)),
                ("description", models.TextField(blank=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("owner", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="projects", to=settings.AUTH_USER_MODEL)),
            ],
            options={"ordering": ["-updated_at", "name"]},
        ),
        migrations.CreateModel(
            name="Task",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("title", models.CharField(max_length=160)),
                ("description", models.TextField(blank=True)),
                ("status", models.CharField(choices=[("todo", "A fazer"), ("in_progress", "Em andamento"), ("done", "Concluída")], default="todo", max_length=20)),
                ("priority", models.CharField(choices=[("low", "Baixa"), ("medium", "Média"), ("high", "Alta")], default="medium", max_length=10)),
                ("due_date", models.DateField(blank=True, null=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("owner", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="tasks", to=settings.AUTH_USER_MODEL)),
                ("project", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="tasks", to="tasks.project")),
            ],
            options={"ordering": ["status", "due_date", "-updated_at"]},
        ),
        migrations.AddIndex(
            model_name="task",
            index=models.Index(fields=["owner", "status"], name="tasks_task_owner_i_4b54a9_idx"),
        ),
    ]
