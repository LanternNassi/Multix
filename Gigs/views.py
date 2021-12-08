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
from django.utils import timezone
#Importing Gig models
from Gigs.models import (
    Gig,
    Gig_Applicant,
    Gig_Additional_info,
    Gig_Project_Completed,
    Gig_Transaction,
    Gig_Deal_Applicant
)
#Importing Gigs serializers
from Gigs.Serializers import (
    Gig_Applicant_serializer,
    Gig_Additional_info_serializer,
    Gig_Deal_Applicant_serializer,
    Gig_Transaction_serializer,
    Gig_serializer,
    Gig_Project_completed_serilizer,
    gigs,
    slicer_gigs,
    slicer_hot_deal_bidders,
    
)

from Business_Accounts.Serializers import (
    get_Account,
    business_account_notifications,
    business_account_contract
)
from Business_Accounts.models import (
    Business_Account,
    Notification,
    Contract,
)


# ======================================Start of personal views======================================================



@api_view(['POST'])
@authentication_classes([BasicAuthentication, SessionAuthentication , TokenAuthentication])
@permission_classes([IsAuthenticated])
def create_gig(request):
    admin_user = User.objects.get(username = request.user)
    bus_account = Business_Account.objects.get(user = admin_user)
    approved_data = {}
    serializer_gig = Gig_serializer(data = {**request.data['word_info'] , 'Gig_expiration_date' : timezone.now() + timezone.timedelta(days = 30) , 'Account_id' : admin_user.id })
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
        adds = []
        for info in request.data['Additional_info']:
            serializer_info = Gig_Additional_info_serializer(data = { 'gig_id' : '000' , 'Name' : info})
            if serializer_info.is_valid():
                new_info = serializer_info.create(serializer_info.validated_data)
                new_gig.Gig_info.add(new_info)
                adds.append(serializer_info.validated_data)
                account = Business_Account.objects.get(user = admin_user)
                account.Gigs.add(new_gig)
            else :
                print(serializer_info._errors)
                return Response(data = {'errors' : serializer_info._errors , 'from' : 'info'})
        approved_data['Additional_info'] = adds
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
        queryset = Gig.objects.filter(Gig_type = gig_type).order_by('-Gig_date_of_creation')
    for obj in queryset :
        account_id = obj.Account_id
        admin_user = User.objects.get(id = account_id)
        business_account = Business_Account.objects.get(user = admin_user)
        #account_id = business_account.id
        serialized_gig = gigs(obj , context={'request': request})
        print(serialized_gig.data)
        if serialized_gig.data['ShowCase_1'] == None : 
            #print(serialized_gig.data['ShowCase_1'])
            serialized_gig.data['ShowCase_1'] = 'No pic'
        gig_id = obj.id
        Number = 0
        if obj.Gig_type == 'Hiring':
            Number = obj.Gig_Applicants.count()
        serialized_account = get_Account(business_account , context={'request': request})
        if serialized_account.data['Profile_pic'] == 'null' :
            serialized_account.data['Profile_pic'] = 'None'
        #print(serialized_account.data)
        serialized_processed_data = slicer_gigs(data = {
            **serialized_account.data ,
            **serialized_gig.data ,
            'Gig_id' : gig_id,
            'Account_id' : account_id,
            'Count' : Number
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

  
@api_view(['GET',])
@authentication_classes([BasicAuthentication , SessionAuthentication , TokenAuthentication])
@permission_classes([IsAuthenticated])
def hot_deal_bidders(request):
    Gig_id = request.GET.get('id',20)
    print(Gig_id)
    gig = Gig.objects.get(id = Gig_id)
    Gig_dealers = gig.Gig_Deals_Applicants.all().order_by('-Date_of_application')
    if Gig_dealers:
        approved_data = []
        for dealer in Gig_dealers :
            customer_id = dealer.Account_id_of_customer
            admin_customer = User.objects.get(id = customer_id)
            account = Business_Account.objects.get(user = admin_customer)
            serialized_account = get_Account(account , context={'request': request})
            serialized_dealer = Gig_Deal_Applicant_serializer(dealer)
            hot_deal = slicer_hot_deal_bidders(data={**serialized_account.data , **serialized_dealer.data})
            if hot_deal.is_valid():        
                approved_data.append(hot_deal.validated_data)
            else :
                print('Invalid')
        return Response(data = approved_data , status = status.HTTP_200_OK)
    else :
        return Response(data = [] , status = status.HTTP_200_OK)

@api_view(['POST',])
@authentication_classes([BasicAuthentication , SessionAuthentication , TokenAuthentication])
@permission_classes([IsAuthenticated])
def hot_deal_apply(request):
    username = request.user
    user = User.objects.get(username = username)
    time  = timezone.now()
    request.data['info']['Account_id_of_customer'] = user.id
    request.data['info']['Date_of_application'] = time
    serialized_dealer = Gig_Deal_Applicant_serializer(data = { **request.data['info']})
    gig = Gig.objects.get(id = request.data['info']['gig_id'])
    account = Business_Account.objects.get(user = user)
    contract = {
        'Contract_owner_id' : gig.Account_id,
        'Type' : 'Hot deals',
        'Deadline' : gig.Gig_expiration_date,
        'Status' : 'false',
        'Gig_id' : gig.id,
        'Negotiated_price' : request.data['info']['Bid_amount'],
        'Date_started' : time
    }
    serialized_contract = business_account_contract(data = contract)
    if serialized_contract.is_valid():
        created_contract = serialized_contract.create(serialized_contract.validated_data)
        account.Contracts.add(created_contract)
    if serialized_dealer.is_valid():
        new_applicant = serialized_dealer.create(serialized_dealer.validated_data)
        gig.Gig_Deals_Applicants.add(new_applicant)
        return Response(data = {**Gig_Deal_Applicant_serializer(new_applicant).data , 'Date' : time , 'Type_id_contract' : created_contract.id , 'Type_id_deal' : new_applicant.id} , status = status.HTTP_201_CREATED)
    else : 
        return Response(data = serialized_dealer._errors , status = status.HTTP_500_INTERNAL_SERVER_ERROR,)

@api_view(['POST',])
@authentication_classes([BasicAuthentication , SessionAuthentication , TokenAuthentication])
@permission_classes([IsAuthenticated])
def Hiring_applicant(request):
    username = request.user
    user = User.objects.get(username = username)
    time = timezone.now()
    
    applicant = {
        **request.data,
        'Account_id_of_customer' : user.id,
        'Date_of_application' : time
    }
    serialized_applicant = Gig_Applicant_serializer(data = { **applicant})
    print(request.data['gig_id'])
    gig = Gig.objects.get(id = request.data['gig_id'])
    account = Business_Account.objects.get(user = user)
    contract = {
        'Contract_owner_id' : gig.Account_id,
        'Type' : 'Hiring',
        'Deadline' : gig.Gig_expiration_date,
        'Status' : 'false',
        'Gig_id' : gig.id,
        'Negotiated_price' : gig.Gig_salary,
        'Date_started' : time,
    }
    serialized_contract = business_account_contract(data = contract)
    if serialized_contract.is_valid():
        created_contract = serialized_contract.create(serialized_contract.validated_data)
        account.Contracts.add(created_contract)
    if serialized_applicant.is_valid():
        new_applicant = serialized_applicant.create(serialized_applicant.validated_data)
        gig.Gig_Applicants.add(new_applicant)
        return Response(data = {**Gig_Applicant_serializer(new_applicant).data , 'Date' : time, 'Hiring_id' : new_applicant.id , 'contract_id' : created_contract.id }, status = status.HTTP_201_CREATED)
    else : 
        return Response(data = serialized_applicant._errors , status = status.HTTP_500_INTERNAL_SERVER_ERROR)
    


@api_view(['POST',])
@authentication_classes([BasicAuthentication , SessionAuthentication , TokenAuthentication])
@permission_classes([IsAuthenticated])
def selling_create(request):
    user = User.objects.get(username = request.user)
    gig = Gig.objects.get(id = request.data['id'])
    time = timezone.now()
    request.data['info']['Date_of_application'] = time
    request.data['info']['Account_id_of_customer'] = user.id
    serialized_applicant = Gig_Project_completed_serilizer(data = {**request.data['info']})
    if serialized_applicant.is_valid():
        applicant = serialized_applicant.create(serialized_applicant.validated_data)
        gig.Gig_Projects.add(applicant)
        approved_data = []
        print( request.data['Account_id'])
        account = Business_Account.objects.get(id = request.data['Account_id'])
        account = Business_account.objects.get(user = user)
        contract = {
            'Contract_owner_id' : gig.Account_id,
            'Type' : 'Selling',
            'Deadline' : gig.Gig_expiration_date,
            'Status' : 'false',
            'Gig_id' : gig.id,
            'Negotiated_price' : gig.Gig_salary,
            'Date_started' : time
        }
        serialized_contract = business_account_contract(data = contract)
        if serialized_contract.is_valid():
            created_contract = serialized_contract.create(serialized_contract.validated_data)
            account.Contracts.add(created_contract) 
        gigs_suggestions = account.Gigs.all()
        print(gigs_suggestions)
        for gig in gigs_suggestions :
            if (gig.id != request.data['id']):
                compacted = {}
                serialized_gig = gigs(gig , context={'request':request})
                compacted['Gig_name'] = serialized_gig.data['Gig_name']
                compacted['ShowCase_1'] = serialized_gig.data['ShowCase_1']
                compacted['Gig_id'] = gig.id
                approved_data.append(compacted)
            else :
                pass
        return Response(data = { 'Suggestions' : approved_data , 'Date' : time , 'contract_id' : created_contract.id , 'Selling_id' : appplicant.id} , status = status.HTTP_202_ACCEPTED)
    else :
        return Response(data = serialized_applicant.errors , status = status.HTTP_500_INTERNAL_SERVER_ERROR)



@api_view(['GET',])
@authentication_classes([BasicAuthentication , SessionAuthentication , TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_proposals_and_contracts(request):
    username = request.user
    user = User.objects.get(username = username)
    account = Business_Account.objects.get(user = user)
    notifications = account.Notifications.all().order_by('-Date')
    serialized_notifications = business_account_notifications(notifications , many=True)
    data = []
    for notification in notifications :
        return_data = {}
        return_data['notification'] = business_account_notifications(notification).data
        if (notification.Type == 'Hot deals'):
            try:
                gig_deal_applicant = Gig_Deal_Applicant.objects.get( id = notification.Type_id)
            except:
                print('Error')
            gig_deal_applicant_serializer = Gig_Deal_Applicant_serializer(gig_deal_applicant)
            user = User.objects.get(id = gig_deal_applicant_serializer.data['Account_id_of_customer'])
            account = Business_Account.objects.get(user = user)
            serialized_account = get_Account(account , context={'request':request})
            serialized_gig = gigs(Gig.objects.get(id = gig_deal_applicant.gig_id) , context={'request':request})
            return_data['Gig_info'] = {
                'Name' : serialized_gig.data['Gig_name'],
                'ShowCase_1' : serialized_gig.data['ShowCase_1']
            }
            return_data['Deal_info'] = gig_deal_applicant_serializer.data
            return_data['Applicant_info'] = {
                'Profile_pic' : serialized_account.data['Profile_pic'],
                'Name' : serialized_account.data['Name']
            }
            data.append(return_data)
        if (notification.Type == 'Selling'):
            try:
                gig_project_applicant = Gig_Project_Completed.objects.get(id = notification.Type_id)
            except:
                print('Error')
            gig_project_applicant = Gig_Project_Completed.objects.get(id = notification.Type_id)
            gig_Project_Completed_serializer = Gig_Project_Completed_serializer(gig_project_applicant)
            user = User.objects.get(id = gig_Project_Completed_serializer.data['Account_id_of_customer'])
            account = Business_Account.objects.get(user = user)
            serialized_account = get_Account(account , context={'request':request})
            serialized_gig = gigs(Gig.objects.get(id = gig_project_applicant.gig_id) , context={'request':request})
            return_data['Gig_info'] = {
                'Name' : serialized_gig.data['Gig_name'],
                'ShowCase_1' : serialized_gig.data['ShowCase_1']
            }
            return_data['Deal_info'] = gig_Project_Completed_serializer.data
            return_data['Applicant_info'] = {
                'Profile_pic' : serialized_account.data['Profile_pic'],
                'Name' : serialized_account.data['Name']
            }
            data.append(return_data)
        if (notification.Type == 'Hiring'):
            try:
                gig_applicant = Gig_Applicant.objects.get(id = notification.Type_id)
            except:
                print('Error')
            gig_applicant_serializer = Gig_Applicant_serializer(gig_applicant)
            user = User.objects.get(id = gig_applicant_serializer.data['Account_id_of_customer'])
            account = Business_Account.objects.get(user = user)
            serialized_account = get_Account(account , context={'request':request})
            serialized_gig = gigs(Gig.objects.get(id = gig_applicant.gig_id) , context={'request':request})
            return_data['Gig_info'] = {
                'Name' : serialized_gig.data['Gig_name'],
                'ShowCase_1' : serialized_gig.data['ShowCase_1']
            }
            return_data['Deal_info'] = gig_applicant_serializer.data
            return_data['Applicant_info'] = {
                'Profile_pic' : serialized_account.data['Profile_pic'],
                'Name' : serialized_account.data['Name']
            }
            data.append(return_data)
        if (notification.Type == 'Contract'):
            print(notification.Message)
            contract = account.Contracts.get(id = notification.Type_id)
            gig = Gig.objects.get(id = contract.Gig_id)
            user = User.objects.get(id = contract.Contract_owner_id)
            account = Business_Account.objects.get(user = user)

            serialized_contract = business_account_contract(contract)
            serialized_gig = gigs(gig , context={'request':request})
            serialized_account = get_Account(account , context={'request':request})

            return_data['Gig_info'] = {
                'Name' : serialized_gig.data['Gig_name'],
                'ShowCase_1' : serialized_gig.data['ShowCase_1'],
            }
            return_data['Contract_info'] = serialized_contract.data
            return_data['Applicant_info'] = {
                'Profile_pic' : serialized_account.data['Profile_pic'],
                'Name' : serialized_account.data['Name']
            }
            data.append(return_data)

    print(data)
    return Response(data = data , status = status.HTTP_200_OK)



@api_view(['PUT',])
@authentication_classes([BasicAuthentication , SessionAuthentication , TokenAuthentication])
@permission_classes([IsAuthenticated])
def approve_gig(request):
    type_of_deal = request.data['type']
    success = None
    if type_of_deal == 'Hot deals':
        gig_deal = Gig_Deal_Applicant.objects.get(id = request.data['gig_id'])
        gig_deal.Approved = 'True'
        gig_deal.save()
        user = User.objects.get(id = gig_deal.Account_id_of_customer)
        account = Business_Account.objects.get(user = user)
        contract = account.Contracts.get(Gig_id = gig_deal.gig_id , Type = 'Hot deals')
        contract.Status = 'Pending'
        contract.save()
        success = 'success'
    if type_of_deal == 'Selling':
        gig_project = Gig_Project_Completed.objects.get(id = request.data['gig_id'])
        gig_project.Approved = 'Pending'
        gig_project.save()
        user = User.objects.get(id = gig_project.Account_id_of_customer)
        account = Business_Account.objects.get(user = user)
        contract = account.Contracts.get(Gig_id = gig_project.gig_id , Type = 'Selling')
        contract.Status = 'Pending'
        contract.save()
        success = 'success'
    if type_of_deal == 'Hiring':
        gig_hiring = Gig_Applicant.objects.get(id = request.data['gig_id'])
        gig_hiring.Approved = 'Pending'
        gig_hiring.save()
        user = User.objects.get(id = gig_hiring.Account_id_of_customer)
        account = Business_Account.objects.get(user = user)
        contract = account.Contracts.get(Gig_id = gig_hiring.gig_id , Type = 'Hiring')
        contract.Status = 'Pending'
        contract.save()
        success = 'success'
    return Response(data = success , status = status.HTTP_202_ACCEPTED)

@api_view(['PUT',])
@authentication_classes([BasicAuthentication , SessionAuthentication , TokenAuthentication])
@permission_classes([IsAuthenticated])
def approve_finished_gig(request):
    type_of_deal = request.data['type']
    success = None
    if type_of_deal == 'Selling':
        gig_project = Gig_Project_Completed.objects.get(id = request.data['gig_id'])
        gig_project.Approved = 'True'
        gig_project.save()
        success = 'success'
    if type_of_deal == 'Hiring':
        gig_hiring = Gig_Applicant.objects.get(id = request.data['gig_id'])
        gig_hiring.Approved = 'True'
        gig_hiring.save()
        success = 'success'
    return Response(data = success , status = status.HTTP_202_ACCEPTED)




    


   


# ======================================End of fetching views======================================================



    

