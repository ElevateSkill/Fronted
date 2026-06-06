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

- Enrollments (requires JWT)
  - `POST /api/v1/enrollments/` — enroll student in a course (default: pending status)
  - `GET /api/v1/my-enrollments/` — list student's own enrollments

- Payments (requires JWT)
  - Student
    - `POST /api/v1/payments/` — submit payment proof for a pending enrollment
    - `GET /api/v1/payments/` — list authenticated student's payments
  - Admin (requires JWT + user.role == 'admin')
    - `GET /api/v1/admin/payments/` — list all payments
    - `PUT /api/v1/admin/payments/{id}/approve/` — approve a pending payment and activate its enrollment
    - `PUT /api/v1/admin/payments/{id}/reject/` — reject a pending payment and cancel its enrollment

- CMS
  - Public
    - `GET /api/v1/homepage/` — aggregated homepage data (hero, about, settings, testimonials, FAQs)
  - Admin (requires JWT + user.role == 'admin')
    - `GET|PUT /api/v1/admin/hero/` — retrieve/update hero section details
    - `GET|PUT /api/v1/admin/about/` — retrieve/update about section details
    - `GET|PUT /api/v1/admin/site-settings/` — retrieve/update site settings details
    - `GET|POST /api/v1/admin/testimonials/` — list all / create testimonial
    - `GET|PUT|PATCH|DELETE /api/v1/admin/testimonials/{id}/` — retrieve/update/delete testimonial
    - `GET|POST /api/v1/admin/faqs/` — list all / create FAQ
    - `GET|PUT|PATCH|DELETE /api/v1/admin/faqs/{id}/` — retrieve/update/delete FAQ

- Announcements & News
  - Student / Public
    - `GET /api/v1/announcements/` — list published announcements (requires JWT)
    - `GET /api/v1/announcements/{id}/` — detail of a published announcement (requires JWT)
    - `GET /api/v1/news/` — list published news posts (public, no auth)
    - `GET /api/v1/news/{id}/` — detail of a published news post (public, no auth)
  - Admin (requires JWT + user.role == 'admin')
    - `GET|POST /api/v1/admin/announcements/` — list/create announcements
    - `GET|PUT|PATCH|DELETE /api/v1/admin/announcements/{id}/` — retrieve/update/delete announcement
    - `GET|POST /api/v1/admin/news/` — list/create news posts
    - `GET|PUT|PATCH|DELETE /api/v1/admin/news/{id}/` — retrieve/update/delete news post

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

## Enrollments

### Enroll in Course

- Method: POST
- URL: `/api/v1/enrollments/`
- Auth: Bearer access token (IsAuthenticated)
- Body (example):

```json
{
  "course": 1
}
```

- Response 201 Created (example):

```json
{
  "id": 1,
  "student": {
    "id": 2,
    "username": "student1",
    "email": "student1@test.com",
    "role": "student",
    "full_name": "Student One"
  },
  "course": {
    "id": 1,
    "title": "Published Python",
    "slug": "published-python",
    "short_description": "Short desc",
    "thumbnail": null,
    "category": {
      "id": 1,
      "name": "Programming",
      "slug": "programming",
      "created_at": "2026-06-05T08:44:44Z"
    },
    "price": "49.99",
    "instructor": "",
    "lessons": null,
    "duration": "",
    "is_active": true,
    "is_published": true
  },
  "status": "pending",
  "created_at": "2026-06-05T08:44:44Z",
  "updated_at": "2026-06-05T08:44:44Z"
}
```

- Notes:
  - Default status is `pending`.
  - Duplicate enrollment (same student + course) is blocked and returns 400 Bad Request.
  - Cannot enroll in inactive or unpublished courses (returns 400 Bad Request).
  - Attempting to enroll in a non-existent course returns 404 Not Found.

### List My Enrollments

- Method: GET
- URL: `/api/v1/my-enrollments/`
- Auth: Bearer access token (IsAuthenticated)
- Response 200 OK: array of enrollment objects (EnrollmentSerializer)
- Behaviour: returns only the authenticated student's own records.

---

## Payments

### Submit Payment Proof

- Method: POST
- URL: `/api/v1/payments/`
- Auth: Bearer access token (student role required)
- Content type: `multipart/form-data`
- Body fields:

```text
enrollment_id: 1
full_name: Student One
email: student1@example.com
phone: 1234567890
proof_file: <file>
```

- Accepted proof file types: PDF, JPG, PNG
- Maximum proof file size: 5MB
- Response 201 Created: payment object with `status=pending`
- Notes:
  - The enrollment must exist, belong to the authenticated student, and still be `pending`.
  - Payments are always created with `status=pending`.

### List My Payments

- Method: GET
- URL: `/api/v1/payments/`
- Auth: Bearer access token (student role required)
- Response 200 OK: array of payment objects for the authenticated student only

### Admin List Payments

