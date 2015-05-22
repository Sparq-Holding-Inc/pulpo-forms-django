import json
from django.core.serializers.json import DjangoJSONEncoder
from django.db import models
from django.utils.translation import ugettext_lazy as _

# from south.modelsinspector import add_introspection_rules


# Form status constants
DRAFT = 0
PUBLISHED = 1
EXPIRED = 2
# These are the possible status for a form
STATUS = (
    (DRAFT, _("Draft")),
    (PUBLISHED, _("Published")),
    (EXPIRED, _("Expired")),
)

# add_introspection_rules([], ["^pulpo_forms.fields.JSONField"])


class JSONField(models.TextField):
    """
    JSONField is a generic textfield that neatly serializes/unserializes
    JSON objects seamlessly
    """
    # Used so to_python() is called
    __metaclass__ = models.SubfieldBase

    def to_python(self, value):
        """
        Convert our string value to JSON after we load it from the DB
        """
        if value == "":
            return ""

        try:
            if isinstance(value, str):
                return json.loads(value)
        except ValueError:
            pass

        return ""

    def get_db_prep_save(self, value, connection, prepared=False):
        """
        Convert our JSON object to a string before we save
        """

        if isinstance(value, dict):
            value = json.dumps(value, cls=DjangoJSONEncoder)

        return super(JSONField, self).get_db_prep_save(value, connection)


class Validations():
    """
    Class for validation objects of the versions json
    """
    max_len_text = models.IntegerField(blank=True)
    max_number = models.IntegerField(blank=True)
    min_number = models.IntegerField(blank=True)

    def valid_number(self):
        if ((self.max_number is not None)
                and (self.min_number is not None)):
            return self.max_number >= self.min_number
        return True

    def valid_text(self):
        if self.max_len_text is not None:
            return self.max_len_text > 0

    def __init__(self):
        self.max_len_text = None
        self.max_number = None
        self.min_number = None


class Option():
    label = models.CharField(blank=True, max_length=100)
    id = models.IntegerField(blank=True)


class Dependencies():
    fields = models.CommaSeparatedIntegerField(
        null=True, blank=True, max_length=300)
    pages = models.CommaSeparatedIntegerField(
        null=True, blank=True, max_length=300)


class Field_Data():
    text = models.CharField(null=True, blank=True, max_length=500)
    required = models.BooleanField()
    tooltip = models.CharField(blank=True, max_length=300)
    answer = models.CharField(blank=True, max_length=400)
    dependencies = Dependencies()
    validations = Validations()
    options = []
    max_id = models.IntegerField(blank=True)
    field_type = models.CharField(blank=True, max_length=30)
    field_id = models.IntegerField(blank=True)


class AfterSubmit(object):
    sendMail = models.BooleanField()
    action = models.CharField()
    mailSubject = models.CharField()
    mailText = models.CharField()
    mailSender = models.CharField()
    mailRecipient = models.CharField()
    message = models.CharField()
    redirect = models.CharField()

    def __init__(self, sendMail, action, mailSubject, mailText, mailSender,
                 mailRecipient, message, redirect):
        self.sendMail = sendMail
        self.action = action
        self.mailSubject = mailSubject
        self.mailText = mailText
        self.mailSender = mailSender
        self.mailRecipient = mailRecipient
        self.message = message
        self.redirect = redirect
