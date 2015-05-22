from rest_framework import permissions


class IsOwnerSuperUserOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to edit it.
    """

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions are only allowed to the owner of object or
        # a superuser.
        try:
            owner = obj.owner
        except AttributeError:
            owner = obj.form.owner
        return (owner == request.user or request.user.is_superuser)
