'use strict';

var validatorFactory = (function () {
 
    // Available validators classes
    var validator = {};
 
    return {
        getValidator: function (validatorName) {
            var Validator = validator[validatorName];
            return Validator;
        },
        registerValidator: function (validatorName, Validator) {
            // Register Operator Class
            validator[validatorName] = Validator;
            return validatorFactory;
        },
        listValidators: function (){
            return validator;
        }
    };
    
})();
