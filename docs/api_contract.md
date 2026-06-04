# API Contract — Elevate Skill LMS (Project-wide)

Base path: `/api/v1/`

Authentication: JWT Bearer (`Authorization: Bearer <access_token>`). Public endpoints allow anonymous access.

Summary of available endpoints (by area):

- Accounts
  - `POST /api/v1/auth/register/` — register new user
  - `POST /api/v1/auth/login/` — obtain access + refresh tokens
  - `POST /api/v1/auth/logout/` — blacklist refresh token (logout)
  - `GET|PUT /api/v1/profile/` — retrieve or update authenticated user's profile

- Courses
  - Public
    - `GET /api/v1/courses/` — list published & active courses (filters/search)
    - `GET /api/v1/courses/{id}/` — get course detail (only if active & published)
    - `GET /api/v1/categories/` — list categories
    - `GET /api/v1/categories/{id}/` — category detail
  - Admin (requires JWT + user.role == 'admin')
    - `GET|POST /api/v1/admin/courses/` — list all courses; create course
    - `GET|PUT|PATCH|DELETE /api/v1/admin/courses/{id}/` — retrieve/update/delete course
    - `GET|POST /api/v1/admin/categories/` — list/create categories
    - `GET|PUT|PATCH|DELETE /api/v1/admin/categories/{id}/` — category detail

- API Schema & Docs (project-level)
  - `GET /api/v1/schema/` — OpenAPI schema (JSON)
  - `GET /api/v1/schema/swagger-ui/` — Swagger UI
  - `GET /api/v1/schema/redoc/` — ReDoc

---

Detailed endpoint descriptions, request/response examples and behaviour

## Accounts

### Register

- Method: POST
- URL: `/api/v1/auth/register/`
- Body (example):

```
{
  "username": "student1",
  "email": "student1@example.com",
  "password": "password123",
  "full_name": "Student One",
  "phone_number": "1234567890"
}
```

- Response 201 (example):

```
{
  "refresh": "<refresh_token>",
  "access": "<access_token>",
  "user": {
    "id": 1,
    "username": "student1",
    "email": "student1@example.com",
    "role": "student",
    "full_name": "Student One"
  }
}
```

- Notes: validation errors return 400. Default role is `student`.

### Login

- Method: POST
- URL: `/api/v1/auth/login/`
- Body: `{ "username": "...", "password": "..." }`
- Response 200: `{ "access": "...", "refresh": "...", "user": {...} }`
- Errors: 401 for invalid credentials.

### Logout

- Method: POST
- URL: `/api/v1/auth/logout/`
- Auth: Bearer access token
- Body: `{ "refresh": "<refresh_token>" }`
- Response 200: `{ "detail": "Successfully logged out and token blacklisted." }`

### Profile

- Method: GET, PUT
- URL: `/api/v1/profile/`
- Auth: Bearer access token
- GET Response 200: user details
- PUT Body (partial/full updates allowed):

```
{
  "full_name": "New Name",
  "phone_number": "0987654321",
  "password": "newpassword123"
}
```

- Notes: updating `password` will change user password; response is updated user object.

---

## Courses (see also admin endpoints)

### List Courses (Public)

- Method: GET
- URL: `/api/v1/courses/`
- Query params:
  - `search`: search title, short_description, category name
  - `category`: filter by category id
  - `category__slug`: filter by category slug
  - `ordering`: ordering e.g. `-created_at`
- Response 200: array of course summaries (CourseListSerializer)
- Visibility rule: returns only courses with `is_active=True` AND `is_published=True`.

### Course Detail (Public)

- Method: GET
- URL: `/api/v1/courses/{id}/`
- Response 200: detailed course data (CourseDetailSerializer)
- Behaviour: 404 if not active/published.

### Admin Course Create / Update / Delete

- Create: `POST /api/v1/admin/courses/` (admin only)
  - Body example:

```
{
  "title": "New Course",
  "short_description": "...",
  "description": "...",
  "category_id": 1,
  "price": "19.99",
  "duration": "8 weeks",
  "requirements": "...",
  "learning_outcomes": "...",
  "instructor": "Prof X",
  "lessons": 10,
  "is_active": true,
  "is_published": false
}
```

- Update: `PUT|PATCH /api/v1/admin/courses/{id}/` (admin only)
  - Use `PATCH` to toggle `is_published` and `is_active` or change `category_id`.
- Delete: `DELETE /api/v1/admin/courses/{id}/` (admin only) — removes course.
- Notes: `slug` is server-generated and read-only; `thumbnail` is optional (multipart upload).

### Categories

- Public: `GET /api/v1/categories/`, `GET /api/v1/categories/{id}/` — list/detail
- Admin: `GET|POST /api/v1/admin/categories/`, `GET|PUT|PATCH|DELETE /api/v1/admin/categories/{id}/`
- Category object: `{ id, name, slug, created_at }`
- Behaviour: deleting a category sets `course.category` to NULL (DB `SET NULL`).

---

## Errors and Status Codes

- 200 OK — successful GET/PUT/PATCH
- 201 Created — successful POST
- 204 No Content — successful DELETE
- 400 Bad Request — validation errors
- 401 Unauthorized — missing/invalid token for protected endpoints
- 403 Forbidden — authenticated but lacking admin role
- 404 Not Found — missing resource or course not public

---

## Notes

- All admin endpoints require the user model's `role` to equal the string `admin`.
- Slugs are auto-generated; clients must not provide `slug` fields when creating/updating.
- Use `category__slug` filter to provide human-readable category filtering.
