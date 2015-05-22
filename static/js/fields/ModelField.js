'use strict';

function ModelField() {
	
}

ModelField.buildField = function(){
	var field = FieldBase.buildField(this);
	field.field_type = 'ModelField';
	field.options = [];
    field.max_id = 0;
	return (field);
};

// Register field constructor in Factory
fieldFactory.registerField('ModelField', ModelField);