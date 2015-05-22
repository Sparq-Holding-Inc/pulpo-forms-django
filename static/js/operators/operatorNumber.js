'use strict';

function OperatorNumber() {
	OperatorField.call();
}

OperatorNumber = Object.create(OperatorField);
OperatorNumber.prototype.constructor = OperatorNumber;

OperatorNumber.greater_than = function(a, b){
	var aInt = parseInt(a,10);
	var bInt = parseInt(b,10);
	return (aInt>bInt);
};

OperatorNumber.greater_than_or_equal = function(a, b){
	var aInt = parseInt(a,10);
	var bInt = parseInt(b,10);
	return (aInt >= bInt);
};

OperatorNumber.equal = function(a, b){
	var aInt = parseInt(a,10);
	var bInt = parseInt(b,10);
	return (aInt == bInt);
};

OperatorNumber.not_equal = function(a, b){
	var aInt = parseInt(a,10);
	var bInt = parseInt(b,10);
	return (aInt != bInt);
};

OperatorNumber.less_than_or_equal = function(a, b){
	var aInt = parseInt(a,10);
	var bInt = parseInt(b,10);
	return (aInt <= bInt);
};

OperatorNumber.less_than = function(a, b){
	var aInt = parseInt(a,10);
	var bInt = parseInt(b,10);
	return (aInt < bInt);
};

operatorFactory.registerOperator('NumberField', OperatorNumber);
