from django import template
from django.template.loader import render_to_string
from django.conf import settings
from django.http import Http404

from classytags.core import Options
from classytags.arguments import Argument
from classytags.helpers import InclusionTag

from pulpo_forms.models import Form
from pulpo_forms.fields import PUBLISHED

register = template.Library()


class visor_template_tag(InclusionTag):
    """
    Template Tag to include a Form into an existing Page.
    Usage:
        {% visor_template_tag form %}
    where form is the slug of the form to be loaded.
    """
    template = 'visor_cms.html'
    options = Options(
        Argument('form'),
    )

    def get_context(self, context, form):
        context['errors'] = ""
        try:
            f = Form.objects.get(slug=form)
        except Form.DoesNotExist:
            context['errors'] += "This Form does not exist.\n"
            return context
        v = f.versions.filter(status=PUBLISHED).first()
        if (not v):
            context['errors'] += "This Form has no published version.\n"
            raise Http404
        else:
            output = f.slug
            base_url = settings.FORMS_BASE_URL
            context['instance'] = output
            context['base_url'] = base_url
        return context

    def render_tag(self, context, form):
        data = self.get_context(context, form)
        if (data['errors'] != ""):
            return render_to_string('404.html', data)
        output = render_to_string(self.template, data)
        return output

register.tag(visor_template_tag)
