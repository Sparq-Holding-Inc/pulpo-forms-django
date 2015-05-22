'use strict';

function OperatorField() {

}

OperatorField.listMethods = function() {
	var methods = [];
	for (var key in this) {
		var exclude = ['constructor', 'register', 'listMethods', 'operandKind'];
		if (typeof this[key] === 'function' &&
				exclude.indexOf(key) < 0) {
			methods.push(key);
    	}
	}
	return methods;
};

OperatorField.operandKind = function(){
	return 'input';
};