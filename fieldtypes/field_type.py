from django.conf import settings


def on_startup():
    for file in settings.FIELD_FILES:
        __import__(file, fromlist=[""])
