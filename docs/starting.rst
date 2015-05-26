Getting Started
===============

Installation
------------

* Install Dynamic Forms with the Python package manager::

	pip install dynamic-forms

Settings
--------

* Add ``'dynamicForms'`` to the ``INSTALLED_APPS`` of your project's settings::

	INSTALLED_APPS = (
		# other apps
		'dynamicForms',
	)

* Add ``'dynamicForms.middlets.ValidationErrorToHttpErrorMiddleware'`` to the ``MIDDLEWARE_CLASSES`` of your project's settings::

	MIDDLEWARE_CLASSES = (
		# other
		'dynamicForms.middlets.ValidationErrorToHttpErrorMiddleware',
	)

* Define the base url you want and add it to your project's settings:: 

	FORMS_BASE_URL = '<base_url>'

* To configure the mail service the following variables must be defined in your settings file as well::

	EMAIL_HOST = <'MAIL_SERVER'>
	EMAIL_HOST_USER = <'MAIL_ACCOUNT'>
	EMAIL_HOST_PASSWORD = <'MAIL_PASSWORD'>
	EMAIL_PORT = <PORT>
	EMAIL_USE_TLS = True

* Finally, in your project's ``urls.py`` add::

	# other imports
	import dynamicForms

	urlpatterns = patterns('',
	    # other patterns
	    url(r'^<base_url>/', include('dynamicForms.urls'), name='base'),
	)
