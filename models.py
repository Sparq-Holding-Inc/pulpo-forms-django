import json
import logging
from datetime import datetime
from django.core.exceptions import ValidationError, ObjectDoesNotExist
from django.db import models
from django.template.defaultfilters import slugify
from django.core.mail import send_mail
from django.dispatch import receiver
from django.db.models.signals import post_save

# from cms.models.pluginmodel import CMSPlugin

from pulpo_forms.fields import JSONField, STATUS, DRAFT, PUBLISHED, EXPIRED
from pulpo_forms.JSONSerializers import AfterSubmitSerializer


logger = logging.getLogger(__name__)


class FormEntryQuerySet(models.query.QuerySet):
    """
    QuerySet for FormEntry model
    """

    def data_icontains(self, field_id, data, exclude=False):
        entries = set()
        for entry in self:
            fields = entry.fields.filter(field_id=field_id)
            if (data not in fields.first().answer.split('#')):
                fields = FormEntry.objects.none()
            if exclude:
                if fields.count() == 0:
                    entries.add(entry.pk)
            else:
                if fields.count() > 0:
                    entries.add(entry.pk)
        return FormEntry.objects.filter(pk__in=entries)

    def data_iexact(self, field_id, data, exclude=False):
        entries = set()
        for entry in self:
            fields = entry.fields.filter(
                field_id=field_id, answer__iexact=data)
            if exclude:
                if fields.count() == 0:
                    entries.add(entry.pk)
            else:
                if fields.count() > 0:
                    entries.add(entry.pk)
        return FormEntry.objects.filter(pk__in=entries)

    def data_number(self, field_id, data, operator, exclude=False):
        entries = set()
        for entry in self:
            if operator == 'gt':
                fields = entry.fields.filter(field_id=field_id)
                if not (int(fields.first().answer) > data):
                    fields = FormEntry.objects.none()
            elif operator == 'gte':
                fields = entry.fields.filter(field_id=field_id)
                if not (int(fields.first().answer) >= data):
                    fields = FormEntry.objects.none()
            elif operator == 'lt':
                fields = entry.fields.filter(field_id=field_id)
                if not (int(fields.first().answer) < data):
                    fields = FormEntry.objects.none()
            elif operator == 'lte':
                fields = entry.fields.filter(field_id=field_id)
                if not (int(fields.first().answer) <= data):
                    fields = FormEntry.objects.none()
            elif operator == 'eq':
                fields = entry.fields.filter(field_id=field_id)
                if not (int(fields.first().answer) == data):
                    fields = FormEntry.objects.none()
            if exclude:
                if fields.count() == 0:
                    entries.add(entry.pk)
            else:
                if fields.count() > 0:
                    entries.add(entry.pk)
        return FormEntry.objects.filter(pk__in=entries)

    def get_data(self):
        data = []
        for entry in self:
            fields = entry.fields.all()
            for field in fields:
                data.append(field)
        return data


class FormEntryManager(models.Manager):
    """
    Manager for FormEntry model
    """

    def get_queryset(self):
        return FormEntryQuerySet(self.model, using=self._db)


class VersionManager(models.Manager):
    """
    Manager for Version model
    """

    def get_entries(self, version):
        return self.get(pk=version).entries.all()


class Form(models.Model):
    """
    Forms of the app.
    """
    title = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    owner = models.ForeignKey('auth.User', related_name='forms', blank=True)

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        """
        Check if the slug is unique before saving a form.
        If there such a slug it checks if it is the same form.
        Throws ValidationError if the slug already exists.
        """
        self.slug = slugify(self.title)
        if Form.objects.filter(slug=self.slug).exists():
            # If it is an update it will enter here
            # Or if I try to create a new form with an conflicting slug
            f1 = Form.objects.get(slug=self.slug)
            if (self.pk != f1.pk):
                raise ValidationError("Slug already exists. \
                    Choose another title.")
        super(Form, self).save(*args, **kwargs)

    class Meta:
        ordering = ('title',)


