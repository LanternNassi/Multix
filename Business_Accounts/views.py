from django.shortcuts import render
from rest_framework.decorators import api_view , permission_classes , authentication_classes
from rest_framework.response import Response
from django.http import JsonResponse
from rest_framework.renderers import JSONRenderer
from rest_framework import status ,permissions 
from rest_framework.authentication import SessionAuthentication, BasicAuthentication, TokenAuthentication 
from rest_framework.permissions import IsAuthenticated , AllowAny
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
import json

#Importing Business_account serializers
from Business_Accounts.Serializers import (
    create_business_account_billing_serializer,
    create_business_account_certifications_serializer,
    create_business_accounts_serializer,
    business_account_contract,
    business_account_languages,
    business_account_notifications,
    business_account_transaction,
    Account_detail,
)

#Importing Gigs serializers
from Gigs.Serializers import (
    Gig_Applicant_serializer,
    Gig_Additional_info_serializer,
    Gig_Transaction_serializer,
    Gig_serializer,
    Gig_Project_completed_serilizer,
    
)

#Importing models
from Business_Accounts.models import (
    Business_Account,
    Billing_Information,
    Certifications,
    Language,
    Transaction,
    Contract,
    Notification,
)

#Importing Gig models
from Gigs.models import (
    Gig,
    Gig_Applicant,
    Gig_Additional_info,
    Gig_Project_Completed,
    Gig_Transaction
)




#View for creating a business account
@api_view(['POST',])
#@authentication_classes((BasicAuthentication ,SessionAuthentication, TokenAuthentication))
@permission_classes([])
def create_business_account(request):
    approved_data = {}
    print(request.data['Business account']['Date_of_birth'])
    #Creating a user at first
    created_user = User(username = request.data['Business account']['Name'] , password = request.data['Business account']['Password'])
    created_user.save()
    new_token = Token.objects.create(user = created_user)
    approved_data['Multix_token'] = new_token.key
    print(new_token.key)
    #Creating the business account
    serializer_account = create_business_accounts_serializer(data = {**request.data['Business account'] , 'Rating' : 2, 'Multix_token' : new_token.key})
    if serializer_account.is_valid():
        final = serializer_account.create(created_user , serializer_account.validated_data)
        approval_account = create_business_accounts_serializer(final)
        approved_data['Account'] = approval_account.data
        approved_data['id'] = final.id
        print("User created")
    else : 
        print(serializer_account._errors)
        #Returning any errors if there were errors in the information provided
        return Response(data = {'errors' : serializer_account._errors , 'from' : 'account'} )
    #Checking if Billing information was given or not
    if request.data['Billing information']  :
        serializer_billing = create_business_account_billing_serializer(data = request.data['Billing information'])
        if serializer_billing.is_valid():
            billing_info = serializer_billing.create(serializer_billing.validated_data)
            final.Billing_Info.add(billing_info)
            approved_billing_info = create_business_account_billing_serializer(billing_info)
            approved_data['Billing information'] = approved_billing_info.data
        else:
            print(serializer_billing._errors)
            #Returning any errors if there were errors in the information provided
            return Response(data = {'errors' : serializer_billing._errors , 'from' : 'billing'},)
    #Checking if Cerifications were given or not
    if request.data['Certifications'] :
        approved_data['Certifications'] = []
        for certificate in request.data['Certifications']:
            serializer_certifications = create_business_account_certifications_serializer(data = {'Certification_name': certificate })
            if serializer_certifications.is_valid():
                cert_info = serializer_certifications.create(serializer_certifications.validated_data) 
                final.Certifications.add(cert_info)
                approved_certifications = create_business_account_certifications_serializer(cert_info)
                approved_data['Certifications'].append(approved_certifications.data['Certification_name'])                     
            else :
                print(serializer_certifications._errors)
                return Response(data = {'errors' : serializer_certifications._errors , 'from' : 'cert'})
    return Response(data = approved_data , status = status.HTTP_201_CREATED)

#View function for validating the name to make sure that the user doesnt a name that is already in use by another client
@api_view(['POST'])
@permission_classes([])
def validate_name(request):
    """View function for validating the name to make sure that the user doesnt a name that is already in use by another client"""
    try : 
        # We only validate that the username exists when the query is successful 
        account = User.objects.get(username = request.data['Name'])
        return Response(data = {'mesage':'In use'},status = status.HTTP_207_MULTI_STATUS)
    except :
        # If the query is not successful or results into an error caught then it means there is no person with that username hence it is given 
        return Response(data = {'message' : 'true'} , status = status.HTTP_200_OK)

#View function for validating the phone number entered by the user to make sure that it is not used by another client
@api_view(['POST'])
@permission_classes([])
def validate_phone(request):
    """ View function for validating the phone number entered by the user to make sure that it is not used by another client"""
    try :
        # We only validate that the phone number exists when the query is successful 
        account = Business_Account.objects.get(Contact = request.data['Contact'])
        return Response(data = {'mesage':'In use'},status = status.HTTP_207_MULTI_STATUS)
    except :
        # If the query is not successful or results into an error caught then it means there is no person with that phone number hence it is given 
        return Response(data = {'message' : 'true'} , status = status.HTTP_200_OK)

#View for updating the profile picture during sign up
@api_view(['PUT'])
@permission_classes([])
def updating_profile_pic(request,id):
    """View for updating the profile picture during signup"""
    account = Business_Account.objects.get(id = id)
    account.Profile_pic = request.FILES['Pic']
    account.save()
    return Response(data = {'Mode' : 'Success'}, status = status.HTTP_202_ACCEPTED)

