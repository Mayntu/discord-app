# Generated by Django 5.0.3 on 2024-06-11 15:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('server', '0010_serveraudioroom_is_private'),
    ]

    operations = [
        migrations.AddField(
            model_name='server',
            name='roles',
            field=models.ManyToManyField(blank=True, related_name='roles', to='server.serverrole', verbose_name='roles'),
        ),
    ]
