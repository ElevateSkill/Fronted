from django.shortcuts import get_object_or_404
from apps.courses.models import Category


class CategoryService:

    @staticmethod
    def get_all_categories():
        return Category.objects.all().order_by('name')

    @staticmethod
    def get_category_detail(category_id):
        return get_object_or_404(Category, id=category_id)

    @staticmethod
    def delete_category(instance):
        instance.delete()
