from django.shortcuts import render
from rest_framework.decorators import api_view , permission_classes , authentication_classes
from rest_framework.response import Response
from django.http import JsonResponse
from rest_framework.renderers import JSONRenderer , json
from rest_framework import status ,permissions ,viewsets
from rest_framework.authentication import SessionAuthentication, BasicAuthentication, TokenAuthentication 
from rest_framework.permissions import IsAuthenticated , AllowAny
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from collections import namedtuple
import datetime

#Importing Gig models
from Gigs.models import (
    Gig,
    Gig_Applicant,
    Gig_Additional_info,
    Gig_Project_Completed,
    Gig_Transaction,
)
#Importing Gigs serializers
from Gigs.Serializers import (
    Gig_Applicant_serializer,
    Gig_Additional_info_serializer,
    Gig_Transaction_serializer,
    Gig_serializer,
    Gig_Project_completed_serilizer,
    gigs,
    slicer_gigs
)

from Business_Accounts.Serializers import (
    get_Account
)
from Business_Accounts.models import Business_Account


# ======================================Start of personal views======================================================


def calculate_expiration_date():
    date = datetime.datetime.now()
    day = date.day
    month = date.month
    year = date.year
    if (month == 12) :
        month = 1
        year = date.year + 1
        return datetime.datetime(year,month,day)
    else :
        return datetime.datetime(year,month+1,day)



@api_view(['POST'])
@authentication_classes([BasicAuthentication, SessionAuthentication , TokenAuthentication])
@permission_classes([IsAuthenticated])
def create_gig(request):
    admin_user = User.objects.get(username = request.user)
    bus_account = Business_Account.objects.get(user = admin_user)
    approved_data = {}
    expiration_date = calculate_expiration_date()
    serializer_gig = Gig_serializer(data = {**request.data['word_info'] , 'Gig_expiration_date' : expiration_date , 'Account_id' : admin_user.id })
    if serializer_gig.is_valid():
        new_gig = serializer_gig.create(serializer_gig.validated_data)
        bus_account.Gigs.add(new_gig)
        final = Gig_serializer(new_gig)
        approved_data['Gig_account'] = final.data
        approved_data['Gig_id'] = new_gig.id
        print('Gig_created')
    else :
        print(serializer_gig._errors)
        return Response(data = {'errors' : serializer_gig._errors , 'from' : 'create_gig'})
    if request.data['Additional_info'] :
        for info in request.data['Additional_info']:
            serializer_info = Gig_Additional_info_serializer(data = { 'gig_id' : '000' , 'Name' : info})
            if serializer_info.is_valid():
                new_info = serializer_info.create(serializer_info.validated_data)
                new_gig.Gig_info.add(new_info)
                approved_data[new_info.id] = serializer_info.validated_data
                account = Business_Account.objects.get(user = admin_user)
                account.Gigs.add(new_gig)
            else :
                print(serializer_info._errors)
                return Response(data = {'errors' : serializer_info._errors , 'from' : 'info'})
    return Response(data = approved_data , status = status.HTTP_201_CREATED)
    


@api_view(['PUT',])
@authentication_classes([BasicAuthentication , SessionAuthentication , TokenAuthentication])
@permission_classes([IsAuthenticated])
def updating_gig_case(request ,id):
    gig = Gig.objects.get(id = id)
    if request.FILES['ShowCase_1']:
        gig.ShowCase_1 = request.FILES['ShowCase_1']
    if request.FILES['ShowCase_2']:
        gig.ShowCase_2 = request.FILES['ShowCase_2']
    if request.FILES['ShowCase_3']:
        gig.ShowCase_3 = request.FILES['ShowCase_3']
    if request.FILES['ShowCase_4']:
        gig.ShowCase_4 = request.FILES['ShowCase_4']
    gig.save()
    return Response(data = {'mode' , 'success'} , status = status.HTTP_202_ACCEPTED)

@api_view(['PUT',])
@authentication_classes([BasicAuthentication , SessionAuthentication , TokenAuthentication])
@permission_classes([IsAuthenticated])
def updating_gig_case_2(request,id):
    gig = Gig.objects.get(id = id)
    name = request.POST['official_name']
    if name == 'ShowCase_1':
        gig.ShowCase_1 = request.FILES['ShowCase_1']
    if name == 'ShowCase_2':
        gig.ShowCase_2 = request.FILES['ShowCase_2']
    if name == 'ShowCase_3':
        gig.ShowCase_3 = request.FILES['ShowCase_3']
    if name == 'ShowCase_4':
        gig.ShowCase_4 = request.FILES['ShowCase_4']
    gig.save()
    return Response(data = {'mode' , 'success'} , status = status.HTTP_202_ACCEPTED)



