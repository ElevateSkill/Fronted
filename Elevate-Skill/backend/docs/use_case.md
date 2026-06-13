# Use Cases — Elevate Skill LMS (Project-wide)

This document collects the primary flows for interacting with the API across accounts and courses. It documents authentication rules, required scopes/roles, and step-by-step flows.

1. User Registration → Login → Profile

- Actors: anonymous user → authenticated user
- Purpose: allow new students to register, then authenticate and manage profile.

Flow:

1. Register: `POST /api/v1/auth/register/` with username, email, password, full_name
   - Outcome: 201 Created, returns `access` and `refresh` tokens and user object
2. Login (alternate): `POST /api/v1/auth/login/` with username+password
   - Outcome: 200 OK with `access` and `refresh`
3. Use `access` token in header `Authorization: Bearer <access>` for authenticated endpoints
4. Profile: `GET /api/v1/profile/` to retrieve; `PUT /api/v1/profile/` to update (can include `password` change)

Auth rules & Security:

- Register and Login: public
- Profile: JWT required
- **Rate limiting**: Registration and Login are limited to 10 requests / hour per IP.
- **Input sanitization**: Free-text profile fields are sanitized server-side (HTML stripped).

2. Admin Course Management (create → publish → manage)

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

3. Public Consumption (discover & enroll flow)

- Actors: Public users / Students
- Purpose: discover courses, view details, and enroll.

Discovery Flow:

1. List: `GET /api/v1/courses/` to browse published & active courses
   - Filter by category: `?category=1` or `?category__slug=programming`
   - Search: `?search=django`
   - Note: The response is **paginated** and **cached** for 2 minutes.
2. Detail: `GET /api/v1/courses/{id}/` — shows full course content

Enrollment Flow:

1. Authenticate: Student obtains JWT via `POST /api/v1/auth/login/` or registration.
2. Enroll: Student calls `POST /api/v1/enrollments/` with `{ "course": <course_id> }` to create an enrollment.
   - Outcome: 201 Created with initial `pending` status.
   - Guards: Checks for course active/published status, prevents duplicate enrollments, and enforces that only users with the `student` role are allowed (via `IsStudent` permission).
   - **Rate limit**: 30 requests / hour per user.
3. List: Student views all their current enrollments via `GET /api/v1/my-enrollments/`. (Returns a **paginated** response). Requires the user to have the `student` role (via `IsStudent` permission).


Notes & Requirements

- Media uploads (thumbnails): use `multipart/form-data` and include `thumbnail` file in the POST/PATCH request body when creating/updating a course.
- Backwards compatibility: `slug` generation ensures stable URLs when provided; collisions are prevented by unique constraint.
- Error handling: clients should handle 400/401/403/404 accordingly and surface messages to the user.

4. Student Payment Submission → Admin Approval / Rejection

- Actors: authenticated student, admin reviewer
- Purpose: let students upload proof of payment for a pending enrollment and let admins approve or reject it.

Student flow:

1. Student logs in and creates an enrollment for an active, published course.
2. Student submits payment proof with `POST /api/v1/payments/` using `multipart/form-data`.
3. Include `enrollment_id`, `full_name`, `email`, `phone`, and `proof_file`, `payment method`.
   - **Input sanitization**: Text fields (`full_name`, `email`, `phone`) are sanitized to strip HTML.
4. The backend validates that the enrollment belongs to the student and is still `pending`.
5. The backend accepts only PDF, JPG, or PNG files up to 5MB.
   - **File validation**: Deep validation checks file magic bytes and rejects spoofed content types or malicious filenames.
6. A payment record is created with `status=pending` and can be listed later with `GET /api/v1/payments/`.
   - **Rate limit**: Submissions are limited to 20 requests / hour per user.

Admin flow:

1. Admin logs in with JWT and opens `GET /api/v1/admin/payments/` to review submissions.
2. Admin approves a valid pending payment with `PUT /api/v1/admin/payments/{id}/approve/`.
3. Approval changes the payment to `approved` and activates the linked enrollment.
4. Admin rejects an invalid payment with `PUT /api/v1/admin/payments/{id}/reject/`.
5. Rejection changes the payment to `rejected` and cancels the linked enrollment.

Notes & Requirements

- Students can only view their own payments.
- Only admins can view or moderate all payments.
- Non-pending payments cannot be approved or rejected.
- Payment moderation must update enrollment state through the enrollment service, not duplicate status logic in the payment layer.

5. Content Management (CMS)

### 5a. Public Homepage

- Actors: Any visitor (anonymous or authenticated)
- Purpose: Provide a single endpoint that aggregates all homepage content for the frontend.

Flow:

1. Frontend calls `GET /api/v1/homepage/` (no authentication required).
2. Response includes: hero section, about section, site settings, active testimonials, and active FAQs.
3. Only testimonials and FAQs with `is_active=True` are returned.
4. FAQs are ordered by `order` ascending, then `created_at`.
5. **Caching**: The entire homepage response is cached for 5 minutes.

### 5b. Bank Account Detail Management (Admin)
- Actors: Admin user (must have `role == 'admin'`)
- Purpose: Manage bank account details used for payment instructions.
Flow:
1. Admin obtains JWT via `POST /api/v1/auth/login/` (login as admin).
2. Retrieve Bank Details: Admin calls `GET /api/v1/admin/bank-account/
` to view current bank account information.
   - Note: If no record exists, the service layer initializes a default singleton record and returns it.
