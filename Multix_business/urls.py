"""Multix_business URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from django.conf.urls import url, include , static
from django.contrib.auth.models import User
from rest_framework import routers, serializers, viewsets
from django.conf import settings

from Business_Accounts.views import (
    create_business_account,
    updating_profile_pic,
    updating_business_profile,
    updating_profile_pic_account,
    get_account_detail,
    validate_name,
    validate_phone,

)
from Gigs.views import (
    create_gig,
    updating_gig_case,
    updating_gig,
    updating_gig_case_2,
    get_gigs,
    gig_detail,
    hot_deal_apply,
    hot_deal_bidders,
    selling_create,
    get_proposals_and_contracts,
    approve_gig,
    approve_finished_gig,
    Hiring_applicant
)


urlpatterns = [
    path('admin/', admin.site.urls),
    path('<int:id>/profile_pic' , updating_profile_pic , name = 'Profile pic'),
    path('create_business_account',create_business_account,name = "Business Account"),
    path('create_gig' , create_gig , name = "Gig"),
    path('<int:id>/gig_case' , updating_gig_case , name = 'Show Case' ),
    path('update_business_profile' , updating_business_profile , name = 'Profile update'),
    path('update_gig' , updating_gig , name = 'Gig Update'),
    path('update_profile_pic' , updating_profile_pic_account , name = 'Profile_pic_update'),
    path('<int:id>/gig_case_2' , updating_gig_case_2 , name = 'Show Case 2' ),
    path('fill_gigs/',get_gigs,name = 'Get gigs'),
    path('gig_detail/',gig_detail,name='Gig detail'),
    path('account-detail/' , get_account_detail , name = 'Account detail'),
    path('hot_deal_bidders/',hot_deal_bidders , name = "Get hot deal bidders"),
    path('create_bidder',hot_deal_apply,name = 'Create bidder'),
    path('selling_create',selling_create,name = 'Create seller appplicant'),
    path('fetch_contracts_notifications_proposals/',get_proposals_and_contracts , name = 'Fetching contracts notifs and proposals'),
    path('Approve_gig' , approve_gig , name = 'Approve gig'),
    path('approve_finished_gig' , approve_finished_gig , name = 'Approve finished gig'),
    path('create_hiring_applicant' , Hiring_applicant , name = 'Create a hiring applicant'),
    path('Validate_name' , validate_name , name = 'Validate the name'),
    path('Validate_number' , validate_phone , name = 'validate_number')
    
] 

if settings.DEBUG :
    urlpatterns += static.static(settings.MEDIA_URL,document_root=settings.MEDIA_ROOT)

