# Generated by Django 3.1 on 2021-09-17 21:27

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Business_Accounts', '0002_auto_20210917_1000'),
    ]

    operations = [
        migrations.AlterField(
            model_name='business_account',
            name='Date_of_creation',
            field=models.DateTimeField(default=datetime.datetime(2021, 9, 17, 14, 27, 16, 720906)),
        ),
        migrations.AlterField(
            model_name='business_account',
            name='Multix_token',
            field=models.CharField(max_length=100, verbose_name='Multix ids'),
        ),
    ]