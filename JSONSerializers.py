from rest_framework import serializers
import ast

from pulpo_forms.fields import Validations, Dependencies, Option


class ValidationSerializer(serializers.Serializer):
    """
    Serializer for the validations in the versions json
    """
    max_len_text = serializers.IntegerField(required=False, allow_null=True)
    max_number = serializers.IntegerField(required=False, allow_null=True)
    min_number = serializers.IntegerField(required=False, allow_null=True)

    def update(self, instance, validated_data):
        """
        Given a dictionary of deserialized field values, either update
        an existing model instance, or create a new model instance.
        """
        if instance is not None:
            if (not validated_data.get('max_len_text')
                    and (validated_data.get('max_len_text') != 0)):
                instance.max_len_text = None
            else:
                instance.max_len_text = validated_data.get(
                    'max_len_text', instance.max_len_text)
            if (not validated_data.get('max_number')
                    and (validated_data.get('max_number') != 0)):
                instance.max_number = None
            else:
                instance.max_number = validated_data.get(
                    'max_number', instance.max_number)
            if (not validated_data.get('min_number')
                    and (validated_data.get('min_number') != 0)):
                instance.min_number = None
            else:
                instance.min_number = validated_data.get(
                    'min_number', instance.min_number)
            return instance


class OptionSerializer(serializers.Serializer):
    label = serializers.CharField(max_length=100, required=False)
    id = serializers.IntegerField(required=False)

    def restore_object(self, attrs, instance=None):
        """
        Given a dictionary of deserialized field values, either update
        an existing model instance, or create a new model instance.
        """
        if instance is not None:
            instance.label = attrs.get('label', instance.label)
            instance.id = attrs.get('id', instance.id)
            return instance
        else:
            opt = Option()
            opt.label = attrs.get('label', opt.label)
            opt.id = attrs.get('id')
            return opt


class DependencySerializer(serializers.Serializer):
    pages = serializers.CharField(required=False)
    fields = serializers.CharField(required=False)

    def update(self, instance, validated_data):
        """
        Given a dictionary of deserialized field values, either update
        an existing model instance, or create a new model instance.
        """
        instance.fields = ast.literal_eval(str(
            validated_data.get('fields', instance.fields)))
        instance.pages = ast.literal_eval(str(
            validated_data.get('pages', instance.pages)))
        return instance


class FieldSerializer(serializers.Serializer):
    text = serializers.CharField(required=True, max_length=500)
    required = serializers.BooleanField(required=True)
    tooltip = serializers.CharField(required=False, max_length=300)
    answer = serializers.CharField(required=False)
    options = OptionSerializer(many=True, required=False, read_only=False)
    dependencies = DependencySerializer(required=False)
    validations = ValidationSerializer(required=False)
    max_id = serializers.IntegerField(required=False)
    field_type = serializers.CharField(required=True, max_length=30)
    field_id = serializers.IntegerField(required=True)

    def update(self, instance, validated_data):
        instance.text = validated_data.get('text', instance.text)
        instance.required = validated_data.get('required', instance.required)
        instance.tooltip = validated_data.get('tooltip', instance.tooltip)
        instance.answer = validated_data.get('answer', instance.answer)
        instance.options = validated_data.get('options', instance.options)
        instance.max_id = validated_data.get('max_id', instance.max_id)
        instance.field_type = validated_data.get(
            'field_type', instance.field_type)
        instance.field_id = validated_data.get('field_id', instance.field_id)

        dep = Dependencies()
        dependencies = DependencySerializer(validated_data.get(
            'dependencies', instance.dependencies))
        instance.dependencies = dependencies.update(
            dep, validated_data.get('dependencies', instance.dependencies))

        val = Validations()
        validations = ValidationSerializer(validated_data.get(
            'validations', instance.validations))
        instance.validations = validations.update(
            val, validated_data.get('validations', instance.validations))

        return instance


class AfterSubmitSerializer(serializers.Serializer):
    """
    Serializer for the validations in the versions json
    """
    sendMail = serializers.BooleanField(required=True)
    action = serializers.CharField(required=True)
    mailSubject = serializers.CharField(required=False, allow_blank=True)
    mailText = serializers.CharField(required=False, allow_blank=True)
    mailSender = serializers.CharField(required=False, allow_blank=True)
    mailRecipient = serializers.CharField(required=False, allow_blank=True)
    message = serializers.CharField(required=False, allow_blank=True)
    redirect = serializers.CharField(required=False, allow_blank=True)

    def update(self, instance, validated_data):
        instance.sendMail = validated_data.get('sendMail', instance.sendMail)
        instance.action = validated_data.get('action', instance.action)
        instance.mailSubject = validated_data.get(
            'mailSubject', instance.mailSubject)
        instance.mailText = validated_data.get('mailText', instance.mailText)
        instance.mailSender = validated_data.get(
            'mailSender', instance.mailSender)
        instance.mailRecipient = validated_data.get(
            'mailRecipient', instance.mailRecipient)
        instance.message = validated_data.get('message', instance.message)
        instance.redirect = validated_data.get('redirect', instance.redirect)
        return instance
