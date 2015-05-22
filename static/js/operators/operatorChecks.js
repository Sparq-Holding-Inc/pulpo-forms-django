'use strict';

function OperatorChecks() {
	OperatorList.call();
}

OperatorChecks = Object.create(OperatorList);
OperatorChecks.prototype.constructor = OperatorChecks;

OperatorChecks.contains = function(data, contition){
	var list = data.split(',');
	for (var i = 0; i < list.length; i++) {
        if (list[i] === contition) {
            return true;
        }
    }
    return false;
};

OperatorChecks.not_contains = function(data, contition){
	var list = data.split(',');
	for (var i = 0; i < list.length; i++) {
        if (list[i] === contition) {
            return false;
        }
    }
    return true;
};

operatorFactory.registerOperator('CheckboxField', OperatorChecks);
