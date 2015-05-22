from django.conf.urls import patterns, url
from django.contrib.auth.decorators import login_required
from django.contrib import admin

from rest_framework.urlpatterns import format_suffix_patterns

from pulpo_forms import views, auth
from .fieldtypes.field_type import on_startup

admin.autodiscover()

on_startup()

urlpatterns = patterns('pulpo_forms.views',

    url(r'^forms/(?P<pk>[a-z,0-9,\-,\_]+)/$', views.FormDetail.as_view()),
    url(r'^forms/delete/(?P<pk>[a-z,0-9,\-,\_]+)/$', views.DeleteForm.as_view(), name="form_delete"),
    url(r'^forms/$', views.FormList.as_view()),
    url(r'^version/(?P<pk>[a-z,0-9,\-,\_]+)/(?P<number>[0-9]+)/(?P<action>[a-z]+)/$', views.NewVersion.as_view(), name="version"),
    url(r'^version/(?P<pk>[a-z,0-9,\-,\_]+)/$', views.VersionList.as_view()),
    url(r'^version/(?P<pk>[a-z,0-9,\-,\_]+)/(?P<number>[0-9]+)/$', views.VersionDetail.as_view()),
    url(r'^version/delete/(?P<pk>[a-z,0-9,\-,\_]+)/(?P<number>[0-9]+)/$', views.DeleteVersion.as_view(), name="version_delete"),
    url(r'^version/expire/(?P<pk>[a-z,0-9,\-,\_]+)/(?P<number>[0-9]+)/$', views.ExpireVersion.as_view(), name="version_expire"),

    url(r'^main/(?P<order>(id|owner|title|creation_date))/(?P<ad>(asc|dsc))/$', 'ordered_forms', name="main_sort"),
    url(r'^main/$', views.FormList.as_view(), name='main'),
    url(r'^login/$', auth.user_login, name='login'),
    url(r'^logout/$', auth.user_logout, name='logout'),
    url(r'^preview$', login_required(views.TemplateView.as_view(template_name='preview.html'))),
    url(r'^editor$', login_required(views.TemplateView.as_view(template_name='editor.html')), name="editor"),
    url(r'^$', auth.user_login, name='login'),

    url(r'^field_condition$', views.TemplateView.as_view(template_name='field_condition.html')),
    url(r'^logic_modal', views.TemplateView.as_view(template_name='logic_modal.html')),
    url(r'^logic_page_modal', views.TemplateView.as_view(template_name='logic_page_modal.html')),
    url(r'^post_submit_modal', views.TemplateView.as_view(template_name='post_submit_modal.html')),
    url(r'^field/(?P<type>[A-Z,a-z,0-9,\-,\_]+)/$', views.FieldTemplateView.as_view()),
    url(r'^field_edit/(?P<type>[A-Z,a-z,0-9,\-,\_]+)/$', views.FieldEditTemplateView.as_view(), name='field_edit'),
    url(r'^field_properties/(?P<type>[A-Z,a-z,0-9,\-,\_]+)/$', views.FieldPrpTemplateView.as_view()),
    url(r'^field_statistic/(?P<type>[A-Z,a-z,0-9,\-,\_]+)/$', views.FieldStsTemplateView.as_view()),
    url(r'^palette$', views.TemplateView.as_view(template_name='palette.html')),
    url(r'^select_modal$', views.TemplateView.as_view(template_name='select_modal.html')),
    url(r'^tooltip_modal$', views.TemplateView.as_view(template_name='tooltip_modal.html')),
    url(r'^modify_input$', views.TemplateView.as_view(template_name='modifyInput.html')),


    url(r'^statistics/$' ,views.TemplateView.as_view(template_name='statistics.html'), name="statistics"),
    url(r'^statistics/(?P<pk>[0-9]+)/(?P<number>[0-9]+)(?:/[0-9a-z]+)?/$',views.StatisticsView.as_view()),
    url(r'^statistics/export-pdf/(?P<pk>[a-z,0-9,\-,\_]+)/(?P<number>[0-9]+)/(?P<field>[0-9]+)/$','export_pdf'),  

    url(r'^preview_template', views.TemplateView.as_view(template_name='preview_template.html')),
    url(r'^preview$', views.TemplateView.as_view(template_name='preview.html'), name="preview"),

    url(r'^visor_template', views.TemplateView.as_view(template_name='visor_template.html')),
    url(r'^visor/publishVersion/(?P<slug>[a-z,0-9,\-,\_]+)/$', views.FillForm.as_view()),
    url(r'^visor$', views.TemplateView.as_view(template_name='visor.html'), name="visor"),
    url(r'^visor/submit/(?P<slug>[a-z,0-9,\-,\_]+)/$', 'submit_form_entry'),
    url(r'^visor/form/submitted/(?P<slug>[a-z,0-9,\-,\_]+)/$', 'after_submit_message'),
    url(r'^responses/download/(?P<field_id>[0-9]+)/(?P<entry>[0-9]+)/$', 'download_file'),

    url(r'^responses/(?P<pk>[a-z,0-9,\-,\_]+)/(?P<number>[0-9]+)/$', 'get_responses'),
    url(r'^responses/$', views.TemplateView.as_view(template_name='responses.html'), name="responses"),
    url(r'^responses/export-csv/(?P<pk>[a-z,0-9,\-,\_]+)/(?P<number>[0-9]+)/$', 'export_csv' ),
    url(r'^constants/$', 'get_constants'),
    url(r'^base_url/$', views.get_URL, name='get_URL'),
    #url(r'^.*/$', views.TemplateView.as_view(template_name='404.html'), name="error404"),
)

urlpatterns = format_suffix_patterns(urlpatterns)
