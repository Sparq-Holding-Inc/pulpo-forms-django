from pulpo_forms.fieldtypes.ListField import ListField
from pulpo_forms.fieldtypes import FieldFactory


class SelectField(ListField):
    """
    Combobox field validator, render and analize methods
    """
    template_name = "combobox/template.html"
    edit_template_name = "combobox/template_edit.html"
    prp_template_name = "combobox/properties.html"
    sts_template_name = "combobox/template_statistic.html"

    def get_assets():
        return ['js/fields/SelectField.js', 'js/operators/operatorList.js']

    def get_styles():
        return ['css/fields/SelectField.css']

    def __str__(self):
        return "Combo Box"


FieldFactory.FieldFactory.register('SelectField', SelectField)