3. Update Bank Details: Admin calls `PUT /api/v1/admin/bank-account/` to update fields like `bank_name`, `account_holder_name`, and `account_number`.
   - Note: The singleton pattern ensures only one bank account record exists; attempts to create additional records are blocked.
Auth rules:
- All admin CMS endpoints require JWT + `role == 'admin'`. Anonymous users get
401 Unauthorized, and student users get 403 Forbidden.

### 5c. Static Content Management (Admin)

- Actors: Admin user (must have `role == 'admin'`)
- Purpose: Manage static content of the website (Hero section, About section, and Site Settings) through singleton instances.

Flow:

1. Admin obtains JWT via `POST /api/v1/auth/login/` (login as admin).
2. Retrieve Static Content: Admin calls `GET /api/v1/admin/hero/` (or `/admin/about/` or `/admin/site-settings/`) to view the current configuration.
   - Note: If no record has been created in the database yet, the service layer automatically initializes the singleton record with default/empty fields and returns 200 OK.
3. Update Static Content: Admin calls `PUT /api/v1/admin/hero/` (or `/admin/about/` or `/admin/site-settings/`) to update one or more fields.
   - Note: Background images and illustrations are uploaded via multipart form data requests.
   - Any attempt to create another record is blocked by the singleton model pattern (the database always holds a single row with ID = 1).

### 5d. Testimonial Management (Admin)

- Actors: Admin user (must have `role == 'admin'`)
- Purpose: Manage student testimonials displayed on the homepage.

Flow:

1. Admin logs in and obtains JWT.
2. List all testimonials: `GET /api/v1/admin/testimonials/` — returns all records including inactive ones.
3. Create testimonial: `POST /api/v1/admin/testimonials/` with `student_name`, `message`, `rating` (1–5), and optional `student_image`.
4. Update testimonial: `PUT|PATCH /api/v1/admin/testimonials/{id}/` — e.g. toggle `is_active` to hide/show on homepage.
5. Delete testimonial: `DELETE /api/v1/admin/testimonials/{id}/` — permanently removes the record.

Notes:

- `rating` is validated server-side to be between 1 and 5; invalid values return 400.
- Setting `is_active=false` hides the testimonial from the public homepage without deleting it.
- **Input sanitization**: Text fields (`student_name`, `message`) are sanitized to strip HTML.
- **Pagination**: The admin list endpoint returns a paginated envelope.

### 5e. FAQ Management (Admin)

- Actors: Admin user (must have `role == 'admin'`)
- Purpose: Manage frequently asked questions displayed on the homepage.

Flow:

1. Admin logs in and obtains JWT.
2. List all FAQs: `GET /api/v1/admin/faqs/` — returns all records including inactive ones, ordered by `order`.
3. Create FAQ: `POST /api/v1/admin/faqs/` with `question`, `answer`, and optional `order` (default 0).
4. Update FAQ: `PUT|PATCH /api/v1/admin/faqs/{id}/` — change content or reorder by updating `order`.
5. Delete FAQ: `DELETE /api/v1/admin/faqs/{id}/` — permanently removes the record.

Notes:

- Use the `order` field to control display sequence; lower values appear first.
- Setting `is_active=false` hides the FAQ from the public homepage without deleting it.
- **Input sanitization**: Text fields (`question`, `answer`) are sanitized to strip HTML.
- **Pagination**: The admin list endpoint returns a paginated envelope.

Auth rules (all CMS admin endpoints):

- All admin CMS endpoints require JWT + `role == 'admin'`. Anonymous users get 401 Unauthorized, and student users get 403 Forbidden.

6. Announcements & News Management

- Actors: Admin user (must have `role == 'admin'`), Students (JWT required for announcements), Public (no auth for news)
- Purpose: Let admins post updates and news, students view announcements, and the public read news posts.

Admin flow:

1. Admin obtains JWT via login.
2. Admin creates an announcement via `POST /api/v1/admin/announcements/` with title, content, and `is_published=True`.
3. Admin creates a news post via `POST /api/v1/admin/news/` with title, excerpt, content, and `status='published'`.
4. Admin can edit or delete announcements/news posts via the respective `/api/v1/admin/...` detail endpoints.

Student/Public consumption flow:

1. Student logs in, views published announcements on `GET /api/v1/announcements/`. (Returns a **paginated** response).
2. Public users browse published news posts on `GET /api/v1/news/` (no JWT token required, returns a **paginated** response).

Auth rules:

- All admin CRUD endpoints require JWT + `role == 'admin'`.
- Student announcements list requires JWT.
- Public news list requires no authentication.

7. Dashboard & Analytics

- Actors: Admin user (must have `role == 'admin'`)
- Purpose: Give admins a single-endpoint overview of platform health — student counts, course counts, payment status breakdown, and recent enrollment activity.

Flow:

1. Admin obtains JWT via `POST /api/v1/auth/login/`.
2. Admin calls `GET /api/v1/admin/dashboard/` to retrieve aggregated metrics.
3. Response includes:
   - `total_students` — count of users with `role='student'`
   - `total_courses` — count of all courses
   - `active_courses` — count of courses that are both `is_active=True` and `is_published=True`
   - `total_enrollments` — count of all enrollment records
   - `payments` — breakdown by status (`pending`, `approved`, `rejected`)
   - `recent_enrollments` — latest 10 enrollments with student name, course title, status, and date

Notes:

- All metrics are computed fresh on every request (no caching in MVP).
- This app has no models — it only reads from `accounts`, `courses`, `enrollments`, and `payments`.
- Students receive 403 Forbidden; unauthenticated users receive 401 Unauthorized.

