Architecture
============

General description
-------------------

The system has two main modules:

* One, developed in **Python** using the MTV (Model-Template-View) framework **Django**.
* The other, developed in javascript using the MVC (Model-View-Controller) framework **AngularJS**.

The Python module handles the application logic. This will be run in a web server based on HTTP requests from a web browser. The app will run the necessary processes, making the required queries to a database, and returning the appropriate response to the web browser.
The Python/Django application handles this responses besides the possibility of creating new content, which will be stored in the database.

On the other side, the Angular application makes the HTTP requests to the server, and once it has the response, it displays its content, controlling the different aspects of said presentation based on the application logic.


Database
--------

The database uses six tables to store all the necessary data for the system to work properly. This are:

**dynamicForms_fieldentry**
  Stores the information the responses of each field in a survey. This includes the id within the given survey, its type, whether it’s a required field or if it was shown, depending on the multi path logic defined in the form.

**dynamicForms_fileentry**
  Stores the information of a particular field, the File field. This table stores information about the uploaded file, such as the file type, the name and a reference to the corresponding FieldEntry.

**dynamicForms_form**
  Stores the general information of each survey, like its title, slug, id and its owner.

**dynamicForms_formentry**
  Stores the entries for the versions of each of the forms. For this reason, it keeps a reference to the corresponding version, and the time when the entry was submitted.

**dynamicForms_survey**
  Stores each instance of a form created as a plugin to be included in DjangoCMS application.

**dynamicForms_version**
  Keeps the information of the structure of the versions, such as its state, publication and expiration date, whether it uses a captcha, and a JSON containing the survey’s structure.

JSON
----

This JSON contains the structure and the information of the version of a form. The JSON  will be interpreted on the front-end and generate the saved survey using the necessary templates so that the final user can complete it.

An example of a JSON::

	{
	    "pages": [{
	        "subTitle": "",
	        "fields": [{
	            "field_id": 1,
	            "validations": {
	                "max_len_text": 255
	            },
	            "text": "Text",
	            "tooltip": "",
	            "dependencies": {
	                "fields": [],
	                "pages": []
	            },
	            "required": false,
	            "answer": [],
	            "field_type": "TextField"
	        }]
	    }],
	    "logic": {
	        "fields": {},
	        "pages": {}
	    }
	}

The main structure of the JSON has two parts: **pages** and **logic**. The first one contains the fields, their ids, configuration such as maximum or minimum length of the text and also the logic dependencies of other fields. The second part contains the multipath logic configuration of the survey. Separated by field or pages the logic condition that hides or show one of those items.

