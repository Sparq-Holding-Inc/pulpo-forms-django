'use strict';

function CIField() {
	
}

CIField.buildField = function(){
	var field = FieldBase.buildField(this);
	field.field_type = 'CIField';
	return (field);
};

// Register field constructor in Factory
fieldFactory.registerField('CIField', CIField);
