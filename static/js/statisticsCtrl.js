'use strict';


(function () {

    var app = angular.module('dynamicFormsFrameworkAdmin');

    /*
     * This controller handles the retrival of data to create the form statistics
     */
    app.controller('statisticsCtrl', function ($scope, $rootScope, $location, $window, $filter, StatisticsService) {

        var separator = '/';
        var stat = this;
    	stat.formId = ($location.search()).form;
        stat.versionNumber = ($location.search()).ver;
        stat.versionNumber = ($location.search()).ver;
        stat.versionNumber = ($location.search()).ver;
        stat.versionNumber = ($location.search()).ver;
        stat.json = '';

        $scope.filters = [
            {
                "field": '',
                "type": '',
                "value": '',
            }
        ];

        $scope.number_operators = [
            {"short": "lt", "label": "less than"},
            {"short": "lte", "label": "less than or equal to"},
            {"short": "equals", "label": "equals"},
            {"short": "gt", "label": "greater than"},
            {"short": "gte", "label": "greater than or equal to"},
        ];

        $scope.field_options = [];

        stat.config = {
            title: '',
            tooltips: true,
            labels: false,
            mouseover: function() {},
            mouseout: function() {},
            click: function() {},
            legend: {
                display: true,
                // Could be 'left, right'
                position: 'right'
            }
        };

        stat.data = {
            series: [],
            data: [{
                x: '',
                y: []
            }]
        };

        stat.values = {};
        stat.filter_id = '';
        stat.filter_type = '';
        stat.filter_value = '';
        stat.path = '';

        $scope.removeFilter = function(index){
            $scope.filters.splice(index, 1)
        }

        $scope.addFilter = function(){
            $scope.filters.push({
                "field": '',
                "type": '',
                "value": '',
            })
        }

        stat.getStatistics = function(){
            var fields = '';
            var types = '';
            var values = '';
            var parsed;
            for (var i = 0; i < $scope.filters.length; i++) {
                if ($scope.filters[i].field != '' &&
                        $scope.filters[i].type != '' &&
                        $scope.filters[i].value != '') {
                    if (stat.values[$scope.filters[i].field].field_type == "CheckboxField" ||
                            stat.values[$scope.filters[i].field].field_type == "SelectField"){
                        parsed = parseInt($scope.filters[i].value) + 1;
                    } else {
                        parsed = $scope.filters[i].value;
                    }
                    fields += $scope.filters[i].field + ',';
                    types += $scope.filters[i].type + ',';
                    values += parsed + ',';
                }
            };
            // Remove last ','
            if (fields != ''){
                fields = fields.substring(0, fields.length - 1);
                types = types.substring(0, types.length - 1);
                values = values.substring(0, values.length - 1);
                params = {formId:stat.formId, versionId: stat.versionNumber,
                    fields: fields, types: types, values: values}
            } else {
                params = {formId:stat.formId, versionId: stat.versionNumber}
            };
            StatisticsService.get(params,
                function(stats){
                    stat.json = JSON.parse(JSON.stringify(stats));
                    for(var field_id in stat.json){
                        var field = $.extend({}, stat.json[field_id]);
                        if (field.field_type == 'NumberField'){
                            field.quintilesX = eval(field.quintilesX);
                            field.quintilesY = eval(field.quintilesY);
                            var conf = angular.copy(stat.config);
                            conf.title = field.field_text;
                            var d = angular.copy(stat.data);
                            for(var i = 0; i < 5; i++){
                                d.data[i] = {
                                    'x': field.quintilesX[i],
                                    'y': [field.quintilesY[i]]
                                };
                            }
                            stat.values[field_id] = {
                                'id': field_id,
                                'chart': 'pie',
                                'field_type': 'NumberField',
                                'conf': conf,
                                'data': d,
                                'm' : field.mean,
                                'mt' : field.total_mean,
                                'sd' : field.standard_deviation,
                                'sdt' : field.total_standard_deviation,
                                'tf' : field.total_filled,
                                'tnf': field.total_not_filled,
                                'req': field.required,
                                'type': 'Number'
                            };
                        } else if (field.field_type == 'SelectField'){
                            field.total_per_option = eval(field.total_per_option);
                            field.options = eval(field.options);
                            var conf = angular.copy(stat.config);
                            conf.title = field.field_text;
                            var d = angular.copy(stat.data);
                            for(var i = 0; i < field.total_per_option.length; i++){
                                d.data[i] = {
                                    'x': field.options[i],
                                    'y': [field.total_per_option[i]]
                                };
                            }
                            stat.values[field_id] = {
                                'id': field_id,
                                'chart': 'pie',
                                'field_type': 'SelectField',
                                'conf': conf,
                                'data': d,
                                'tf' : field.total_filled,
                                'tnf': field.total_not_filled,
                                'req': field.required,
                                'type': 'Combobox'
                            };
                            $scope.field_options[field_id] = field.options;
                        } else if (field.field_type == 'CheckboxField'){
                            field.total_per_option = eval(field.total_per_option);
                            field.options = eval(field.options);
                            var conf = angular.copy(stat.config);
                            conf.title = field.field_text;
                            var d = angular.copy(stat.data);
                            for(var i = 0; i < field.total_per_option.length; i++){
                                d.data[i] = {
                                    'x': field.options[i],
                                    'y': [field.total_per_option[i]]
                                };
                            }
                            stat.values[field_id] = {
                                'id': field_id,
                                'chart': 'pie',
                                'field_type': 'CheckboxField',
                                'conf': conf,
                                'data': d,
                                'tf' : field.total_filled,
                                'tnf': field.total_not_filled,
                                'req': field.required,
                                'type': 'Checkbox'
                            };
                            $scope.field_options[field_id] = field.options;
                        }
                    }
            }, function(error){
                $rootScope.add("Error loading statistics: " + error.data);
            });
        };

        stat.getStatistics();

        stat.Discard = function(){
            $scope.filters = [
                {
                    "field": '',
                    "type": '',
                    "value": '',
                }
            ];
            stat.getStatistics();
        };

        
        $scope.chart_types = [
            'pie',
            'bar',
        ];

    });
})();
