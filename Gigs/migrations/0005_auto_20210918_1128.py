# Generated by Django 3.1 on 2021-09-18 18:28

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Gigs', '0004_auto_20210918_1122'),
    ]

    operations = [
        migrations.AlterField(
            model_name='gig',
            name='Gig_date_of_creation',
            field=models.DateTimeField(default=datetime.datetime(2021, 9, 18, 11, 28, 50, 741611), verbose_name=' Dates '),
        ),
        migrations.AlterField(
            model_name='gig',
            name='Gig_deadline',
            field=models.DateField(null=True, verbose_name='Deadlines'),
        ),
    ]