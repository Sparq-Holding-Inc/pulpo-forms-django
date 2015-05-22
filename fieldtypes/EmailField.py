from django.core.exceptions import ValidationError
from django.core.validators import validate_email

from pulpo_forms.fieldtypes import TextField
from pulpo_forms.fieldtypes import FieldFactory


class EmailField(TextField.TextField):
    """
    Email validator using django's validation
    """
    template_name = "email/template.html"
    edit_template_name = "email/template_edit.html"
    prp_template_name = "email/properties.html"

    def mail_check(self, value, **kwargs):
        try:
            validate_email(value)
        except ValidationError as e:
            # Transform the message to be cathed later.
            raise ValidationError(e.__str__())

    def get_methods(self, **kwargs):
        base = super(EmailField, self).get_methods(**kwargs)
        base.append(self.mail_check)
        return base

    def get_assets():
        return ['js/fields/EmailField.js']

    def get_styles():
        return ['css/fields/EmailField.css']

    def __str__(self):
        return "Email"

FieldFactory.FieldFactory.register('EmailField', EmailField)
