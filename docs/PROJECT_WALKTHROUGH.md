# TaskFlow — technical walkthrough

Use this note to prepare to explain the project in an interview. Be ready to describe the implementation in your own words and to make a small change live.

## Architecture

- **React + TypeScript** renders the interface and calls the backend through a small API client (`frontend/src/lib/api.ts`).
- **Nginx** serves the production frontend build and forwards `/api/` and `/admin/` requests to Django. This keeps browser requests same-origin in the Compose setup.
- **Django REST Framework** exposes CRUD endpoints, serializers for validation, JWT authentication and querysets scoped to the logged-in user.
- **MySQL** persists users, projects and tasks. Foreign keys express ownership and project-task relationships; Django migrations version the schema.
- **Docker Compose** starts the database, backend and frontend in one reproducible local environment.

## Important implementation choices

1. **Ownership is enforced on the server.** Project querysets only return projects owned by the current user. Task querysets are similarly scoped, and task serializers reject projects belonging to another user. Hiding a button in the UI would not be a security control.
2. **Validation belongs in the API.** Serializers validate required names, titles, passwords and project ownership so invalid requests are rejected even if they do not come from the React interface.
3. **API concerns are separated.** Models describe persistence, serializers define API input/output, viewsets handle request behavior, and URL routing maps endpoints.
4. **The UI uses reusable pieces.** `TaskList`, `StatCard` and the API client avoid duplicating presentation and network logic.
5. **Environment configuration stays outside source code.** Credentials and the Django secret key are provided through environment variables; `.env` is ignored by Git.

## Before publishing

- Run the app and verify registration, login, project/task CRUD, filters, refresh behavior and logout.
- Run `docker compose exec backend python manage.py test`.
- Add frontend linting, type-checking and end-to-end tests if time allows.
- Replace all local credentials and the Django secret key before any public deployment.
- Configure HTTPS, rate limiting, secure token storage, backups and production logging before handling real user data.

## How to explain it in an interview

A concise summary could be:

> I built TaskFlow to practice a complete web application. React and TypeScript handle the interface, Django REST Framework provides the API, and MySQL stores the data. I focused on the full CRUD flow, JWT authentication, data validation, and ensuring users can only access their own projects and tasks. Docker Compose makes the environment reproducible, and the API is documented with Swagger.

Only use this summary after you have run the project, verified the features and understand the relevant code. If asked about a design decision, explain the trade-off rather than memorizing the wording.
