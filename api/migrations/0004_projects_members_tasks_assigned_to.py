# Generated by Django 5.0.6 on 2024-07-17 07:10

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_instruction'),
    ]

    operations = [
        migrations.AddField(
            model_name='projects',
            name='members',
            field=models.ManyToManyField(blank=True, related_name='members', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='tasks',
            name='assigned_to',
            field=models.ManyToManyField(blank=True, related_name='assigned_to', to=settings.AUTH_USER_MODEL),
        ),
    ]
