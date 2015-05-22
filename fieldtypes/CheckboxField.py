from django.core.exceptions import ValidationError

from pulpo_forms.fieldtypes.ListField import ListField
from pulpo_forms.fieldtypes import FieldFactory
from pulpo_forms.statistics.CheckboxStatistics import CheckboxStatistics


class CheckboxField(ListField):
    """
    Checkbox field validator, render and analize methods
    """
    template_name = "checkbox/template.html"
    edit_template_name = "checkbox/template_edit.html"
    prp_template_name = "checkbox/properties.html"
    sts_template_name = "checkbox/template_statistic.html"

    def get_statistics(self, data_list, field):
        checkbox_statistics = CheckboxStatistics(data_list, field["options"])
        statistics = checkbox_statistics.getSerializedData()
        statistics["field_text"] = field["text"]
        statistics["field_type"] = field["field_type"]
        if field["required"]:
            statistics["required"] = "Yes"
        else:
            statistics["required"] = "No"
        return statistics

    def belong_check(self, value, **kwargs):
        opt = kwargs['options']
        l = []
        for o in opt:
            l.append(o['id'])
        for v in value.split('#'):
            v = int(v)
            if v not in l:
                raise ValidationError("Invalid value, not among options.")

    def get_assets():
        return [
            'js/fields/CheckboxField.js',
            'js/operators/operatorList.js',
            'js/operators/operatorChecks.js'
        ]

    def get_styles():
        return ['css/fields/CheckboxField.css']

    def __str__(self):
        return "Checkbox"


FieldFactory.FieldFactory.register('CheckboxField', CheckboxField)
