from statistics import mean, pstdev
import math

from pulpo_forms.statistics.serializers import NumericStatisticsSerializer


class NumericStatistics():
    """
    Class with the statistics info of a number  field
    """

    def __init__(self, data_list):
        # Null values are counted as 0
        list_total = []
        # Without null values
        list = []
        self.total_filled = 0
        self.total_not_filled = 0
        self.quintilesX = []
        self.quintilesY = []

        for data in data_list:
            if data != "":
                list_total.append(int(data))
                list.append(int(data))
                self.total_filled += 1
            else:
                list_total.append(0)
                self.total_not_filled += 1

        if list != []:
            self.mean = round(mean(list), 2)
            self.standard_deviation = round(pstdev(list, self.mean), 2)
            minimum = min(list)
            maximum = max(list)

            quintile_length = math.floor((maximum - minimum + 1) / 5)
            # First 4 quintiles
            first = minimum
            for i in range(1, 5):
                second = first + quintile_length
                quintile_x = "[" + str(first) + ", " + str(second) + ")"
                self.quintilesX.append(quintile_x)
                quintile_y = 0
                for num in list:
                    if (first <= num) and (num < second):
                        quintile_y += 1
                self.quintilesY.append(quintile_y)
                first = second
            # Last quintile
            self.quintilesX.append(
                "[" + str(first) + ", " + str(maximum) + "]")
            quintile_y = 0
            for num in list:
                if (first <= num) and (num <= maximum):
                    quintile_y += 1
            self.quintilesY.append(quintile_y)
        else:
            self.mean = 0
            self.standard_deviation = 0
        self.total_mean = round(mean(list_total), 2)
        self.total_standard_deviation = round(
            pstdev(list_total, self.total_mean), 2)


    def getSerializedData(self):
        return NumericStatisticsSerializer(self).data