- Method: GET
- URL: `/api/v1/admin/payments/`
- Auth: Bearer access token (admin role required)
- Response 200 OK: array of all payment objects

### Approve Payment

- Method: PUT
- URL: `/api/v1/admin/payments/{id}/approve/`
- Auth: Bearer access token (admin role required)
- Behaviour:
  - Only `pending` payments can be approved.
  - Payment becomes `approved`.
  - Linked enrollment becomes `active` through `EnrollmentService.update_enrollment_status(...)`.
- Response 200 OK: updated payment object

### Reject Payment

- Method: PUT
- URL: `/api/v1/admin/payments/{id}/reject/`
- Auth: Bearer access token (admin role required)
- Behaviour:
  - Only `pending` payments can be rejected.
  - Payment becomes `rejected`.
  - Linked enrollment becomes `cancelled` through `EnrollmentService.update_enrollment_status(...)`.
- Response 200 OK: updated payment object

---

## CMS

### Homepage (Public)

- Method: GET
- URL: `/api/v1/homepage/`
- Auth: None (public)
- Response 200 OK (example):
  ```json
  {
    "hero": {
      "title": "Welcome to Elevate Skill",
      "subtitle": "Grow your professional skills today.",
      "background_image": "http://localhost:8000/media/cms/hero/bg.png",
      "cta_text": "Explore Courses",
      "cta_link": "/courses/",
      "updated_at": "2026-06-06T09:19:35Z"
    },
    "about": {
      "title": "About Elevate Skill",
      "content": "We are a top-tier learning platform.",
      "image": null,
      "updated_at": "2026-06-06T09:19:35Z"
    },
    "site_settings": {
      "site_name": "Elevate Skill LMS",
      "contact_info": "support@elevateskill.com",
      "bank_details": "...",
      "payment_instructions": "...",
      "updated_at": "2026-06-06T09:19:35Z"
    },
    "testimonials": [
      {
        "id": 1,
        "student_name": "Alice",
        "student_image": null,
        "message": "Great course!",
        "rating": 5,
        "is_active": true,
        "created_at": "2026-06-06T09:19:35Z"
      }
    ],
    "faqs": [
      {
        "id": 1,
        "question": "How do I enroll?",
        "answer": "Click the Enroll button on any course page.",
        "order": 1,
        "is_active": true,
        "created_at": "2026-06-06T09:19:35Z"
      }
    ]
  }
  ```
- Notes:
  - Returns only `is_active=True` testimonials and FAQs.
  - FAQs are ordered by `order` ascending, then `created_at`.
  - Singleton sections (hero, about, site_settings) are auto-initialized with defaults if they don't exist yet.

### Hero Section (Admin)

- Method: GET, PUT
- URL: `/api/v1/admin/hero/`
- Auth: JWT + admin role
- Request Body (PUT, multipart/form-data or JSON):
  - `title` (string, optional)
  - `subtitle` (string, optional)
  - `background_image` (file upload, optional)
  - `cta_text` (string, optional)
  - `cta_link` (string, optional)
- Response 200 OK (example):
  ```json
  {
    "title": "Welcome to Elevate Skill",
    "subtitle": "Grow your professional skills today.",
    "background_image": "http://localhost:8000/media/cms/hero/bg.png",
    "cta_text": "Explore Courses",
    "cta_link": "/courses/",
    "updated_at": "2026-06-06T09:19:35Z"
  }
  ```

### About Section (Admin)

- Method: GET, PUT
- URL: `/api/v1/admin/about/`
- Auth: JWT + admin role
- Request Body (PUT, multipart/form-data or JSON):
  - `title` (string, optional)
  - `content` (string, optional)
  - `image` (file upload, optional)
- Response 200 OK (example):
  ```json
  {
    "title": "About Elevate Skill",
    "content": "We are a top-tier learning platform.",
    "image": "http://localhost:8000/media/cms/about/about.png",
    "updated_at": "2026-06-06T09:19:35Z"
  }
  ```

### Site Settings (Admin)

- Method: GET, PUT
- URL: `/api/v1/admin/site-settings/`
- Auth: JWT + admin role
- Request Body (PUT, JSON):
  - `site_name` (string, optional)
  - `contact_info` (string, optional)
  - `bank_details` (string, optional)
  - `payment_instructions` (string, optional)
- Response 200 OK (example):
  ```json
  {
    "site_name": "Elevate Skill LMS",
    "contact_info": "support@elevateskill.com",
    "bank_details": "Bank of Elevate, Acct: 123456789",
    "payment_instructions": "Please upload a copy of the payment receipt.",
    "updated_at": "2026-06-06T09:19:35Z"
  }
  ```

### Testimonials (Admin)

- List / Create: `GET|POST /api/v1/admin/testimonials/`
- Detail / Update / Delete: `GET|PUT|PATCH|DELETE /api/v1/admin/testimonials/{id}/`
- Auth: JWT + admin role
- Request Body (POST/PUT, JSON or multipart/form-data):
  - `student_name` (string, required)
  - `student_image` (file upload, optional)
  - `message` (string, required)
  - `rating` (integer, required, 1–5)
  - `is_active` (boolean, optional, default `true`)
