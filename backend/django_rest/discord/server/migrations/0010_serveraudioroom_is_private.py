# Generated by Django 5.0.3 on 2024-06-10 07:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('server', '0009_servermember_role'),
    ]

    operations = [
        migrations.AddField(
            model_name='serveraudioroom',
            name='is_private',
            field=models.BooleanField(default=False, verbose_name='is private?'),
        ),
    ]