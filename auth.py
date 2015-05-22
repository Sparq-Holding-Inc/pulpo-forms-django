from django.http import HttpResponse, HttpResponseRedirect
from django.contrib.auth import authenticate, login, logout
from django.shortcuts import render_to_response
from django.template.context import RequestContext
from django.contrib.auth.decorators import login_required
from django.conf import settings


def user_login(request):
    # Get context for the user's request
    context = RequestContext(request)

    if request.user.is_authenticated():
        return HttpResponseRedirect(settings.FORMS_BASE_URL + "main/")
    if request.method == 'POST':
        # Get data from login form
        username = request.POST['username']
        password = request.POST['password']
        # Check if user is valid
        _user = authenticate(username=username, password=password)

        # If there is a user object, its correct
        # If None, no user with matching data was found
        if _user:
            if _user.is_active:
                # Login and send user to mainpage
                login(request, _user)
                return HttpResponseRedirect(settings.FORMS_BASE_URL + "main/")
            else:
                # An inactive account was used- no login in.
                return HttpResponse("Your account is disabled.")
        else:
            # Bad login
            return render_to_response('login.html', {'error': True}, context)
    else:
        # Method wasnt POST
        return render_to_response('login.html', {"error": False}, context)


@login_required
def user_logout(request):
    # Since we know the user is logged in, we can now just log them out.
    logout(request)

    # Take the user back to the homepage.
    return HttpResponseRedirect(settings.FORMS_BASE_URL + 'login/')
