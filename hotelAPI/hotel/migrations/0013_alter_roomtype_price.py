# Generated by Django 5.0.6 on 2024-07-27 10:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('hotel', '0012_remove_bill_summary'),
    ]

    operations = [
        migrations.AlterField(
            model_name='roomtype',
            name='price',
            field=models.FloatField(),
        ),
    ]
