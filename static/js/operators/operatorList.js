'use strict';

function OperatorList() {

	OperatorField.call();
}


OperatorList = Object.create(OperatorField);
OperatorList.prototype.constructor = OperatorList;

OperatorList.operandKind = function(){
	return 'options';
};

OperatorList.equal = function(a, b){
	return (a === b);
};

OperatorList.not_equal = function(a, b){
	return (a !== b);
};

operatorFactory.registerOperator('SelectField', OperatorList);
