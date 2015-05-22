'use strict';

function MatriculaField() {
	
}

MatriculaField.buildField = function(){
	var field = FieldBase.buildField(this);
	field.field_type = 'MatriculaField';
	field.validations = {};
	return (field);
};

// Register field constructor in Factory
fieldFactory.registerField('MatriculaField', MatriculaField);