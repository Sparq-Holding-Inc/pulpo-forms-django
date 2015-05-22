import json

from pulpo_forms.models import Form, Version, FieldEntry
from pulpo_forms.fieldtypes.FieldFactory import FieldFactory as Factory


class StatisticsCtrl():

    def getStatistics(self, formId, versionNum, filters):
        """
        Receives a the id of a version (formId, versionNum),
        returns the statistics of each field on it
        """
        form = Form.objects.get(pk=formId)
        version = form.versions.get(number=versionNum)

        field_entries = Version.objects.get_entries(version.pk)
        for filter in filters:
            if filter['filter_type'] == "equals":
                field_entries = field_entries.data_iexact(
                    field_id=filter['field'], data=filter['field_value'])
            elif filter['filter_type'] == "contains":
                field_entries = field_entries.data_icontains(
                    field_id=filter['field'], data=filter['field_value'])
            elif filter['filter_type'] in ["gte", "gt", "lte", "lt"]:
                field_entries = field_entries.data_number(
                    field_id=filter['field'], data=int(filter['field_value']),
                    operator=filter['filter_type'])
        field_entries = field_entries.get_data()

        if field_entries:
            loaded = json.loads(version.json)
            pages = loaded["pages"]

            statistics = {}
            for page in pages:
                for field in page["fields"]:
                    data = []
                    for field_entry in field_entries:
                        if field_entry.field_id == field["field_id"]:
                            data.append(field_entry.answer)
                    field_type = Factory.get_class(field["field_type"])
                    field_statistics = field_type().get_statistics(data, field)
                    statistics[field["field_id"]] = field_statistics
        else:
            raise Exception("No entries found.")

        return statistics

    def getFieldStatistics(self, formId, versionNum, fieldId):
        """
        Returns statistics for specific field in form
        """
        # Get version
        form = Form.objects.get(pk=formId)
        version = form.versions.get(number=versionNum)

        field_entries = FieldEntry.objects.filter(
            entry__version_id=version.pk, field_id=fieldId)

        if field_entries:
            loaded = json.loads(version.json)
            pages = loaded["pages"]
            found = False
            # Indicates page number
            i = 0
            while not found:
                j = 0
                fields = pages[i]["fields"]
                while (not found) and (j != len(fields)):
                    if fields[j]["field_id"] == int(fieldId):
                        field = fields[j]
                        found = True
                    else:
                        j += 1
                i += 1

            data = []
            for field_entry in field_entries:
                data.append(field_entry.answer)
            field_type = Factory.get_class(field["field_type"])
            field_statistics = field_type().get_statistics(data, field)

            return field_statistics
        else:
            raise Exception("No entries found.")
