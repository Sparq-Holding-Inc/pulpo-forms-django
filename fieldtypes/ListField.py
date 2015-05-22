from django.core.exceptions import ValidationError

from pulpo_forms.fieldtypes.Field import Field
from pulpo_forms.statistics.ListStatistics import ListStatistics


class ListField(Field):
    """
    List field validator, render and analize methods
    """

    def get_methods(self, **kwargs):
        base = super(ListField, self).get_methods(**kwargs)
        base.append(self.belong_check)
        return base

    def belong_check(self, value, **kwargs):
        v = int(value)
        opt = kwargs['options']
        l = []
        for o in opt:
            l.append(o['id'])
        if v not in l:
            raise ValidationError("Invalid value, not among options.")

    def check_consistency(self, field):
        options = field.options
        if (options == []):
            raise ValidationError("List fields need at least one option.")

    def get_option_labels(self, field):
        return field["options"]

    def get_statistics(self, data_list, field):
        options = self.get_option_labels(field)
        list_statistics = ListStatistics(data_list, options)
        statistics = super(ListField, self).get_statistics(data_list, field)
        statistics.update(list_statistics.getSerializedData())
        return statistics

    def get_options(self, json, f_id):
        for page in json['pages']:
            for field in page['fields']:
                if (field['field_id'] == f_id):
                    return field['options']

    class Meta:
        abstract = True
