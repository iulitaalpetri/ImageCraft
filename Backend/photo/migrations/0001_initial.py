# Generated by Django 5.0.4 on 2024-05-09 14:36

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('detected_face', '0001_initial'),
        ('detected_object', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Photo',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(upload_to='images/photos/')),
                ('date', models.DateTimeField(auto_now_add=True)),
                ('cats', models.BooleanField(default=False)),
                ('dogs', models.BooleanField(default=False)),
                ('detected_faces', models.ManyToManyField(blank=True, to='detected_face.detectedface')),
                ('detected_objects', models.ManyToManyField(blank=True, to='detected_object.detectedobject')),
            ],
        ),
    ]
