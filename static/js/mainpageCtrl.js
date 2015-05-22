'use strict';

(function () {
	
    var app = angular.module('dynamicFormsFrameworkAdmin');
    
    /*
     * This controller handles the logic to display the list of forms
     */
    app.controller('MainPageCtrl', ['$scope','$http','$location',
            function ($scope, $http, $location) {

    	var mainPage = this;
        mainPage.formSlugParam = ($location.search()).form;
        mainPage.versionIdParam = ($location.search()).ver;
        mainPage.orders = [
            {name: 'Id', value: 'id'},
            {name: 'Owner', value: 'owner'},
            {name: 'Title', value: 'title'},
        ];

        mainPage.selectascdsc = function(ascdsc){
            mainPage.ascdsc = ascdsc;
        };

        mainPage.url = function(){
            var parser = $location.absUrl();
            var arr = parser.split('/');
            var crit = arr[arr.length - 3];
            var sent = arr[arr.length - 2];
            return ([crit, sent]);
        };

        mainPage.actualOrder = function(){
            if (mainPage.url()[0] == 'owner'){
                return mainPage.orders[1];
            } else if (mainPage.url()[0] == 'title'){
                return mainPage.orders[2];
            } else {
                return mainPage.orders[0];
            }
        };

        if (mainPage.url()[1] == 'dsc'){
            mainPage.selectascdsc('dsc');
            mainPage.actualascdsc = 'DSC';
        } else {
            mainPage.selectascdsc('asc');
            mainPage.actualascdsc = 'ASC';
        }
        
        mainPage.getOrderUrl = function(){
            return urlBase+mainPage.myOrder.value+'/'+mainPage.ascdsc;
        };

    }]);
})();
