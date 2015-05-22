
from django.core.exceptions import ValidationError
from django.core.exceptions import ObjectDoesNotExist

from pulpo_forms.fieldtypes.Field import Field


class ModelField(Field):
    """
    Model field validator, render and analize methods
    """
    model = None
    name = "object"
    template_name = "modelField/template.html"
    edit_template_name = "modelField/template_edit.html"
    sts_template_name = "modelField/template_statistic.html"

    def get_methods(self, **kwargs):
        base = super(ModelField, self).get_methods(**kwargs)
        base.append(self.belong_check)
        return base

    def belong_check(self, value, **kwargs):
        v = int(value)
        if (self.model is None):
            raise ValidationError("Invalid model.")
        try:
            obj = self.model.objects.get(pk=v)
        except ObjectDoesNotExist:
            raise ValidationError("That %s does not exist." % self.name)

    def find_options(self):
        l = []
        options = self.model.objects.all()
        if (options == []):
            raise ValidationError("This model has no items.")
        for o in options:
            l.append({'id': o.pk, 'label': o.__str__()})
        return l

    def get_options(self, json, f_id):
        return self.find_options()

    class Meta:
        abstract = True
