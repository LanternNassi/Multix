"""
ASGI config for Multix_business project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.1/howto/deployment/asgi/
"""

import os
import django
from channels.routing import ProtocolTypeRouter
from channels.http import AsgiHandler

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Multix_business.settings')
django.setup()

application = ProtocolTypeRouter({
    "http" : AsgiHandler(),
})
