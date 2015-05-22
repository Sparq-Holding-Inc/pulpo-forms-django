from django.contrib.auth.models import User
import json

from rest_framework import serializers

from pulpo_forms.models import Form, FieldEntry, Version, FormEntry
from pulpo_forms.fields import Field_Data
from pulpo_forms.fieldtypes.FieldFactory import FieldFactory as Factory
from pulpo_forms.JSONSerializers import FieldSerializer


class FormSerializer(serializers.ModelSerializer):
    """
    Complete serializer for the forms used for the REST framework
    """
    owner = serializers.ReadOnlyField(source='owner.username')
    # versions = serializers.RelatedField(many=True, read_only=True)

    class Meta:
        model = Form
        fields = ('id', 'title', 'slug', 'owner')
        read_only_fields = ('slug', 'id', )


class VersionSerializer(serializers.ModelSerializer):
    """
    Complete serializer for the forms used for the REST framework
    """
    form = serializers.ReadOnlyField(source='form.id')
    json = serializers.CharField(required=False)

    def to_internal_value(self, data):
        form_id = data['form']
        form = Form.objects.get(id=form_id)
        data['form'] = form
        value = json.loads(data['json'])
        for page in value['pages']:
            for field in page['fields']:
                f_type = Factory.get_class(field['field_type'])
                f = Field_Data()
                field_data = FieldSerializer(f, field)
                field_data.update(f, field)
                f_type().check_consistency(f)
        return data

    def to_representation(self, obj):
        '''
        Override to_representation method to change the form ID for its title
        '''
        data = {}
        data['number'] = obj.number
        data['json'] = obj.json
        data['captcha'] = obj.captcha
        data['form'] = obj.form.title
        data['status'] = obj.status

        return data

    def update(self, instance, validated_data):
        instance.number = validated_data.get('number', instance.number)
        instance.status = validated_data.get('status', instance.status)
        instance.json = validated_data.get('json', instance.json)
        instance.captcha = validated_data.get('captcha', instance.captcha)
        instance.save()
        return instance

    def create(self, validated_data):
        if 'owner' in validated_data:
            del validated_data['owner']
        return Version.objects.create(**validated_data)

    class Meta:
        model = Version
        fields = ('number', 'status', 'json', 'form', 'captcha')
        read_only_fields = ('number',)


class UserSerializer(serializers.ModelSerializer):
    forms = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Form.objects.all())

    class Meta:
        model = User
        fields = ('id', 'username', 'forms')


class FieldEntrySerializer(serializers.ModelSerializer):

    def create(self, validated_data):
        return FieldEntry.objects.create(**validated_data)

    class Meta:
        model = FieldEntry
        fields = (
            'pk', 'field_id', 'field_type',
            'text', 'required', 'shown', 'answer'
        )
        read_only_fields = ('pk',)


class FormEntrySerializer(serializers.ModelSerializer):
    """
    Serializer for the form entries
    """
    fields = serializers.RelatedField(
        many=True, queryset=FormEntry.objects.all())

    def create(self, validated_data):
        return FormEntry.objects.create(**validated_data)

    def to_representation(self, obj):
        data = {}
        data['entry_time'] = obj.entry_time
        data['fields'] = []
        for field in obj.fields.all():
            serializer = FieldEntrySerializer(field)
            serializer.data['id'] = field.pk
            data['fields'].append(serializer.data)

        return data

    class Meta:
        model = FormEntry
        fields = ('entry_time', 'fields')
