# Elevate Skill — API Documentation

Base URL: `http://localhost:8000/api`

---

## Authentication

### POST /api/register/

Create a new user account.

**Request Body:**

| Field            | Type   | Required | Description                    |
|------------------|--------|----------|--------------------------------|
| `full_name`      | string | yes      | User's full name               |
| `username`       | string | yes      | Unique username                |
| `email`          | string | yes      | Valid email address            |
| `password`       | string | yes      | Password (min 6 chars)         |

**Frontend fields mapped:** `Register.jsx` form state → `{ full_name, username, email, password }`  
The frontend strips `confirm_password` before sending via `api.js` `register()`.

**Success Response (201):**
```json
{
  "id": 1,
  "full_name": "Dawit Alemu",
  "username": "dawit_a",
  "email": "dawit@example.com",
  "role": "Student",
  "status": "Active"
}
```

**Error Response (400):**
```json
{
  "email": ["Already exists"],
  "username": ["This field is required."]
}
```
Frontend parses `errorData` dynamically — extracts the first key and its first error message.

---

### POST /api/login/

Authenticate and receive a token.

**Request Body:**

| Field      | Type   | Required | Description          |
|------------|--------|----------|----------------------|
| `username` | string | yes      | Registered username  |
| `password` | string | yes      | Account password     |

**Success Response (200):**
```json
{
  "token": "abc123...",
  "user": {
    "id": 1,
    "full_name": "Dawit Alemu",
    "username": "dawit_a",
    "email": "dawit@example.com",
    "role": "Student"
  }
}
```

---

## User Dashboard

### GET /api/users/me/

Fetch the authenticated user's profile.

**Headers:** `Authorization: Token <token>`

**Response (200):**
```json
{
  "id": 1,
  "full_name": "Dawit Alemu",
  "username": "dawit_a",
  "email": "dawit@example.com",
  "phone": "+251911223344",
  "bio": "Full-stack developer in training",
  "role": "Student",
  "status": "Active",
  "date_joined": "2026-05-01"
}
```

**Frontend usage:** `UserDashboard.jsx` → `profile` state maps to `full_name`, `email`, `phone`, `bio` fields in the Settings → Profile section.

### PUT /api/users/me/

Update profile.

**Request Body:**

| Field      | Type   | Required | Description     |
|------------|--------|----------|-----------------|
| `full_name`| string | no       | Updated name    |
| `email`    | string | no       | Updated email   |
| `phone`    | string | no       | Phone number    |
| `bio`      | string | no       | Short bio       |

### POST /api/users/change-password/

**Request Body:**

| Field             | Type   | Required | Description            |
|-------------------|--------|----------|------------------------|
| `current_password`| string | yes      | Current password       |
| `new_password`    | string | yes      | New password (min 6)   |
| `confirm_password`| string | yes      | Must match new password |

**Frontend fields:** `passwordForm.current`, `passwordForm.newPass`, `passwordForm.confirm`

---

## Courses

### GET /api/courses/

List all courses.

**Response (200):**
```json
[
  {
    "id": 1,
    "title": "Full-Stack Web Development",
    "instructor": "Lidetu Tesfaye",
    "description": "Learn full-stack development...",
    "price": "2500.00",
    "category": "Web Development",
    "image": "https://images.unsplash.com/...",
    "status": "Active",
    "lessons": 48,
    "created_at": "2026-04-15"
  }
]
```

**Frontend usage:** `UserDashboard.jsx` → `enrolledCourses` array maps `title`, `instructor`, `progress`, `lessons`, `completed`, `nextLesson`, `image`.

### GET /api/courses/enrolled/

Get logged-in user's enrolled courses with progress.

**Response (200):**
```json
[
  {
    "id": 1,
    "course_id": 1,
    "title": "Full-Stack Web Development",
    "instructor": "Lidetu Tesfaye",
    "progress": 65,
    "lessons": 48,
    "completed": 31,
    "next_lesson": "API Integration with Node.js",
    "image": "https://images.unsplash.com/..."
  }
]
```

### POST /api/courses/enroll/

Enroll in a course.

**Request Body:**

| Field       | Type | Required | Description  |
|-------------|------|----------|--------------|
| `course_id` | int  | yes      | Course ID    |

---

## Payment Proof

### GET /api/payments/

List user's payment submissions.

**Response (200):**
```json
[
  {
    "id": 1,
    "full_name": "Dawit Alemu",
    "email": "dawit@example.com",
    "phone": "+251911223344",
    "proof_file": "/media/payments/proof.pdf",
    "status": "Pending",
    "submitted_at": "2026-06-01T10:30:00Z"
  }
]
```

### POST /api/payments/

Submit a new payment proof.

**Request Body (multipart/form-data):**

| Field       | Type   | Required | Description               |
|-------------|--------|----------|---------------------------|
| `full_name` | string | yes      | Payer's full name         |
| `email`     | string | yes      | Payer's email             |
| `phone`     | string | yes      | Payer's phone number      |
| `proof`     | file   | yes      | PDF or image (max 5MB)    |

**Frontend usage:** `UserDashboard.jsx` → `paymentForm` state + `uploadedFile` + `handlePaymentSubmit()`.

