# Generated by Django 3.1 on 2021-10-23 14:08

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Business_Accounts', '0015_auto_20211022_2302'),
    ]

    operations = [
        migrations.AlterField(
            model_name='business_account',
            name='Date_of_creation',
            field=models.DateTimeField(default=datetime.datetime(2021, 10, 23, 17, 8, 1, 554763)),
        ),
    ]
