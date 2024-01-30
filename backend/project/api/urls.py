from django.conf.urls import url
from django.views.decorators.http import require_http_methods
from api.views import login

urlpatterns = [
    url(r'^login$', require_http_methods(['POST'])(login)),
]