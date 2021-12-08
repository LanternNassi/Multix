# Generated by Django 3.1 on 2021-09-18 18:37

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Gigs', '0007_auto_20210918_1129'),
    ]

    operations = [
        migrations.AlterField(
            model_name='gig',
            name='Gig_date_of_creation',
            field=models.DateTimeField(default=datetime.datetime(2021, 9, 18, 11, 36, 58, 714037), verbose_name=' Dates '),
        ),
        migrations.AlterField(
            model_name='gig',
            name='Gig_deadline',
            field=models.DateField(default=datetime.datetime(2021, 9, 18, 11, 36, 58, 714037), null=True, verbose_name='Deadlines'),
        ),
        migrations.AlterField(
            model_name='gig',
            name='Gig_expiration_date',
            field=models.DateTimeField(blank=True, verbose_name='Gig Expirations'),
        ),
    ]