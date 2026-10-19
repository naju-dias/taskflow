from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from rest_framework import status
from .models import Project, Task

User = get_user_model()


class TaskFlowAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="ana", email="ana@example.com", password="Strong-pass-123")
        self.other_user = User.objects.create_user(username="other", email="other@example.com", password="Strong-pass-123")
        self.project = Project.objects.create(name="Portfolio", owner=self.user)
        self.other_project = Project.objects.create(name="Private project", owner=self.other_user)
        self.client.force_authenticate(user=self.user)

    def test_user_only_sees_own_projects(self):
        response = self.client.get("/api/projects/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.data["results"] if "results" in response.data else response.data
        self.assertEqual([item["name"] for item in results], ["Portfolio"])

    def test_user_cannot_read_another_users_project(self):
        response = self.client.get(f"/api/projects/{self.other_project.id}/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_create_task_for_owned_project(self):
        response = self.client.post("/api/tasks/", {
            "title": "Build the API", "project": self.project.id,
            "status": "todo", "priority": "high",
        }, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Task.objects.filter(owner=self.user).count(), 1)

    def test_cannot_create_task_for_another_users_project(self):
        response = self.client.post("/api/tasks/", {
            "title": "Should fail", "project": self.other_project.id,
        }, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Task.objects.count(), 0)

    def test_register_user(self):
        response = self.client.post("/api/auth/register/", {
            "username": "newuser", "email": "new@example.com", "password": "Unique-pass-456"
        }, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username="newuser").exists())
