# Generated by Django 3.1 on 2021-11-03 08:25

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Business_Accounts', '0020_auto_20211103_1115'),
    ]

    operations = [
        migrations.AlterField(
            model_name='business_account',
            name='Date_of_creation',
            field=models.DateTimeField(default=datetime.datetime(2021, 11, 3, 11, 25, 33, 386142)),
        ),
    ]