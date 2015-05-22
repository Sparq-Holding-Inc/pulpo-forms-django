'use strict';

function TextField() {
	
}

/*
 * Validates the field with the values of the attributes of
 * the element.
 */
TextField.validate = function(value, attrs){
	/*
	 * attrs = a dictionary of attributes on the element
	 */
	var ok = true;
	/* Validate example*/
	//ok = 'hello world' == value;
	//ok &= value.length <= attrs.ngMaxlength;
	
	return (ok);
};

// Register field constructor in Factory
validatorFactory.registerValidator('TextField', TextField);