---

## Support Tickets

### GET /api/tickets/

List user's support tickets.

**Response (200):**
```json
[
  {
    "id": 1,
    "subject": "Cannot access course",
    "message": "I enrolled but...",
    "priority": "High",
    "status": "Open",
    "created_at": "2026-06-02T14:00:00Z"
  }
]
```

### POST /api/tickets/

Submit a support ticket.

**Request Body:**

| Field     | Type   | Required | Description              |
|-----------|--------|----------|--------------------------|
| `subject` | string | yes      | Ticket subject           |
| `message` | string | yes      | Detailed description     |
| `priority`| string | yes      | Low, Normal, or High     |

**Frontend fields:** `ticketForm.subject`, `ticketForm.message`, `ticketForm.priority`

---

## Notifications

### GET /api/notifications/

**Response (200):**
```json
[
  {
    "id": 1,
    "type": "course_update",
    "message": "New lesson available",
    "read": false,
    "created_at": "2026-06-02T12:00:00Z"
  }
]
```

### PUT /api/notifications/{id}/read/

Mark notification as read.

### PUT /api/notifications/preferences/

Update notification preferences.

**Request Body:**

| Field   | Type    | Required | Description               |
|---------|---------|----------|---------------------------|
| `email` | boolean | no       | Email notifications on/off|
| `sms`   | boolean | no       | SMS notifications on/off  |
| `push`  | boolean | no       | Push notifications on/off |

**Frontend fields:** `notifications.email`, `notifications.sms`, `notifications.push`

---

## Admin Endpoints

### GET /api/admin/users/
### POST /api/admin/users/
### PUT /api/admin/users/{id}/
### DELETE /api/admin/users/{id}/

Manage users. Fields: `full_name`, `email`, `username`, `role` (Student/Admin/Instructor), `status` (Active/Inactive).

**Frontend usage:** `AdminDashboard.jsx` Users tab → `editItem` state maps to `name`, `email`, `role`, `status`.

### GET /api/admin/courses/
### POST /api/admin/courses/
### PUT /api/admin/courses/{id}/
### DELETE /api/admin/courses/{id}/

Manage courses. Fields: `title`, `category`, `description`, `price`, `image`, `status` (Active/Draft).

**Frontend usage:** `AdminDashboard.jsx` Courses tab → `newCourse` / `editItem` maps to `title`, `category`, `desc`, `price`, `status`.

### GET /api/admin/payments/
### PUT /api/admin/payments/{id}/approve/
### PUT /api/admin/payments/{id}/reject/

Approve or reject payment proofs.

### GET /api/admin/tickets/
### PUT /api/admin/tickets/{id}/
### DELETE /api/admin/tickets/{id}/

Manage support tickets.

### GET /api/admin/testimonials/
### POST /api/admin/testimonials/
### PUT /api/admin/testimonials/{id}/
### DELETE /api/admin/testimonials/{id}/

Manage testimonials. Fields: `name`, `role`, `company`, `text`, `rating` (1-5), `image`.

### GET /api/admin/gallery/
### POST /api/admin/gallery/
### PUT /api/admin/gallery/{id}/
### DELETE /api/admin/gallery/{id}/

Manage gallery albums. Fields: `name`, `cover` (image URL), images.

### GET /api/admin/announcements/
### POST /api/admin/announcements/
### DELETE /api/admin/announcements/{id}/

Manage announcements. Fields: `title`, `body`, `date`.

### GET /api/admin/blog-posts/
### POST /api/admin/blog-posts/
### PUT /api/admin/blog-posts/{id}/
### DELETE /api/admin/blog-posts/{id}/

Manage blog/news posts. Fields: `title`, `excerpt`, `image`, `status` (Draft/Published), `author`, `content`.

---

## Error Handling

All endpoints return errors in Django REST Framework format:
```json
{
  "field_name": ["Error message"]
}
```

The frontend (`Register.jsx`, `Login.jsx`) parses this dynamically:
```js
const firstKey = Object.keys(errorData)[0];
errorMessage = `${firstKey.replace('_', ' ')}: ${errorData[firstKey][0]}`;
```

---

## Backend Architecture

The backend follows Django + DRF (Django REST Framework) with:

- **Token Authentication** via `rest_framework.authtoken`
- **ModelViewSet** for CRUD endpoints
- **Multipart/form-data** for file uploads (payment proofs)
- **CORS** configured via `django-cors-headers`
- Database: PostgreSQL / SQLite (development)

### Key Models:
| Model          | Fields                                                                 |
|----------------|------------------------------------------------------------------------|
| User           | full_name, username, email, password, phone, bio, role, status         |
| Course         | title, instructor, description, price, category, image, status, lessons|
| Enrollment     | user, course, progress, completed, next_lesson                         |
| Payment        | user, full_name, email, phone, proof_file, status, submitted_at        |
| Ticket         | user, subject, message, priority, status, created_at                   |
| Notification   | user, type, message, read, created_at                                  |
| Testimonial    | name, role, company, text, rating, image                               |
| GalleryAlbum   | name, cover                                                            |
| Announcement   | title, body, date                                                      |
| BlogPost       | title, excerpt, image, status, author, content, created_at             |
