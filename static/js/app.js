'use strict';

(function () {
    /*
    * Module dynamicFormsFramework
    * This module encapsulates the logic that will handle the form.
    */
    var app = angular.module('dynamicFormsFrameworkAdmin', ['ui.sortable','ui.bootstrap',
                                                            'checklist-model','angularCharts',
                                                            'udpCaptcha', 'ngResource',
                                                            'growlNotifications'])
    .config(['$locationProvider', '$httpProvider', function ($locationProvider, $httpProvider) {

        $httpProvider.defaults.xsrfCookieName = 'csrftoken';
        $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';

    }]);

    app.config(['$resourceProvider', function($resourceProvider) {
       // Don't strip trailing slashes from calculated URLs
       $resourceProvider.defaults.stripTrailingSlashes = false;
    }]);

    app.run( function($rootScope){
        $rootScope.notificationIndex = 0;
        $rootScope.invalidNotification = false;
        $rootScope.notifications = {};

        $rootScope.add = function(notification){
          var i;
          if(!notification){
            $rootScope.invalidNotification = true;
            return;
          }
          i = $rootScope.notificationIndex++;
          $rootScope.invalidNotification = false;
          $rootScope.notifications[i] = notification;
        };
    })

    app.directive('ngConfirmClick', [function(){
        return {
            priority: -1,
            restrict: 'A',
            link: function(scope, element, attrs){
                element.bind('click', function(e){
                    var message = attrs.ngConfirmClick;
                    if(message && !confirm(message)){
                        e.stopImmediatePropagation();
                        e.preventDefault();
                    }
                });
            }
        }
    }]);

})();
