'use strict';

function EmailField() {
	
}

EmailField.buildField = function(){
	var field = FieldBase.buildField(this);
	field.field_type = 'EmailField';
	field.validations = {
        max_len_text: 255,
    };
	return (field);
};

// Register field constructor in Factory
fieldFactory.registerField('EmailField', EmailField);