# Generated by Django 3.1 on 2021-11-03 08:15

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Business_Accounts', '0019_auto_20211101_1948'),
    ]

    operations = [
        migrations.AddField(
            model_name='notification',
            name='notify_id',
            field=models.CharField(default=1, max_length=20),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='business_account',
            name='Date_of_creation',
            field=models.DateTimeField(default=datetime.datetime(2021, 11, 3, 11, 14, 32, 203488)),
        ),
    ]
