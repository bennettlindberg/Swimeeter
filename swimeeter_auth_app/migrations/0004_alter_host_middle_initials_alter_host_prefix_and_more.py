# Generated by Django 4.2.2 on 2023-08-03 18:30

from django.db import migrations, models
import swimeeter_auth_app.validators


class Migration(migrations.Migration):

    dependencies = [
        ('swimeeter_auth_app', '0003_remove_host_data_entry_warnings'),
    ]

    operations = [
        migrations.AlterField(
            model_name='host',
            name='middle_initials',
            field=models.CharField(blank=True, default='', max_length=255, validators=[swimeeter_auth_app.validators.host_mi_validator]),
        ),
        migrations.AlterField(
            model_name='host',
            name='prefix',
            field=models.CharField(blank=True, default='', max_length=255, validators=[swimeeter_auth_app.validators.host_ps_fix_validator]),
        ),
        migrations.AlterField(
            model_name='host',
            name='suffix',
            field=models.CharField(blank=True, default='', max_length=255, validators=[swimeeter_auth_app.validators.host_ps_fix_validator]),
        ),
    ]
