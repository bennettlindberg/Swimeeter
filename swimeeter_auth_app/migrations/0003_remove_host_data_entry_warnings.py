# Generated by Django 4.2.2 on 2023-07-30 00:09

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('swimeeter_auth_app', '0002_host_data_entry_information_host_motion_safe'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='host',
            name='data_entry_warnings',
        ),
    ]