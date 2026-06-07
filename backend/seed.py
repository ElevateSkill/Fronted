import os
import django
from datetime import date

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model
from django.utils import timezone
from apps.courses.models import Category, Course
from apps.cms.models import Testimonial, FAQ, HeroSection, About, SiteSettings
from apps.announcements.models import Announcement, NewsPost

User = get_user_model()

admin, _ = User.objects.get_or_create(
    username='admin',
    defaults={
        'email': 'admin@elevate.com',
        'full_name': 'Admin User',
        'role': 'admin',
        'is_staff': True,
        'is_superuser': True,
    }
)
if _:
    admin.set_password('admin1234')
    admin.save()

student, _ = User.objects.get_or_create(
    username='student1',
    defaults={
        'email': 'student1@elevate.com',
        'full_name': 'Test Student',
        'role': 'student',
    }
)
if _:
    student.set_password('student1234')
    student.save()

# ── Categories ──
cats = {}
for name, slug in [
    ('Web Development', 'web-development'),
    ('UI/UX Design', 'ui-ux-design'),
    ('AI & Machine Learning', 'ai-ml'),
    ('Cloud & DevOps', 'cloud-devops'),
]:
    c, _ = Category.objects.get_or_create(name=name, defaults={'slug': slug})
    cats[name] = c

# ── Courses ──
course_data = [
    dict(title='Full-Stack Web Development', short_description='Build modern web apps with React, Django, and PostgreSQL.', description='Master frontend and backend development. Covers React, Django REST Framework, PostgreSQL, Docker, and deployment.', price=99.99, category=cats['Web Development'], lessons=48, duration='12 weeks', instructor='John Doe'),
    dict(title='UI/UX Design Mastery', short_description='Design beautiful, user-centric interfaces from research to prototype.', description='Learn design thinking, Figma, prototyping, user research, and interaction design. Build a portfolio-ready case study.', price=79.99, category=cats['UI/UX Design'], lessons=36, duration='10 weeks', instructor='Sarah Williams'),
    dict(title='AI & Machine Learning', short_description='Build LLM integrations and train ML models using Python.', description='Cover Python, TensorFlow, LLM APIs, RAG pipelines, and model deployment. Real-world projects with actual datasets.', price=119.99, category=cats['AI & Machine Learning'], lessons=52, duration='14 weeks', instructor='Dr. Tadese Alemu'),
    dict(title='Cloud & DevOps Engineering', short_description='Master AWS, Docker, Kubernetes, and CI/CD pipelines.', description='Learn cloud infrastructure, containerization, orchestration, monitoring, and infrastructure as code with Terraform.', price=89.99, category=cats['Cloud & DevOps'], lessons=40, duration='10 weeks', instructor='Meron Tekle'),
]
for cd in course_data:
    Course.objects.get_or_create(
        title=cd['title'],
        defaults={**cd, 'is_active': True, 'is_published': True}
    )

# ── Announcements ──
anno_data = [
    ('New Cohort Open', 'Enrollment for our Summer 2026 cohort is now open. Secure your spot today!', True),
    ('Early Bird Discount', 'Register before June 30 and get 20% off any course. Use code EARLY20.', True),
    ('Buildathon 2026', 'Join our annual Buildathon — 48 hours of coding, designing, and innovating. Prizes for top teams.', True),
    ('Free Mentorship Session', 'Sign up for a free 1-on-1 mentorship session with our industry experts.', True),
]
for title, content, published in anno_data:
    Announcement.objects.get_or_create(
        title=title,
        defaults={
            'content': content,
            'is_published': published,
            'created_by': admin,
            'date': timezone.now()
        }
    )

# ── News / Blog Posts ──
news_data = [
    ('Why Full-Stack Development is the Future', 'Companies are looking for developers who understand both frontend and backend. Our comprehensive curriculum prepares you for the real world.', 'published'),
    ('How We Built Our Learning Platform', 'A deep dive into the architecture behind Elevate Skill — Django REST Framework, React, and modern infrastructure.', 'published'),
    ('Student Spotlight: From Beginner to Lead Engineer', 'Dawit Mekonnen shares his journey from a complete beginner to a senior fullstack engineer at a leading tech company.', 'published'),
]
for title, content, status in news_data:
    NewsPost.objects.get_or_create(
        title=title,
        defaults={
            'content': content,
            'excerpt': content[:120],
            'status': status,
            'author': admin,
        }
    )

# ── Testimonials ──
testimonial_data = [
    ('Dawit Mekonnen', 'The project-based approach taught me how to architect complex systems. I doubled my salary in six months.', 5, True),
    ('Selamawit Bekele', 'Most courses focus on tools, but here I learned the psychology of design. The feedback from mentors was invaluable.', 5, True),
    ('Abenezer Lemma', 'While others were talking about AI, we were building LLM integrations. The curriculum is ahead of industry standards.', 5, True),
    ('Hana Tadesse', 'The career support and portfolio reviews helped me land my dream job at a top tech company. Highly recommend!', 5, True),
]
for name, msg, rating, active in testimonial_data:
    Testimonial.objects.get_or_create(
        student_name=name,
        defaults={'message': msg, 'rating': rating, 'is_active': active}
    )

# ── FAQs ──
faq_data = [
    ('How do I enroll?', 'Browse our courses and click "Enroll Now". Follow the payment instructions to complete your registration.', 1, True),
    ('Are the courses self-paced?', 'Yes! All courses are self-paced with lifetime access. You can learn at your own speed.', 2, True),
    ('Do I get a certificate?', 'Yes, upon completion of any course you will receive a verified certificate.', 3, True),
    ('Can I switch courses?', 'Absolutely. If a course doesn\'t fit your needs, you can switch within the first 14 days.', 4, True),
    ('Is there community support?', 'Yes! Join our Telegram group to connect with mentors and fellow learners.', 5, True),
]
for q, a, order, active in faq_data:
    FAQ.objects.get_or_create(
        question=q,
        defaults={'answer': a, 'order': order, 'is_active': active}
    )

# ── Hero Section (singleton) ──
HeroSection.objects.get_or_create(
    defaults={
        'title': 'Elevate Your Skills',
        'subtitle': 'Master in-demand tech skills with industry-driven courses and hands-on projects.',
    }
)

# ── About Section (singleton) ──
About.objects.get_or_create(
    defaults={
        'content': 'Elevate Skill is a next-generation LMS platform built by industry professionals. Our mission is to bridge the gap between academic learning and real-world industry demands through project-based, mentor-guided courses.',
    }
)

# ── Site Settings (singleton) ──
SiteSettings.objects.get_or_create(
    defaults={
        'site_name': 'Elevate Skill',
        'tagline': 'Learn. Build. Elevate.',
        'contact_email': 'elevateskill369@gmail.com',
        'contact_phone': '+251981807055',
    }
)

print("Seed complete.")