class Version(models.Model):
    number = models.IntegerField(default=1)
    json = JSONField(default="", blank=True)
    status = models.IntegerField(choices=STATUS, default=DRAFT)
    publish_date = models.DateTimeField(blank=True, null=True)
    expiry_date = models.DateTimeField(blank=True, null=True)
    form = models.ForeignKey("Form", related_name="versions")
    captcha = models.BooleanField(default=False)

    objects = VersionManager()

    def __str__(self):
        return str(self.number)

    def save(self, *args, **kwargs):
        # If (self.number < 1):
        # raise ValidationError("Version cannot be below 1.")
        if Version.objects.filter(pk=self.pk).exists():
            # When it's an update of an existing version
            pass
        else:
            # When it's a POST of a new Version
            # if it is a new version of an existing form
            # check if there is no previous draft and
            # check that there exists a version less than the current
            all_versions = self.form.versions.all()
            count = all_versions.count()
            if (count > 0):
                # If it is the first version do not check any of these
                if not all_versions.filter(number=count).exists():
                    # We consider all the previous versions have to exist.
                    # There would be a severe problem if the admin
                    # touches the database to delete a old version.
                    raise ValidationError("Oops. There is a problem with the \
                        version numbers. The previous version does not exist.")
                if (all_versions.get(number=count).status == DRAFT):
                    raise ValidationError("There is a previous draft \
                        pending for this Form")
                self.number = all_versions.count() + 1
            else:
                self.number = 1
        if ((self.status == PUBLISHED) and
                (self.publish_date is None or self.publish_date == '')):
            self.publish_date = datetime.now()
            # If there is a previous published version,
            # its status is changed to expired.
            prev_versions = self.form.versions.filter(status=PUBLISHED)
            if len(prev_versions) > 0:
                # We assume there can only be one published version at any time
                prev = prev_versions.first()
                prev.status = EXPIRED
                prev.expiry_date = datetime.now()
                super(Version, prev).save()
        elif (self.status == EXPIRED):
            try:
                old = Version.objects.get(pk=self.pk)
            except ObjectDoesNotExist:
                raise ValidationError('You cannot close a new form')
            if (old.status != PUBLISHED):
                raise ValidationError('Only published forms can be closed.')
        elif (self.publish_date is not None and self.publish_date != ''):
            raise ValidationError('You cannot edit a published form')
        super(Version, self).save(*args, **kwargs)

    def get_logic(self):
        loaded = json.loads(self.json)
        return loaded['logic']

    def get_pages(self):
        loaded = json.loads(self.json)
        return loaded['pages']


class FormEntry(models.Model):
    version = models.ForeignKey("Version", related_name="entries")
    entry_time = models.DateTimeField(blank=True)

    objects = FormEntryManager()


class FieldEntry(models.Model):
    field_id = models.IntegerField()
    field_type = models.CharField(max_length=100)
    text = models.CharField(max_length=200)
    required = models.BooleanField()
    shown = models.BooleanField(default=True)
    answer = models.CharField(max_length=400, blank=True, null=True)
    entry = models.ForeignKey(
        "FormEntry", related_name="fields", blank=True, null=True)

    def __str__(self):
        return '[%s,%s,%s] %s : %s' % (
            self.field_type,
            self.field_id.__str__(),
            self.pk.__str__(),
            self.text,
            self.answer)


# class Survey(CMSPlugin):
#     form = models.ForeignKey(
#         Form, related_name='plugins',
#         limit_choices_to={'versions__status__exact': PUBLISHED})
#     slug = models.SlugField(max_length=100, blank=True)

#     def save(self, *args, **kwargs):
#         self.slug = self.form.slug
#         super(Survey, self).save(*args, **kwargs)

#     def __str__(self):
#         return self.slug


@receiver(post_save, sender=Form)
def form_handler(sender, **kwargs):
    if kwargs['created']:
        logger.info(
            "Form has been created with slug '{slug}'".format(
                slug=kwargs['instance'].slug))
    else:
        logger.info("Form has been saved with slug '{slug}'".format(
            slug=kwargs['instance'].slug))


@receiver(post_save, sender=Version)
def version_handler(sender, **kwargs):
    msg = "Version {version} of Form '{slug}'".format(
        version=kwargs['instance'].number.__str__(),
        slug=kwargs['instance'].form.slug)
    if kwargs['instance'].status == DRAFT and kwargs['created']:
        logger.info(msg + " has been created.")
    if kwargs['instance'].status == DRAFT:
        logger.info(msg + " has been saved.")
    elif kwargs['instance'].status == PUBLISHED:
        logger.info(msg + " has been published.")
    elif kwargs['instance'].status == EXPIRED:
        logger.info(msg + " has expired.")


@receiver(post_save, sender=FormEntry)
def notification_mail(sender, **kwargs):
    instance = kwargs.get('instance')
    js = json.loads(instance.version.json)
    serializer = AfterSubmitSerializer(data=js['after_submit'])
    if serializer.is_valid():
        d = serializer.initial_data
        if d['sendMail']:
            content = d['mailText']
            subject = d['mailSubject']
            sender = d['mailSender']
            recipient = d['mailRecipient']
            try:
                send_mail(
                    subject, content, sender, [recipient], fail_silently=False)
                logger.info("Mail has been sent to '{recipient}' after \
                    completing Version {version} of Form '{slug}'".format(
                            recipient=d['mailRecipient'],
                            version=str(kwargs['instance'].version.number),
                            slug=kwargs['instance'].version.form.slug))
            except Exception as e:
                logger.error("Error sending mail: '{error}' after completing \
                    Version {version} of Form '{slug}'".format(
                    error=e.__str__(),
                    version=str(kwargs['instance'].version.number),
                    slug=kwargs['instance'].version.form.slug))


class FileEntry(models.Model):
    field_id = models.IntegerField()
    file_type = models.CharField(max_length=50)
    file_name = models.CharField(max_length=50)
    file_data = models.FileField(upload_to='doc')
    field_entry = models.ForeignKey(
        "FieldEntry", related_name="files", blank=True, null=True)
