'use strict';

function TextAreaField() {
	
}

TextAreaField.buildField = function(){
	var field = FieldBase.buildField(this);
	field.field_type = 'TextAreaField';
	field.validations = {
        max_len_text: 400,
    };
	return (field);
};

// Register field constructor in Factory
fieldFactory.registerField('TextAreaField', TextAreaField);
