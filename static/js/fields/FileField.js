'use strict';

function FileField() {
	
}

FileField.buildField = function(){
	var field = FieldBase.buildField(this);
	field.field_type = 'FileField';	
    field.validations = {};
	return (field);
};

// Register field constructor in Factory
fieldFactory.registerField('FileField', FileField);