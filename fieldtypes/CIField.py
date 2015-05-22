from django.core.exceptions import ValidationError

from pulpo_forms.fieldtypes import Field
from pulpo_forms.fieldtypes import FieldFactory


class CIField(Field.Field):
    """
    CI field type class
    """
    template_name = "identity_doc/template.html"
    edit_template_name = "identity_doc/template_edit.html"
    prp_template_name = "identity_doc/properties.html"

    def check_id(self, value, **kwargs):
        digits = [int(i) for i in value]
        # If value has less than 8 digits, we complete with zeros on the left
        if len(digits) < 8:
            diff = 8 - len(digits)
            for x in range(0, diff):
                digits.insert(0, 0)

        const = [2, 9, 8, 7, 6, 3, 4]
        value = 0
        for x in range(0, 7):
            value += digits[x] * const[x]
        m = value % 10
        if ((10 - m) % 10) != digits[len(digits) - 1]:
            raise ValidationError('Enter a valid ID.', code='invalid')

    def get_methods(self, **kwargs):
        # Default validation or pass
        base = super(CIField, self).get_methods(**kwargs)
        base.extend([self.int_check, self.check_id])
        return base

    def int_check(self, value, **kwargs):
        try:
            int(value)
        except (ValueError, TypeError):
            raise ValidationError('Enter a valid integer.', code='invalid')

    def get_assets():
        return ['js/fields/CIField.js']

    def get_styles():
        return ['css/fields/CIField.css']

    def __str__(self):
        return "Cedula"


FieldFactory.FieldFactory.register('CIField', CIField)
