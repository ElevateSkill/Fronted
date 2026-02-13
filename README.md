# Elevate-Skill

/Elevative-Skill (Root)
├── frontend/              # Vite + React Root
│   ├── public/            # Fonts & High-res static images
│   ├── src/
│   │   ├── assets/        # Styles (index.css) & SVG illustrations
│   │   ├── components/    # UI Atoms (Buttons, Inputs, GlassCard)
│   │   ├── features/      # Large logic blocks (CoursePlayer, AuthForm)
│   │   ├── hooks/         # useAuth, useProgress, useMotion
│   │   ├── pages/         # Home.jsx, Dashboard.jsx, CourseDetail.jsx
│   │   └── services/      # Axios instance & API endpoints
│   ├── tailwind.config.js # Custom color palette & animations
│   └── package.json
├── docker-compose.yml     # For team-wide environment setup
└── README.md              # Project Documentation

___backend/
  ├── core/               # Project settings & WSGI/ASGI
  ├── apps/
  │   ├── core/              # Project settings & WSGI
  │   ├── apps/              # Specific features
  │   │   ├── users/         # Custom User Model (Auth)
  │   │   ├── courses/       # Course logic, Lessons, Quizzes
  │   │   └── dashboard/     # Analytics & Progress tracking
  │   ├── api/               # Serializers & ViewSets (DRF)
  │   ├── .env.example       # Template for secrets
  │   ├── authentication/ # JWT, Custom User Model
  │   ├── courses/        # Logic for Roadmap, Lessons, Content
  │   │   ├── models.py
  │   │   ├── serializers.py
  │   │   ├── services.py # <--- Business logic goes here
  │   │   └── views.py
  │   └── analytics/      # Progress tracking & statistics
  ├── requirements.txt
  └── manage.py

