# Generated by Django 4.2.2 on 2023-07-05 16:10

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('swimeeter_api_app', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='meet',
            name='host',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='meets', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='heatlaneassignment',
            name='entry',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='assignment', to='swimeeter_api_app.entry'),
        ),
        migrations.AddField(
            model_name='heatlaneassignment',
            name='heat',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='assignments', to='swimeeter_api_app.heat'),
        ),
        migrations.AddField(
            model_name='heat',
            name='event',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='heats', to='swimeeter_api_app.event'),
        ),
        migrations.AddField(
            model_name='event',
            name='meet',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='events', to='swimeeter_api_app.meet'),
        ),
        migrations.AddField(
            model_name='entry',
            name='event',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='entries', to='swimeeter_api_app.event'),
        ),
        migrations.AddField(
            model_name='entry',
            name='swimmer',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='entries', to='swimeeter_api_app.swimmer'),
        ),
    ]