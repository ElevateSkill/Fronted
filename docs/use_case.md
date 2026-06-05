# Use Cases — Elevate Skill LMS (Project-wide)

This document collects the primary flows for interacting with the API across accounts and courses. It documents authentication rules, required scopes/roles, and step-by-step flows.

1) User Registration → Login → Profile

- Actors: anonymous user → authenticated user
- Purpose: allow new students to register, then authenticate and manage profile.

Flow:
1. Register: `POST /api/v1/auth/register/` with username, email, password, full_name
   - Outcome: 201 Created, returns `access` and `refresh` tokens and user object
2. Login (alternate): `POST /api/v1/auth/login/` with username+password
   - Outcome: 200 OK with `access` and `refresh`
3. Use `access` token in header `Authorization: Bearer <access>` for authenticated endpoints
4. Profile: `GET /api/v1/profile/` to retrieve; `PUT /api/v1/profile/` to update (can include `password` change)

Auth rules:
- Register and Login: public
- Profile: JWT required

2) Admin Course Management (create → publish → manage)

- Actors: Admin user (must have `role == 'admin'`)
- Purpose: allow admins to create courses, manage visibility, and remove courses.

Flow:
1. Admin obtains JWT via `POST /api/v1/auth/login/` (login as admin)
2. Create Category (optional): `POST /api/v1/admin/categories/` — return category id
3. Create Course: `POST /api/v1/admin/courses/` with course fields and `category_id`
   - Note: `slug` is auto-generated
4. Publish Course: `PATCH /api/v1/admin/courses/{id}/` with `{ "is_published": true }`
5. If you want to hide the course without deleting: `PATCH` with `{ "is_active": false }`
6. To change category: `PATCH` with `{ "category_id": <new_id> }`
7. Delete: `DELETE /api/v1/admin/courses/{id}/` removes course

Auth rules:
- All `/api/v1/admin/...` endpoints require JWT + `role == 'admin'`.
- Unauthorized or non-admin attempts will produce 401 or 403.

3) Public Consumption (discover & enroll flow)

- Actors: Public users / Students
- Purpose: discover courses, view details, and enroll.

Discovery Flow:
1. List: `GET /api/v1/courses/` to browse published & active courses
   - Filter by category: `?category=1` or `?category__slug=programming`
   - Search: `?search=django`
2. Detail: `GET /api/v1/courses/{id}/` — shows full course content

Enrollment Flow:
1. Authenticate: Student obtains JWT via `POST /api/v1/auth/login/` or registration.
2. Enroll: Student calls `POST /api/v1/enrollments/` with `{ "course": <course_id> }` to create an enrollment.
   - Outcome: 201 Created with initial `pending` status.
   - Guards: Checks for course active/published status and prevents duplicate enrollments.
3. List: Student views all their current enrollments via `GET /api/v1/my-enrollments/`.

Notes & Requirements
- Media uploads (thumbnails): use `multipart/form-data` and include `thumbnail` file in the POST/PATCH request body when creating/updating a course.
- Backwards compatibility: `slug` generation ensures stable URLs when provided; collisions are prevented by unique constraint.
- Error handling: clients should handle 400/401/403/404 accordingly and surface messages to the user.

