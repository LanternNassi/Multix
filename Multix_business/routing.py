from django.urls import re_path , path
from Gigs.consumers import *
from Business_Accounts.consumers import *

websocket_urlpatterns = [
    path('ws/gig_notifications/<str:room_name>/',Gigs_consumer.as_asgi())
    
]