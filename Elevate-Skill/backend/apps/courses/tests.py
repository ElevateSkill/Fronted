from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken

from apps.courses.models import Category, Course

User = get_user_model()


def get_results(resp):
    if isinstance(resp.data, dict) and 'results' in resp.data:
        return resp.data['results']
    return resp.data


class CoursesTests(APITestCase):
	def setUp(self):
		# URLs
		self.public_list_url = reverse('public-course-list')
		self.admin_list_url = reverse('admin-course-list-create')

		# Create a category
		self.category = Category.objects.create(name='Programming')

		# Create courses with different visibility states
		self.published_course = Course.objects.create(
			title='Published Course',
			short_description='Short desc',
			description='Full description',
			category=self.category,
			price='49.99',
			is_active=True,
			is_published=True,
		)

		self.draft_course = Course.objects.create(
			title='Draft Course',
			short_description='Draft short',
			description='Draft description',
			category=self.category,
			price='29.99',
			is_active=True,
			is_published=False,
		)

		self.disabled_course = Course.objects.create(
			title='Disabled Course',
			short_description='Disabled short',
			description='Disabled description',
			category=self.category,
			price='19.99',
			is_active=False,
			is_published=True,
		)

		# Create users
		self.user = User.objects.create_user(
			username='student1', email='s1@test.com', password='password123', full_name='Student One'
		)

		self.admin = User.objects.create_user(
			username='admin1', email='admin@test.com', password='adminpass', full_name='Admin One', role='admin'
		)

	def auth_as(self, user):
		refresh = RefreshToken.for_user(user)
		self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')

	def test_public_list_returns_only_active_published(self):
		resp = self.client.get(self.public_list_url)
		self.assertEqual(resp.status_code, status.HTTP_200_OK)
		ids = {c['id'] for c in get_results(resp)}
		self.assertIn(self.published_course.id, ids)
		self.assertNotIn(self.draft_course.id, ids)
		self.assertNotIn(self.disabled_course.id, ids)

	def test_public_detail_published_visible(self):
		url = reverse('public-course-detail', kwargs={'pk': self.published_course.id})
		resp = self.client.get(url)
		self.assertEqual(resp.status_code, status.HTTP_200_OK)
		self.assertEqual(resp.data['id'], self.published_course.id)

	def test_public_detail_draft_or_disabled_not_found(self):
		draft_url = reverse('public-course-detail', kwargs={'pk': self.draft_course.id})
		disabled_url = reverse('public-course-detail', kwargs={'pk': self.disabled_course.id})
		self.assertEqual(self.client.get(draft_url).status_code, status.HTTP_404_NOT_FOUND)
		self.assertEqual(self.client.get(disabled_url).status_code, status.HTTP_404_NOT_FOUND)

	def test_admin_list_returns_all_courses_for_admin(self):
		self.auth_as(self.admin)
		resp = self.client.get(self.admin_list_url)
		self.assertEqual(resp.status_code, status.HTTP_200_OK)
		ids = {c['id'] for c in get_results(resp)}
		self.assertIn(self.published_course.id, ids)
		self.assertIn(self.draft_course.id, ids)
		self.assertIn(self.disabled_course.id, ids)

	def test_admin_list_blocked_for_non_admin(self):
		self.auth_as(self.user)
		resp = self.client.get(self.admin_list_url)
		self.assertEqual(resp.status_code, status.HTTP_403_FORBIDDEN)

	def test_admin_create_course(self):
		self.auth_as(self.admin)
		payload = {
			'title': 'New Admin Course',
			'short_description': 'Short',
			'description': 'Long',
			'category_id': self.category.id,
			'price': '9.99',
		}
		resp = self.client.post(self.admin_list_url, payload)
		self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
		self.assertEqual(resp.data['title'], payload['title'])
		self.assertIsNotNone(resp.data.get('slug'))

	def test_admin_patch_toggle_publish_and_active(self):
		self.auth_as(self.admin)
		url = reverse('admin-course-detail', kwargs={'pk': self.draft_course.id})
		resp = self.client.patch(url, {'is_published': True}, format='json')
		self.assertEqual(resp.status_code, status.HTTP_200_OK)
		self.draft_course.refresh_from_db()
		self.assertTrue(self.draft_course.is_published)

		# Toggle active off
		resp = self.client.patch(url, {'is_active': False}, format='json')
		self.assertEqual(resp.status_code, status.HTTP_200_OK)
		self.draft_course.refresh_from_db()
		self.assertFalse(self.draft_course.is_active)

	def test_admin_delete_course(self):
		self.auth_as(self.admin)
		url = reverse('admin-course-detail', kwargs={'pk': self.published_course.id})
		resp = self.client.delete(url)
		self.assertEqual(resp.status_code, status.HTTP_204_NO_CONTENT)
		self.assertFalse(Course.objects.filter(id=self.published_course.id).exists())


class CategoriesTests(APITestCase):
	def setUp(self):
		self.public_list_url = reverse('public-category-list')
		self.admin_list_url = reverse('admin-category-list-create')
		self.cat = Category.objects.create(name='Data Science')

		self.user = User.objects.create_user(
			username='student2', email='s2@test.com', password='password123', full_name='Student Two'
		)
		self.admin = User.objects.create_user(
			username='admin2', email='admin2@test.com', password='adminpass', full_name='Admin Two', role='admin'
		)

		# course for filtering
		self.course = Course.objects.create(
			title='DS Course', short_description='x', description='x', category=self.cat, price='10.00', is_active=True, is_published=True
		)

	def auth_as(self, user):
		refresh = RefreshToken.for_user(user)
		self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')

	def test_public_category_list_and_detail(self):
		resp = self.client.get(self.public_list_url)
		self.assertEqual(resp.status_code, status.HTTP_200_OK)
		self.assertTrue(any(c['id'] == self.cat.id for c in get_results(resp)))

		url = reverse('public-category-detail', kwargs={'pk': self.cat.id})
		resp = self.client.get(url)
		self.assertEqual(resp.status_code, status.HTTP_200_OK)
		self.assertEqual(resp.data['name'], 'Data Science')

	def test_admin_category_crud(self):
		# Non-admin blocked
		self.auth_as(self.user)
		resp = self.client.get(self.admin_list_url)
		self.assertEqual(resp.status_code, status.HTTP_403_FORBIDDEN)

		# Admin can create
		self.auth_as(self.admin)
		resp = self.client.post(self.admin_list_url, {'name': 'ML'})
		self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
		new_id = resp.data['id']

		# Detail update
		url = reverse('admin-category-detail', kwargs={'pk': new_id})
		resp = self.client.patch(url, {'name': 'Machine Learning'}, format='json')
		self.assertEqual(resp.status_code, status.HTTP_200_OK)
		self.assertEqual(resp.data['name'], 'Machine Learning')

		# Delete
		resp = self.client.delete(url)
		self.assertEqual(resp.status_code, status.HTTP_204_NO_CONTENT)

	def test_filter_courses_by_category_slug(self):
		# ensure slug created
		slug = self.cat.slug
		resp = self.client.get(reverse('public-course-list') + f'?category__slug={slug}')
		self.assertEqual(resp.status_code, status.HTTP_200_OK)
		ids = [c['id'] for c in get_results(resp)]
		self.assertIn(self.course.id, ids)

