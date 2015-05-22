from pulpo_forms.statistics.serializers import ListStatisticsSerializer


class ListStatistics():
    """
    Class with the statistics info of a number field
    """

    def __init__(self, data_list, options):
        self.total_per_option = []
        self.options = []
        self.total_filled = 0
        self.total_not_filled = 0
        # Initiate lists
        for option in options:
            self.total_per_option.append(0)
            self.options.append(option["label"])
        # Count and remove null values from data list and count not null values
        aux_list = []
        for data in data_list:
            if data != "":
                aux_list.append(data)
                self.total_filled += 1
            else:
                self.total_not_filled += 1

        total_options = len(options)
        for data in aux_list:
            pos = 0
            while (pos != total_options) and (int(data) != options[pos]["id"]):
                pos += 1
            if pos != total_options:
                self.total_per_option[pos] += 1
            else:
                raise Exception("Data does not match with any field option.")

    def getSerializedData(self):
        return ListStatisticsSerializer(self).data
