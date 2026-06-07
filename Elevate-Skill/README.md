# Elevate Skill

A project-based learning platform for the modern engineer.

## Project Structure

```
.
├── backend/   # Django + DRF API (separate repo on GitHub)
└── frontend/  # Vite + React + Tailwind 4 + Framer Motion
```

The frontend and the backend are kept in two separate Git repositories:
* `git@github.com:ElevateSkill/backend.git`
* `git@github.com:ElevateSkill/Fronted.git`

Both are mirrored here in a single workspace for development.

---

## Frontend (this folder)

Stack: **React 19 · Vite 7 · Tailwind CSS 4 · Framer Motion 12 · React Router 7 · Axios · Lucide Icons**.

### Getting started

```bash
cd frontend
npm install
cp .env.example .env       # edit VITE_API_URL if your backend is not on localhost:8000
npm run dev                # start the dev server (default: http://localhost:5173)
npm run build              # production build
npm run preview            # preview the production build
```

### Environment variables

| Var | Default | Description |
|---|---|---|
| `VITE_API_URL` | `http://localhost:8000/api/v1` | Base URL of the Django backend |

### Frontend → Backend integration

The frontend talks to the Django backend at `/api/v1/`. Every page that previously relied on local data has been wired up to fetch from the real endpoints, with automatic fallback to local data when the API is unavailable. You can see which sections are live by the small "Live from /endpoint/" badge in the section header.

| Section | Component | Backend endpoint |
|---|---|---|
| Top announcement ticker | `components/AnnouncementTicker.jsx` | `GET /api/v1/announcements/` |
| Hero (singleton) | `pages/Landing.jsx` | `GET /api/v1/homepage/` → `hero` |
| Programs / Courses | `pages/Courses.jsx` | `GET /api/v1/courses/` |
| Testimonials | `pages/Testimonals.jsx` | `GET /api/v1/homepage/` → `testimonials` |
| FAQs | `pages/FAQ.jsx` | `GET /api/v1/homepage/` → `faqs` |
| News / Blog | `pages/Blog.jsx` | `GET /api/v1/news/` |
| Auth (login / register / logout / profile) | `context/AuthContext.jsx` | `POST /api/v1/auth/login/` etc. |
| Admin dashboard metrics | `pages/admin/AdminDashboard.jsx` | `GET /api/v1/admin/dashboard/` |
| Admin courses CRUD | `pages/admin/sections/Courses.jsx` | `GET\|POST /api/v1/admin/courses/` |
| Admin testimonials CRUD | `pages/admin/sections/Testimonials.jsx` | `GET\|POST /api/v1/admin/testimonials/` |
| Admin FAQ CRUD | `pages/admin/sections/Announcements.jsx` | `GET\|POST /api/v1/admin/faqs/` |

All API calls go through `src/services/api.js`, which is a thin Axios wrapper around the Django endpoints declared in `backend/docs/api_contract.md`.

---

## Backend

A Django + Django REST Framework service that exposes the contract documented in `backend/docs/api_contract.md`. Run it on `http://localhost:8000` for the frontend's default `VITE_API_URL` to work.

### Quick start

```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python seed.py
python manage.py runserver 0.0.0.0:8000
```

### Default users (after seeding)

| Role | Username | Password |
|---|---|---|
| Admin  | `admin`    | `admin1234` |
| Student | `student1` | `student1234` |

### API Docs

* `GET /api/v1/schema/` — OpenAPI JSON
* `GET /api/v1/schema/swagger-ui/` — Swagger UI
* `GET /api/v1/schema/redoc/` — ReDoc

The full endpoint reference is in [`backend/docs/api_contract.md`](backend/docs/api_contract.md).

### User payload (for reference)

```json
{
  "username": "user1",
  "email": "user@example.com",
  "password": "qwerty#123",
  "full_name": "User User",
  "phone_number": "0900000000"
}
```

```json
{
  "username": "admin",
  "email": "admin@gmail.com",
  "password": "qwerty#123",
  "full_name": "Admin Admin",
  "role": "admin",
  "phone_number": "090000002"
}
```

### Course payload (for reference)

```json
{
  "id": 1,
  "title": "Modern Front-End Development with React & TypeScript",
  "slug": "modern-front-end-development-with-react-typescript",
  "short_description": "Master the essentials of building fast, scalable, and responsive web applications.",
  "description": "Dive deep into modern front-end engineering...",
  "thumbnail": null
}
```
