from django.dispatch import Signal


modified_logic = Signal(providing_args=["sent_data"])
