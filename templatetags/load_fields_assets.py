from django import template
from django.template.loader import render_to_string
from django.templatetags.static import static

from classytags.helpers import InclusionTag

from pulpo_forms.fieldtypes import FieldFactory

register = template.Library()


class fields_assets_block(InclusionTag):
    template = 'asset_block_template.html'

    def get_context(self, context):
        l = FieldFactory.FieldFactory.get_all_classes()
        ret = []
        non_static = []
        styles = []
        for c in l:
            ret.extend(c.get_assets())
            non_static.extend(c.get_non_static())
            styles.extend(c.get_styles())
        context['asset_list'] = []
        context['non_static_assets'] = []
        context['style_list'] = []
        # Permanent assets
        context['asset_list'].append(
            static('js/validators/validatorFactory.js'))
        context['asset_list'].append(static('js/fields/FieldFactory.js'))
        context['asset_list'].append(static('js/fields/FieldBase.js'))
        context['asset_list'].append(static('js/operators/operatorFactory.js'))
        context['asset_list'].append(static('js/operators/operatorField.js'))
        # Dynamic assets
        for elem in ret:
            st_elem = static(elem)
            if st_elem not in context['asset_list']:
                context['asset_list'].append(st_elem)
        for elem in non_static:
            if elem not in context['non_static_assets']:
                context['non_static_assets'].append(elem)
        for elem in styles:
            st_elem = static(elem)
            if st_elem not in context['style_list']:
                context['style_list'].append(st_elem)
        return context

    def render_tag(self, context):
        data = self.get_context(context)
        output = render_to_string(self.template, data)
        return output

register.tag(fields_assets_block)
