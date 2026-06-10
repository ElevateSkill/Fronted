import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model
from apps.courses.models import Category, Course
from apps.cms.models import Testimonial, FAQ

User = get_user_model()

# Admin user
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser(
        username='admin',
        email='admin@elevate.com',
        password='admin1234',
        full_name='Admin User',
        role='admin'
    )

# Student user
if not User.objects.filter(username='student1').exists():
    User.objects.create_user(
        username='student1',
        email='student1@elevate.com',
        password='student1234',
        full_name='Test Student',
        role='student'
    )

# Category
cat, _ = Category.objects.get_or_create(name='Programming')

# Courses
for i in range(1, 4):
    Course.objects.get_or_create(
        title=f'Course {i}',
        defaults={
            'short_description': f'Short description for course {i}',
            'description': f'Full description for course {i}',
            'price': 49.99,
            'is_active': True,
            'is_published': True,
            'category': cat,
        }
    )

# Testimonials
Testimonial.objects.get_or_create(
    student_name='Jane Doe',
    defaults={'message': 'Great platform!', 'rating': 5, 'is_active': True}
)

# FAQs
FAQ.objects.get_or_create(
    question='How do I enroll?',
    defaults={'answer': 'Browse courses and click enroll.', 'order': 1, 'is_active': True}
)

print("Seed complete.")
