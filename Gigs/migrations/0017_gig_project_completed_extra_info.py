# Generated by Django 3.1 on 2021-10-29 15:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Gigs', '0016_auto_20211029_1328'),
    ]

    operations = [
        migrations.AddField(
            model_name='gig_project_completed',
            name='Extra_info',
            field=models.CharField(default='', max_length=10000),
            preserve_default=False,
        ),
    ]
