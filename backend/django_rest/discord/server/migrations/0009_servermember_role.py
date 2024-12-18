# Generated by Django 5.0.3 on 2024-06-08 18:43

import django.db.models.deletion
import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('server', '0008_permission_servermember_server_moderators_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='servermember',
            name='role',
            field=models.ForeignKey(default=uuid.UUID('0795002e-d455-4015-88e8-2524a7390f8d'), on_delete=django.db.models.deletion.PROTECT, to='server.serverrole', verbose_name='role'),
        ),
    ]
