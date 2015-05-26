# pulpo-forms-django
Pulpo Forms is a Django app capable of creating powerful surveys with many different field types, multi path logic for fields and pages and statistical analysis of responses.

## Requirements
* Django >= 1.6
* Django Rest Framework >= 3.1.1
* AngularJS 1.3.9

## Features
Pulpo Forms provides several useful functionalities and characteristics for survey creation.

* Support for multi page surveys with different field types.
* Multi path logic for both fields and pages
* Survey version control
* Friendly field configuration interface
* Configurable tooltips for fields
* Configurable actions to run after submit
* Survey preview with responsive template
* Custom validations for the different field types.
* Statistical data from the responses to the surveys.
* Export of responses as CSV.
* Export of statistics in PDF format.
* [AngularJS module](https://github.com/pulpocoders/kaurna-angular "Kaurna Angular") with tools to embed the forms in web pages.

## Getting Started

### Installation

Install Pulpo Forms with the Python package manager:
```
	pip install pulpo-forms
```
### Settings

* Add ``'pulpo_forms'`` to the ``INSTALLED_APPS`` of your project's settings:
```
    INSTALLED_APPS = (
      # other apps
      'pulpo_forms',
    )
```

* Add the ``FIELD_FILES`` to your project's settings to include the provided fields, plus any other field defined in another app:
```
  FIELD_FILES = (
    'pulpo_forms.fieldtypes.TextField',
    'pulpo_forms.fieldtypes.TextAreaField',
    'pulpo_forms.fieldtypes.EmailField',
    'pulpo_forms.fieldtypes.CheckboxField',
    'pulpo_forms.fieldtypes.SelectField',
    'pulpo_forms.fieldtypes.GeoField',
    'pulpo_forms.fieldtypes.NumberField',
    'pulpo_forms.fieldtypes.CIField',
    'pulpo_forms.fieldtypes.FileField',
    'other_app.fields',
)
```

* Add ``'pulpo_forms.middlets.ValidationErrorToHttpErrorMiddleware'`` to the ``MIDDLEWARE_CLASSES`` of your project's settings:
```
    MIDDLEWARE_CLASSES = (
      # other
      'pulpo_forms.middlets.ValidationErrorToHttpErrorMiddleware',
    )
```
* Define the base url you want and add it to your project's settings: 
```
    FORMS_BASE_URL = '<base_url>'
```
* To configure the mail service the following variables must be defined in your settings file as well:
```
    EMAIL_HOST = <'MAIL_SERVER'>
    EMAIL_HOST_USER = <'MAIL_ACCOUNT'>
    EMAIL_HOST_PASSWORD = <'MAIL_PASSWORD'>
    EMAIL_PORT = <PORT>
    EMAIL_USE_TLS = True
```
* Finally, in your project's ``urls.py`` add:
```
    # other imports
    import pulpo_forms

    urlpatterns = patterns('',
        # other patterns
        url(r'^<base_url>/', include('pulpo_forms.urls'), name='base'),
    )
```
### Model field

Pulpo Forms supports adding the items of models of other applications as combobox options. This is called ``ModelField``.
For this to work it is necessary to [*define a new field type*](#fields). that extends the abstract class ``ModelField`` and which sets the *model* attribute to the model class whose items shall be shown.

> Note:
>
>   It is not yet supported to filter these items. It should also have a JavaScript constructor class but just needs to redefine the properties.html template to show the correct name.

## Fields

### Field components

Each of the field types that belong to this framework has the following components: 

**Python class**

  Each field type must have a Python class. This class must extend the abstract class ``Field`` (implemented in ``pulpo_forms.fieldtypes.Field.py``) or one of its subclasses.
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

  Each field type must have defined 2 templates which will normally live under ``templates/fields/<fieldtype_name>/``, there is an extra template for fields that have statistics analysis.

  - ``properties.html``

    Generates the validation options for this field type in the editor’s panel. Extends ``field_properties_base.html``
  - ``template_edit.html``

    Contains the HTML code for this field to be shown in the editor page. Extends ``field_edit_template_base.html``.

  - ``template_statistic.html``

    Contains the HTML code for this field to be shown in the statistics page.

## Factory

To load all the defined field types dynamically the app uses factories in Front- and Back-End.

This means that for a new field type to be supported, it has to be registered in these factories. Additionally it has to be registered using the same identifying name in both and without using one of the previously used identifiers. Conventionally the identifier will be the same as the class name (e.g. ``NumberField``).


### Creating a new field type

To define a new field type you need to create the necessary components detailed in [*Field Components*](#field-components), and add a line to the settings of your project:
```
    FIELD_FILES=(
        #other fields,
        <path_to_your_python_class>
    )
```

## Known issues

* Multipath logic has very few consistency checks so the user that generates the surveys will be responsible for creating a consistent logic.
