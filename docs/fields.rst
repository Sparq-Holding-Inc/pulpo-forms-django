Fields
======

Field components
----------------

Each of the field types that belong to this framework has the following components: 

**Python class**
  Each field type must have a Python class. This class must extend the abstract class ``Field`` (implemented in ``dynamicForms.fieldtypes.Field.py``) or one of its subclasses.
  This class will contain all the methods associated to this field type like validations, statistics operations, etc. It will also contain the paths to the HTML templates and JavaScript/CSS files associated with this field type.

**JavaScript files**
  Each field type might need up to 3 JavaScript files:
  
  - JSON constructor
  
    Located in the folder ``static/js/fields``. This file must be provided and must contain a class that extends ``FieldBase``, which contains the fields attributes.
  
  - Operator
  
    Located in ``static/js/operators``. This file is needed only if this field type includes operators for the multipath logic.
    Contains a class that extends ``OperatorField``.
    All the methods defined in this class will be listed as available operators.
  
  - Validator
  
    Located in ``static/js/validators``. This file is necessary only if this field needs extra validation in the Front-End.

**HTML Templates**
  Each field type must have defined 3 templates which will normally live under ``templates/fields/<fieldtype_name>/``, there is an extra template for fields that have statistics analysis.

  - ``properties.html``

    Generates the validation options for this field type in the editor’s panel. Extends ``field_properties_base.html``
  - ``template.html``

    Contains the HTML code for this field to be shown to the final user to complete a survey. Extends ``field_template_base.html.``
  - ``template_edit.html``

    Contains the HTML code for this field to be shown in the editor page. Extends ``field_edit_template_base.html``.

  - ``template_statistic.html``

    Contains the HTML code for this field to be shown in the statictis page.

**CSS**
  Located in ``static/css/fields``.
  Contains the styles for the fields and will be used by the ``template.html`` mentioned before.

Factory
-------

To load all the defined field types dynamically the app uses factories in Front- and Back-End.

This means that for a new field type to be supported, it has to be registered in these factories. Additionally it has to be registered using the same identifying name in both and without using one of the previously used identifiers. Conventionally the identifier will be the same as the class name (e.g. ``NumberField``, ``DecimalField``).


Creating a new field type
-------------------------

It is pretty easy to define a new type of field. Basically, it consists in creating the necessary components detailed in **Field Components**.
And add a line to the settings of your project::

    FIELD_FILES=(
        #other fields,
        <path_to_your_python_class>
    )

Model field
---------------

Dynamic Forms supports adding the items of models of other applications as combobox options. This is called ``ModelField``.
For this to work it is necessary to define a new field type that extends the abstract class ``ModelField`` and which sets the *model* attribute to the model class whose items shall be shown.

	.. note::

		It is not yet supported to filter this items. It should also have a JavaScript constructor class but just needs to redefine the properties.html template to show the correct name.