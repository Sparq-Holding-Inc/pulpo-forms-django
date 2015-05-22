from django.core.exceptions import ValidationError


class FieldFactory():
    """
    Factory
    """
    fields = {}

    def get_class(id):
        return FieldFactory.fields[id]

    def get_all_classes():
        return FieldFactory.fields.values()

    def register(id, type):
        if id not in FieldFactory.fields:
            FieldFactory.fields[id] = type
        else:
            raise ValidationError("invalid ID.")

    def get_strings():
        l = {}
        for key in FieldFactory.fields:
            l[key] = FieldFactory.fields[key]().__str__()
        return l