@api_view(['PUT',])
@authentication_classes([BasicAuthentication , SessionAuthentication , TokenAuthentication])
@permission_classes([IsAuthenticated])
def updating_gig(request):
    user = request.user
    user_account  = User.objects.get(username = user)
    account = Business_Account.objects.get(user = user_account)
    gig = account.Gigs.get(id = request.data['Gig_id'])
    mode = request.data['mode']
    if (mode == 'General_info'):
        info_data = Gig_serializer(gig)
        overall = { request.data['type'] : request.data['update']['data']  }
        serializer = Gig_serializer(data = { **info_data.data , **overall  })
        if serializer.is_valid():
            updated_instance = serializer.update(gig,serializer.validated_data)
            return Response(data = Gig_serializer(updated_instance).data , status = status.HTTP_202_ACCEPTED)
        else : 
            return Response(data = serializer._errors , status = status.HTTP_406_NOT_ACCEPTABLE)
    if (mode == 'additional_info'):
        official_add_info = []
        for i in request.data['update']['data']:
            info = { 'gig_id' : request.data['Gig_id'] , 'Name' : i }
            official_add_info.append(info)
        serializer = Gig_serializer(data = official_add_info , many = True)
        if serializer.is_valid():
            created_instance = serializer.create(serializer.validated_data)
            gig.Gig_info = created_instance
            gig.save()
            return Response(data = serializer(updated_instance , many = True).data , status = status.HTTP_202_ACCEPTED)
        else : 
            return Response(data = serializer._errors , status = status.HTTP_406_NOT_ACCEPTABLE)

    
# ======================================End of personal views======================================================


# ======================================Start of fetching views======================================================

@api_view(['GET',])
@authentication_classes([BasicAuthentication , SessionAuthentication , TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_gigs(request):
    processed_data = []
    gig_type = request.GET.get('Gig_type',"Hiring")
    print(gig_type)
    gig_name = request.GET.get('Gig_name' , '')
    queryset = Gig.objects.all().order_by('-Gig_date_of_creation')[:100]
    if gig_name != '' : 
        queryset = Gig.objects.filter(Gig_type = gig_type , Gig_name__startswith = gig_name).order_by('-Gig_date_of_creation')[:20]
    elif (gig_name == ''):
        queryset = Gig.objects.filter(Gig_type = gig_type).order_by('-Gig_date_of_creation')[:20]
    for obj in queryset :
        account_id = obj.Account_id
        admin_user = User.objects.get(id = account_id)
        business_account = Business_Account.objects.get(user = admin_user)
        account_id = business_account.id
        serialized_gig = gigs(obj , context={'request': request})
        if serialized_gig.data['ShowCase_1'] == None : 
            print(serialized_gig.data['ShowCase_1'])
            serialized_gig.data['ShowCase_1'] = 'No pic'
        gig_id = obj.id
        serialized_account = get_Account(business_account , context={'request': request})
        if serialized_account.data['Profile_pic'] == 'null' :
            serialized_account.data['Profile_pic'] = 'None'
        #print(serialized_account.data)
        serialized_processed_data = slicer_gigs(data = {
            **serialized_account.data ,
            **serialized_gig.data ,
            'Gig_id' : gig_id,
            'Account_id' : account_id,
            
            })
        if serialized_processed_data.is_valid():
            processed_data.append(serialized_processed_data.validated_data)
        else : 
            print(serialized_processed_data.errors)
    return Response(data = processed_data , status =  status.HTTP_202_ACCEPTED)


# Getting detailed gig
@api_view(['GET',])
@authentication_classes([BasicAuthentication , SessionAuthentication , TokenAuthentication])
@permission_classes([IsAuthenticated])
def gig_detail (request):
    Gig_id = request.GET.get('id' , 20)
    gig = Gig.objects.get(id = Gig_id)
    seri_gig = gigs( gig, context={'request': request})
    return Response(data = seri_gig.data , status = status.HTTP_200_OK)

  

   


# ======================================End of fetching views======================================================



    

