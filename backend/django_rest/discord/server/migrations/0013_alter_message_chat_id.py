# Generated by Django 5.0.3 on 2024-04-30 18:05

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('server', '0012_servermessage'),
    ]

    operations = [
        migrations.AlterField(
            model_name='message',
            name='chat_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='server.chat'),
        ),
    ]