'use strict';

function GeoField() {
	
}

GeoField.buildField = function(){
	
    var field = FieldBase.buildField(this);
    
	field.field_type = 'GeoField';
    field.mapzoom = 8,
    field.mapXY = {
        latitude: -34.806777135903424,
        longitude: -56.164398487890594
    }, 
    field.first = true;
    return (field);
};

// Register field constructor in Factory
fieldFactory.registerField('GeoField', GeoField);
