from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0002_course_courses_cou_is_acti_8e0d16_idx_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='course',
            name='course_url',
            field=models.URLField(blank=True, max_length=500),
        ),
    ]
