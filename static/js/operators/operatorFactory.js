'use strict';

var operatorFactory = (function () {
 
    // Available operators classes
    var operator = {};
    var operatorMethods = {};
 
    return {
        getOperator: function (operatorName) {
            var Operator = operator[operatorName];
            return Operator;
        },

        getOperatorMethods: function(operatorName){
            return operatorMethods[operatorName];
        },
        registerOperator: function (operatorName, Operator) {
            // Register Operator Class
            operator[operatorName] = Operator;
            // Register Operator's available methods
            operatorMethods[operatorName] = Operator.listMethods();
            return operatorFactory;
        },
        listOperators: function (){
            return operator;
        }
    };

})();
