# Generated by Django 3.1 on 2021-11-07 18:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Gigs', '0020_auto_20211103_1359'),
    ]

    operations = [
        migrations.AlterField(
            model_name='gig_applicant',
            name='Approved',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='gig_project_completed',
            name='Approved',
            field=models.BooleanField(default=False),
        ),
    ]
