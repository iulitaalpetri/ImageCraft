# Generated by Django 5.0 on 2023-12-13 00:31

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('detected_face', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Person',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('image', models.ImageField(upload_to='images/persons/')),
                ('detected_faces', models.ManyToManyField(blank=True, to='detected_face.detectedface')),
            ],
        ),
    ]
