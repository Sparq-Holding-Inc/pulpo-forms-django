# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings
import pulpo_forms.fields


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='FieldEntry',
            fields=[
                ('id', models.AutoField(verbose_name='ID', primary_key=True, serialize=False, auto_created=True)),
                ('field_id', models.IntegerField()),
                ('field_type', models.CharField(max_length=100)),
                ('text', models.CharField(max_length=200)),
                ('required', models.BooleanField()),
                ('shown', models.BooleanField(default=True)),
                ('answer', models.CharField(blank=True, null=True, max_length=400)),
            ],
        ),
        migrations.CreateModel(
            name='FileEntry',
            fields=[
                ('id', models.AutoField(verbose_name='ID', primary_key=True, serialize=False, auto_created=True)),
                ('field_id', models.IntegerField()),
                ('file_type', models.CharField(max_length=50)),
                ('file_name', models.CharField(max_length=50)),
                ('file_data', models.FileField(upload_to='doc')),
                ('field_entry', models.ForeignKey(related_name='files', blank=True, null=True, to='pulpo_forms.FieldEntry')),
            ],
        ),
        migrations.CreateModel(
            name='Form',
            fields=[
                ('id', models.AutoField(verbose_name='ID', primary_key=True, serialize=False, auto_created=True)),
                ('title', models.CharField(max_length=100)),
                ('slug', models.SlugField(unique=True)),
                ('owner', models.ForeignKey(related_name='forms', blank=True, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ('title',),
            },
        ),
        migrations.CreateModel(
            name='FormEntry',
            fields=[
                ('id', models.AutoField(verbose_name='ID', primary_key=True, serialize=False, auto_created=True)),
                ('entry_time', models.DateTimeField(blank=True)),
            ],
        ),
        migrations.CreateModel(
            name='Version',
            fields=[
                ('id', models.AutoField(verbose_name='ID', primary_key=True, serialize=False, auto_created=True)),
                ('number', models.IntegerField(default=1)),
                ('json', pulpo_forms.fields.JSONField(blank=True, default='')),
                ('status', models.IntegerField(choices=[(0, 'Draft'), (1, 'Published'), (2, 'Expired')], default=0)),
                ('publish_date', models.DateTimeField(blank=True, null=True)),
                ('expiry_date', models.DateTimeField(blank=True, null=True)),
                ('captcha', models.BooleanField(default=False)),
                ('form', models.ForeignKey(to='pulpo_forms.Form', related_name='versions')),
            ],
        ),
        migrations.AddField(
            model_name='formentry',
            name='version',
            field=models.ForeignKey(to='pulpo_forms.Version', related_name='entries'),
        ),
        migrations.AddField(
            model_name='fieldentry',
            name='entry',
            field=models.ForeignKey(related_name='fields', blank=True, null=True, to='pulpo_forms.FormEntry'),
        ),
    ]