# View for updating the profile picture during normal use
@api_view(['PUT'])
@authentication_classes((BasicAuthentication ,SessionAuthentication, TokenAuthentication))
@permission_classes([IsAuthenticated])
def updating_profile_pic_account(request):
    """ View for updating the profile picture during normal use"""
    user = request.user
    account = User.objects.get(username=user)
    account_official = Business_Account.objects.get(user = account)
    account_official.Profile_pic = request.FILES['Pic']
    account_official.save()
    return Response(data = {'Mode' : 'Success'}, status = status.HTTP_202_ACCEPTED)


# View for updating the business profile 
@api_view(['PUT'])
@authentication_classes((BasicAuthentication ,SessionAuthentication, TokenAuthentication))
@permission_classes([IsAuthenticated])
def updating_business_profile(request):
    """View for updating the business profile """
    # Getting the name 
    user = request.user
    account = User.objects.get(username = user)
    business_account = Business_Account.objects.get(user = account)
    # mode is to refer to the type of category we updating 
    mode = request.data['mode']
    #if the mode falls in the category of the general Business information such as name , etc
    if ( mode == 'Business info' ):
        if (request.data['type'] == 'Skills'):
            prefs = {}
            counter = 1
            for i in request.data['update']['data']:
                prefs['Preference_' + str(counter)] = request.data['update']['data'][counter-1]  
                counter += 1
            business_serializer = create_business_accounts_serializer(business_account)
            sync_data = business_serializer.data
            sync_data['Preference_1'] = None
            sync_data['Preference_2'] = None
            sync_data['Preference_3'] = None
            sync_data['Preference_4'] = None
            overall_data = {**sync_data , **prefs }
            update_serializer = create_business_accounts_serializer(data = overall_data)
            if update_serializer.is_valid():
                updated_instance = update_serializer.update(business_account,update_serializer.validated_data)
                approved_data = create_business_accounts_serializer(updated_instance)
                return Response(data = approved_data.data , status = status.HTTP_202_ACCEPTED)
            else :
                return Response(data = update_serializer._errors,status = status.HTTP_304_NOT_MODIFIED)
           
        else :
            business_serializer = create_business_accounts_serializer(business_account)
            overall = { request.data['type'] : request.data['update']['data']  }
            overall_data = {**business_serializer.data , **overall }
            update_serializer = create_business_accounts_serializer(data = overall_data)
            if update_serializer.is_valid():
                updated_instance = update_serializer.update(business_account,update_serializer.validated_data)
                approved_data = create_business_accounts_serializer(updated_instance)
                return Response(data = approved_data.data , status = status.HTTP_202_ACCEPTED)
            else :
                return Response(data = update_serializer._errors,status = status.HTTP_304_NOT_MODIFIED)
    # if the mode being updated falls in the category of the Certificates
    if ( mode == 'Certifications' ):
        official_certs = []
        for i in request.data['update']['data']:
            cert = {}
            cert['Certification_name'] = i
            certs = create_business_account_certifications_serializer(data = cert )
            if certs.is_valid():
                certificate = certs.create(certs.validated_data)
                official_certs.append(certificate)
            else : 
                return Response(data = certs._errors , status = status.HTTP_304_NOT_MODIFIED)
        business_account.Certifications.set(official_certs) 
        business_account.save()
        return Response(data = create_business_account_certifications_serializer(official_certs , many = True).data , status = status.HTTP_202_ACCEPTED)
    # if the mode being updated falls in the category of the Languages spoken by the client
    if ( mode == 'Languages' ):
        official_Langs = []
        for i in request.data['update']['data']:
            Lang = {}
            Lang['Language'] = i
            Langs = business_account_languages(data = Lang )
            if Langs.is_valid():
                Language = Langs.create(Langs.validated_data)
                official_Langs.append(Language)
            else : 
                return Response(data = Langs._errors , status = status.HTTP_304_NOT_MODIFIED)
        business_account.Languages.set(official_Langs) 
        business_account.save()
        return Response(data = business_account_languages(official_Langs , many = True).data , status = status.HTTP_202_ACCEPTED)
    # if the mode being updated falls in the category of the Billing information
    if (mode == 'Billing information' ) :
        billing_info = business_account.Billing_Information.get(id = 1)
        initial = create_business_account_billing_serializer(billing_info)
        billing = create_business_account_billing_serializer( data = {  **initial.data ,**request.data['update']  } )
        if billing.is_valid():
            new_info = billing.update( billing_info , billing.validated_data)
            return Response(data = create_business_account_billing_serializer(new_info).data , status = status.HTTP_202_ACCEPTED)
    return Response(data = { 'mode' : 'Failed'} , status = status.HTTP_400_BAD_REQUEST )




# View function for collecting the account details of a client 
@api_view(['GET'])
@authentication_classes((BasicAuthentication ,SessionAuthentication, TokenAuthentication))
@permission_classes([IsAuthenticated])
def get_account_detail(request):
    """ View function for collecting the account details of a client """
    w = User.objects.get(username = request.user)
    account_id = request.GET.get('id',w.id)
    user = User.objects.get(id = account_id) 
    account = Business_Account.objects.get(user = user)
    serialized_account = Account_detail(account ,context = {'request' : request})
    return Response(data = serialized_account.data)
    



