from django.conf import settings
from django.utils.translation import ugettext_lazy as _

from cms.plugin_pool import plugin_pool
from cms.plugin_base import CMSPluginBase

from .models import Survey

class SurveyPlugin(CMSPluginBase):
    model = Survey
    name = _("Survey Plugin")
    render_template = "visor_cms.html"

    def render(self, context, instance, placeholder):
        context['instance'] = instance
        context['base_url'] = settings.FORMS_BASE_URL
        return context

plugin_pool.register_plugin(SurveyPlugin)
