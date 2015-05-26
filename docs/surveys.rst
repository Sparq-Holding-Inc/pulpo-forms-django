Surveys
=======

Creating a new Survey
---------------------

* Go to the defined base url and login with a Django Admin user.
* Once logged in press the link “*New Form*” on the left menu of the page. You will be redirected to the Editor page.
* Choose a title for this survey. The title will generate a slug which will identify the survey so it must be unique in the system.
* On the Editor you will be able to create and modify the surveys before publishing them. For this purpose there is a panel on the right hand side of the page, with three tabs.

	* The first one is named "Palette" and lets you insert new fields (questions) to the survey.
	* The second one is for setting the properties of the fields. The properties will vary depending on the type of the field you are editing.
	* Last but not least, the third tab is the configuration tab. Among the options here are: enabling the use of a captcha, selecting the actions to be realized when a survey is completed and configuring the logic that determines if a field or page is shown or hidden.

* Once the desired modifications have been done click on 'Save' or 'Publish'.
* On the main page you will now see listed the newly created survey.

States of a survey
^^^^^^^^^^^^^^^^^^

A survey might have several versions, with each version being in one of the following states:

**Draft**
  Version is being edited and cannot be filled yet. It still can be modified in the Editor page.

**Published**
  This is the currently published version. It cannot be modified and this is the version which will be shown when someone wants to complete the survey. In addition, you can see the responses and statistics of this version.

**Expired**
  This version was published but has now been replaced by a new version. You can still see statistic and responses of this versions.

Completing a survey
-------------------

To complete or fill a survey it has to be displayed on a web page. Currently, there are 3 ways to do this.

**URL**
  The survey can be mapped to a specific URL using the view "render_form".
  It is just necessary to add the following line to the ``urls.py`` file of your project::

	url(r'^<survey_url>/$','dynamicForms.views.render_form',{'instance':'<survey_slug>'}),

**TAG**
  You can include the survey in any webpage using a Django Tag. It is necessary to load the Tag before calling it::

	{%load  visor_tag%}

	{%visor_template_tag "<survey_slug>" %}


**Django CMS**
  The survey can be embedded as a Django-CMS plugin into any existing CMS page.

Restrictions
^^^^^^^^^^^^

  .. warning::
    Multipath logic has very few consistency checks so the user that generates the surveys will be responsible for creating a consistent logic.

  .. warning::
    Due to restrictions of the technologies used, you cannot put more than one survey on a single webpage.