- Response object:
  ```json
  {
    "id": 1,
    "student_name": "Alice",
    "student_image": null,
    "message": "Great course!",
    "rating": 5,
    "is_active": true,
    "created_at": "2026-06-06T09:19:35Z"
  }
  ```
- Notes:
  - Admin list returns all testimonials regardless of `is_active`.
  - `rating` is validated to be between 1 and 5 inclusive; invalid values return 400.

### FAQs (Admin)

- List / Create: `GET|POST /api/v1/admin/faqs/`
- Detail / Update / Delete: `GET|PUT|PATCH|DELETE /api/v1/admin/faqs/{id}/`
- Auth: JWT + admin role
- Request Body (POST/PUT, JSON):
  - `question` (string, required, max 500 chars)
  - `answer` (string, required)
  - `order` (integer, optional, default `0`) — controls display order
  - `is_active` (boolean, optional, default `true`)
- Response object:
  ```json
  {
    "id": 1,
    "question": "How do I enroll?",
    "answer": "Click the Enroll button on any course page.",
    "order": 1,
    "is_active": true,
    "created_at": "2026-06-06T09:19:35Z"
  }
  ```
- Notes:
  - Admin list returns all FAQs regardless of `is_active`.
  - FAQs are ordered by `order` ascending, then `created_at`.

---

## Announcements & News

### Student & Public Feeds

#### List Announcements
- Method: GET
- URL: `/api/v1/announcements/`
- Auth: Bearer access token (IsAuthenticated)
- Response 200 OK: array of announcement objects (only published ones, `is_published=True`)
- Example response:
  ```json
  [
    {
      "id": 1,
      "title": "Welcome to Semester 2",
      "content": "Classes begin on Monday.",
      "date": "2026-06-06T12:00:00Z",
      "is_published": true,
      "created_by": {
        "id": 2,
        "username": "admin1",
        "email": "admin1@test.com",
        "full_name": "Admin One",
        "role": "admin"
      },
      "created_at": "2026-06-06T12:00:00Z",
      "updated_at": "2026-06-06T12:00:00Z"
    }
  ]
  ```

#### List News Posts
- Method: GET
- URL: `/api/v1/news/`
- Auth: None (Public endpoint)
- Response 200 OK: array of news post objects (only published ones, `status='published'`)
- Example response:
  ```json
  [
    {
      "id": 1,
      "title": "LMS Launching Soon",
      "excerpt": "Short description",
      "content": "This is the full news post body.",
      "image": null,
      "author": {
        "id": 2,
        "username": "admin1",
        "email": "admin1@test.com",
        "full_name": "Admin One",
        "role": "admin"
      },
      "status": "published",
      "created_at": "2026-06-06T12:00:00Z",
      "updated_at": "2026-06-06T12:00:00Z"
    }
  ]
  ```

### Admin Endpoints

All admin endpoints below require JWT Bearer authentication with an admin role.

#### Admin Announcements CRUD
- List: `GET /api/v1/admin/announcements/`
- Create: `POST /api/v1/admin/announcements/`
  - Body:
    ```json
    {
      "title": "New Alert",
      "content": "This is an alert.",
      "is_published": true
    }
    ```
- Retrieve: `GET /api/v1/admin/announcements/{id}/`
- Update: `PUT|PATCH /api/v1/admin/announcements/{id}/`
- Delete: `DELETE /api/v1/admin/announcements/{id}/`

#### Admin News Posts CRUD
- List: `GET /api/v1/admin/news/`
- Create: `POST /api/v1/admin/news/` (can be multipart/form-data for image upload)
  - Body:
    ```json
    {
      "title": "New Post Title",
      "excerpt": "New excerpt",
      "content": "New post full content.",
      "status": "published"
    }
    ```
- Retrieve: `GET /api/v1/admin/news/{id}/`
- Update: `PUT|PATCH /api/v1/admin/news/{id}/`
- Delete: `DELETE /api/v1/admin/news/{id}/`

---

## Errors and Status Codes

- 200 OK — successful GET/PUT/PATCH
- 201 Created — successful POST
- 204 No Content — successful DELETE
- 400 Bad Request — validation errors
- 401 Unauthorized — missing/invalid token for protected endpoints
- 403 Forbidden — authenticated but lacking admin role
- 404 Not Found — missing resource or course not public
- 413 Payload Too Large — may occur at the server/proxy layer for oversized uploads

---

## Notes

- All admin endpoints require the user model's `role` to equal the string `admin`.
- Slugs are auto-generated; clients must not provide `slug` fields when creating/updating.
- Use `category__slug` filter to provide human-readable category filtering.
- Payment proof uploads are handled with multipart form requests and stored under `media/payments/proofs/` in development.
