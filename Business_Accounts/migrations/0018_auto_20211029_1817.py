# Generated by Django 3.1 on 2021-10-29 15:17

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Business_Accounts', '0017_auto_20211029_1328'),
    ]

    operations = [
        migrations.AlterField(
            model_name='business_account',
            name='Date_of_creation',
            field=models.DateTimeField(default=datetime.datetime(2021, 10, 29, 18, 17, 7, 41294)),
        ),
    ]
