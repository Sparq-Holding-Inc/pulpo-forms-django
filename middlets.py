from django.core.exceptions import ValidationError

from rest_framework import status

from .views import JSONResponse


class ValidationErrorToHttpErrorMiddleware(object):
    """
    Catch ValidationError exceptions and render them as JSONResponse
    """

    def process_exception(self, request, exception):
        if isinstance(exception, ValidationError):
            content = {'error': exception.message}
            return JSONResponse(content, status.HTTP_400_BAD_REQUEST)
