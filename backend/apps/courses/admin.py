from django.contrib import admin
from apps.courses.models import Category, Course


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'created_at']
    search_fields = ['name']
    prepopulated_fields = {'slug': ('name',)}


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'price', 'course_url', 'is_active', 'is_published', 'created_at']
    list_filter = ['is_active', 'is_published', 'category', 'created_at']
    search_fields = ['title', 'short_description', 'description']
    prepopulated_fields = {'slug': ('title',)}
    readonly_fields = ['slug', 'created_at', 'updated_at']
    fieldsets = (
        ('Basic Info', {
            'fields': ('title', 'slug', 'short_description', 'description', 'thumbnail', 'course_url')
        }),
        ('Metadata', {
            'fields': ('category', 'duration', 'price', 'instructor', 'lessons')
        }),
        ('Details', {
            'fields': ('requirements', 'learning_outcomes')
        }),
        ('Status', {
            'fields': ('is_active', 'is_published')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
