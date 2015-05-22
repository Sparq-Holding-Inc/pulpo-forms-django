'use strict';

(function () {
    /*
    * Module dynamicFormsFramework
    * This module encapsulates the logic that will handle the form.
    */
    var app = angular.module('dynamicFormsFramework', ['ui.bootstrap','checklist-model', 'udpCaptcha','ngResource',
                                                        'angularFileUpload','survey-question'])
    .config(['$locationProvider','$httpProvider', function ($locationProvider, $httpProvider) {
        
        $locationProvider.html5Mode({
    		enabled: true,
    		requireBase: false
		});
        $httpProvider.defaults.xsrfCookieName = 'csrftoken';
		$httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';

    }]);

    app.config(['$resourceProvider', function($resourceProvider) {
       // Don't strip trailing slashes from calculated URLs
       $resourceProvider.defaults.stripTrailingSlashes = false;
    }]);

    /*
     * This directive checks custom javascript validations defined for each field.
     */
    app.directive('validate', function() {
        return {
            require: 'ngModel',
            link: function(scope, elm, attrs, ctrl) {
                ctrl.$validators.validate = function(modelValue, viewValue) {
                    if (ctrl.$isEmpty(modelValue)) {
                        // Consider empty models to be valid
                        return true;
                    }
                    var validator = validatorFactory.getValidator(attrs.fieldtype);
                    if (validator){
                        if (validator.validate(viewValue, attrs)) {
                            return true;
                        }
                        return false;
                    } else {
                        return true;
                    }
                };
            }
        };
    });

})();
