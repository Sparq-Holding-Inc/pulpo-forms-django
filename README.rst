===========
Pulpo Forms
===========

Pulpo Forms is a Django app capable of creating powerful surveys with many different field types, multi path logic for fields and pages and statistical analysis of responses.

Quick Start
-----------

1. Add ``'pulpo_forms'`` to the ``INSTALLED_APPS`` of your project's settings::

	INSTALLED_APPS = (
		# other apps
		'pulpo_forms',
	)

Add the ``FIELD_FILES`` to your project's settings to include the provided fields, plus any other field defined in another app::

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

* Add ``'pulpo_forms.middlets.ValidationErrorToHttpErrorMiddleware'`` to the ``MIDDLEWARE_CLASSES`` of your project's settings::

	MIDDLEWARE_CLASSES = (
		# other
		'pulpo_forms.middlets.ValidationErrorToHttpErrorMiddleware',
	)

* Define the base url you want and add it to your project's settings:: 

	FORMS_BASE_URL = '<base_url>'

* To configure the mail service the following variables must be defined in your settings file as well::

	EMAIL_HOST = <'MAIL_SERVER'>
	EMAIL_HOST_USER = <'MAIL_ACCOUNT'>
	EMAIL_HOST_PASSWORD = <'MAIL_PASSWORD'>
	EMAIL_PORT = <PORT>
	EMAIL_USE_TLS = True

* In your project's ``urls.py`` add::

	urlpatterns = patterns('',
	    # other patterns
	    url(r'^<base_url>/', include('pulpo_forms.urls'), name='base'),
	)

* Run `python manage.py migrate` to create the app models