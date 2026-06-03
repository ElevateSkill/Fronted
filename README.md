<div align="center">
  <img src="./Elevate-Skill/frontend/src/assets/logo-elevate.svg" alt="Elevate Skill Logo" width="280" />
  <br/><br/>
  <p>
    <strong>Project-based learning platform for the modern engineer.</strong><br/>
    Build real systems, not just tutorials.
  </p>
  <p>
    <img src="https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white" alt="Vite" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Framer_Motion-0055FF?logo=framer&logoColor=white" alt="Framer Motion" />
  </p>
</div>

---

## Brand Colors

| Color  | Hex       | Usage                          |
|--------|-----------|--------------------------------|
| Cyan   | `#15c8fb` | Primary actions, links, focus  |
| Orange | `#f89f29` | Accent, highlights, warnings   |

The logo gradient (`#15c8fb → #f89f29`) drives the entire UI palette across registration, user dashboard, and admin dashboard.

---

## Project Structure

```
Elevate-Skill/
├── frontend/                          # Vite + React SPA
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   │   └── logo-elevate.svg       # Brand logo
│   │   ├── components/                # Reusable UI atoms
│   │   ├── pages/
│   │   │   ├── Landing.jsx            # Hero slider with CTA
│   │   │   ├── auth/
│   │   │   │   ├── Register.jsx       # Registration form (2-panel)
│   │   │   │   └── Login.jsx          # Authentication
│   │   │   ├── user/
│   │   │   │   └── UserDashboard.jsx  # Student portal (5 tabs)
│   │   │   └── admin/
│   │   │       └── AdminDashboard.jsx # Admin panel (10+ sections)
│   │   ├── services/
│   │   │   └── api.js                 # Axios instance & endpoints
│   │   ├── styles/
│   │   │   └── index.css              # Tailwind directives
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
├── API.md                             # Full API documentation
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Install

```bash
cd Elevate-Skill/frontend
npm install
```

### Run (Development)

```bash
npm run dev
```

Opens at `http://localhost:5173`.

### Build (Production)

```bash
npm run build
```

Output in `frontend/dist/`.

---

## API Configuration

The app expects a Django REST Framework backend at `http://localhost:8000/api`.

Override via environment variable:

```bash
VITE_API_URL=https://your-api.com/api
```

See [`API.md`](./API.md) for complete endpoint reference — all request/response formats, frontend field mappings, and model schemas.

---

## Features

### Public
- **Landing Page** — Full-screen hero slider with auto-play and animated CTAs
- **Registration** — Two-panel layout with brand hero, glassmorphism pill, gradient submit button
- **Login** — Split-panel biometric-themed auth

### User Dashboard (`/dashboard`)
| Tab            | Description                                |
|----------------|--------------------------------------------|
| Home           | Stats, quick overview cards, recent activity|
| My Courses     | Enrolled courses with progress bars        |
| Payment Proof  | Upload payment receipts (name, email, phone, file) |
| Support        | Submit tickets, FAQ accordion              |
| Settings       | Profile editor, password change, notifications, payment history |

### Admin Dashboard (`/admin`)
| Section        | Description                                |
|----------------|--------------------------------------------|
| Overview       | Recent registrations, activity feed, quick actions |
| Users          | CRUD, search, role/status management       |
| Courses        | CRUD with pricing, categories, status      |
| Blog Posts     | Draft/publish workflow                     |
| Testimonials   | Manage with star ratings                   |
| Gallery        | Album management with cover images         |
| Announcements  | Publish platform-wide announcements        |
| Payments       | Approve/reject payment proofs              |

---

## Tech Stack

| Layer      | Technology                     |
|------------|--------------------------------|
| Framework  | React 19                       |
| Build      | Vite                           |
| Styling    | Tailwind CSS 4                  |
| Animation  | Framer Motion                  |
| Icons      | Lucide React                   |
| HTTP       | Axios                          |
| Backend    | Django REST Framework (planned)|

---

## Design System

### Sidebar Pattern
- Fixed-width 240px (user) / 280px (admin)
- No sidebar scroll — only main content scrolls
- Collapses to overlay on mobile (`fixed lg:relative`)
- `border-r border-gray-200 dark:border-white/10`

### Cards
- `rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0c0c0c] shadow-sm`

### Buttons
- Primary: `bg-[#15c8fb]` or `bg-gradient-to-r from-[#15c8fb] to-[#f89f29]` with `rounded-full` + `shadow-2xl`
- Accent: `bg-[#f89f29]`
- Hover: `brightness-110` or `scale-[1.02]`

### Inputs
- `rounded-xl` with `focus:border-[#15c8fb]/50` and `bg-gray-50 dark:bg-white/[0.03]`
