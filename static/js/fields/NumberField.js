'use strict';

function NumberField() {
	
}

NumberField.buildField = function(){
	var field = FieldBase.buildField(this);
	field.field_type = 'NumberField';
	field.validations = {
        min_number: null,
        max_number: null,
    };
	return (field);
};

// Register field constructor in Factory
fieldFactory.registerField('NumberField', NumberField);
