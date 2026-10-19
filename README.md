# TaskFlow

A full-stack task and project manager built to demonstrate practical web development with **Python, Django REST Framework, React, TypeScript, MySQL and Docker Compose**.

## Features

- Account registration and JWT login.
- Private projects and tasks: users can only access their own data.
- Create, edit and delete projects and tasks.
- Task status, priority, due dates and search.
- Dashboard with task statistics and progress.
- Django REST Framework API with OpenAPI/Swagger documentation.
- MySQL persistence, migrations and backend API tests.
- Responsive interface and Docker-based setup.

## Run with Docker

Requirements: Docker Desktop (or Docker Engine) with Compose.

1. Clone this repository and open its folder.
2. Copy `.env.example` to `.env`.
3. Change `DJANGO_SECRET_KEY`, `MYSQL_PASSWORD` and `MYSQL_ROOT_PASSWORD` before exposing the app to the internet. The defaults are only for local development.
4. Start the stack:

   ```bash
   docker compose up --build
   ```

5. Open **http://localhost:8080**.
6. API schema: **http://localhost:8080/api/schema/**. Swagger UI: **http://localhost:8080/api/docs/**.

Django migrations run automatically when the backend container starts. To create an admin user:

```bash
docker compose exec backend python manage.py createsuperuser
```

Django admin: `http://localhost:8080/admin/`.

## Useful commands

```bash
# Run backend tests
docker compose exec backend python manage.py test

# Apply migrations after changing models
docker compose exec backend python manage.py makemigrations
docker compose exec backend python manage.py migrate

# Follow logs
docker compose logs -f backend frontend db

# Stop services (keeps database data)
docker compose down

# Stop services and delete the local database volume (destructive)
docker compose down -v
```

## API overview

- `POST /api/auth/register/` — create an account
- `POST /api/auth/token/` — obtain access and refresh tokens
- `POST /api/auth/token/refresh/` — refresh access token
- `GET/POST /api/projects/` — list/create projects
- `GET/PATCH/DELETE /api/projects/{id}/` — retrieve/update/delete a project
- `GET/POST /api/tasks/` — list/create tasks (`?project={id}&status=todo&search=...` supported)
- `GET/PATCH/DELETE /api/tasks/{id}/` — retrieve/update/delete a task

Authenticated requests use `Authorization: Bearer <access-token>`.

## Security notes

- All project and task querysets are scoped to the authenticated user.
- Passwords are handled by Django's password hashing system.
- JWT access tokens expire; refresh tokens are rotated and blacklisted after use.
- Secrets are read from environment variables and should never be committed.
- For a production deployment, configure HTTPS, secure cookies/headers, rate limiting, backups, monitoring and a managed secret store. Review the frontend token-storage approach before production use.

## Project structure

```text
backend/
  config/       Django settings, URLs and WSGI
  tasks/        models, serializers, views, routes and tests
frontend/
  src/          React app, UI components, API client and styles
  nginx.conf    SPA routing and API reverse proxy
Dockerfile      (one per app)
docker-compose.yml
```

## Next improvements

- Add team collaboration and project membership.
- Add pagination and richer filtering.
- Add CI with linting, type checks and tests.
- Add end-to-end tests and accessibility checks.
