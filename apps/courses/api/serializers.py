from rest_framework import serializers
from apps.courses.models import Category, Course


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'created_at']
        read_only_fields = ['slug', 'created_at']


class CourseListSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source='category', write_only=True, required=False
    )

    class Meta:
        model = Course
        fields = [
            'id', 'title', 'slug', 'short_description', 'thumbnail',
            'category', 'category_id', 'price', 'instructor',
            'lessons', 'duration', 'is_active', 'is_published',
        ]
        read_only_fields = ['slug']


class CourseDetailSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source='category', write_only=True, required=False
    )

    class Meta:
        model = Course
        fields = [
            'id', 'title', 'slug', 'short_description', 'description',
            'thumbnail', 'category', 'category_id', 'duration',
            'requirements', 'learning_outcomes', 'price', 'instructor',
            'lessons', 'is_active', 'is_published', 'created_at', 'updated_at',
        ]
        read_only_fields = ['slug', 'created_at', 'updated_at']
