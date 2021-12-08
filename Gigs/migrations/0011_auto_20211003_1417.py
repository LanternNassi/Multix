# Generated by Django 3.1 on 2021-10-03 21:17

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Gigs', '0010_auto_20211003_1417'),
    ]

    operations = [
        migrations.AlterField(
            model_name='gig',
            name='Gig_date_of_creation',
            field=models.DateTimeField(default=datetime.datetime(2021, 10, 3, 14, 17, 38, 840373), verbose_name=' Dates '),
        ),
        migrations.AlterField(
            model_name='gig',
            name='Gig_deadline',
            field=models.DateField(default=datetime.datetime(2021, 10, 3, 14, 17, 38, 840373), null=True, verbose_name='Deadlines'),
        ),
        migrations.AlterField(
            model_name='gig',
            name='Gig_expiration_date',
            field=models.DateTimeField(blank=True, default=datetime.datetime(2021, 10, 3, 14, 17, 38, 840373), null=True, verbose_name='Gig Expirations'),
        ),
    ]