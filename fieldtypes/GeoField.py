from django.core.exceptions import ValidationError

from pulpo_forms.fieldtypes import Field
from pulpo_forms.fieldtypes import FieldFactory


class GeoField(Field.Field):
    """
    GeoField
    """
    template_name = "geolocation/template.html"
    edit_template_name = "geolocation/template_edit.html"
    prp_template_name = "geolocation/properties.html"

    def geo_check(self, value, **kwargs):
        try:
            v = value.split('#')
            lat = float(v[0])
            if not (lat >= -90 and lat <= 90):
                raise ValidationError("Invalid latitude coordinate.")
            lon = float(v[1])
            if not (lon >= -180 and lon <= 180):
                    raise ValidationError("Invalid longitude coordinates.")

        except ValidationError as e:
            # Transform the message to be cathed later.
            raise ValidationError(e.__str__())

    def get_methods(self, **kwargs):
        base = super(GeoField, self).get_methods(**kwargs)
        base.append(self.geo_check)
        return base

    def get_assets():
        return ['js/fields/GeoField.js']

    def get_non_static():
        return ['https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false']

    def get_styles():
        return ['css/fields/GeoField.css']

    def __str__(self):
        return "GeoLocation"

FieldFactory.FieldFactory.register('GeoField', GeoField)
