# Generated by Django 5.0.3 on 2024-05-01 07:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('server', '0014_serverchatroom_server_object'),
    ]

    operations = [
        migrations.AlterField(
            model_name='serverchatroom',
            name='messages',
            field=models.ManyToManyField(blank=True, to='server.servermessage'),
        ),
    ]