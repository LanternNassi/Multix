# Generated by Django 3.1 on 2021-11-03 10:59

import datetime
from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('Business_Accounts', '0022_auto_20211103_1151'),
    ]

    operations = [
        migrations.AddField(
            model_name='notification',
            name='Date',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='business_account',
            name='Date_of_creation',
            field=models.DateTimeField(default=datetime.datetime(2021, 11, 3, 13, 58, 32, 811174)),
        ),
    ]
