from rest_framework import serializers

class NumericStatisticsSerializer(serializers.Serializer):  
    """
    Serializer for NumericStatistics
    """
    mean = serializers.FloatField()
    standard_deviation = serializers.FloatField()
    total_mean = serializers.FloatField()
    total_filled = serializers.IntegerField()
    total_not_filled = serializers.IntegerField()
    total_standard_deviation = serializers.FloatField()
    quintilesY = serializers.CharField()
    quintilesX = serializers.CharField()
    
class ListStatisticsSerializer(serializers.Serializer):
    """
    Serializer for ListStatistics
    """
    options = serializers.CharField()
    total_per_option = serializers.CharField()
    total_filled = serializers.IntegerField()
    total_not_filled = serializers.IntegerField()
