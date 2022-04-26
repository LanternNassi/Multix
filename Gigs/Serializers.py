from rest_framework import serializers
from .models import (
    Gig_Applicant,
    Gig_Project_Completed,
    Gig_Transaction,
    Gig_Additional_info,
    Gig,
    Gig_Deal_Applicant
)
from django.contrib.auth.models import User



# ======================================Start of Personal serializers======================================================


class Gig_Applicant_serializer(serializers.ModelSerializer):
    '''Class for serializing Gig Applicants(takes in all the fields of the Gig_Applicant i.e gig_id , Account_id_of_customer , Date_of_application , Approved) '''
    class Meta : 
        model = Gig_Applicant
        fields = '__all__'
    def create(self , validated_data):
        new_applicant = Gig_Applicant(**validated_data)
        new_applicant.save()
        return new_applicant
    def update(self , instance , validated_data):
        instance.user_id = validated_data.get('user_id' , instance.user_id)
        instance.Date_of_application = validated_data.get('Date_of_Application' , instance.Date_of_application)
        instance.save()
        return instance



class Gig_Deal_Applicant_serializer(serializers.ModelSerializer):
    """ class for serializing Gig_Deal_Applicant(fields taken : gig_id , Bid_amount , Account_id_of_customer , Date_of_application , Approved) """
    class Meta :
        model = Gig_Deal_Applicant
        fields = '__all__'
    def create(self , validated_data): 
        new_deal_applicant = Gig_Deal_Applicant(**validated_data)
        new_deal_applicant.save()
        return new_deal_applicant

class Gig_Project_completed_serilizer(serializers.ModelSerializer):
    '''Serializer for serializing gig active projects( fields taken : gig_id , Account_id_of_customer , Date_of_application , Extra_info , Approved) '''
    class Meta : 
        model = Gig_Project_Completed
        fields = '__all__'
    def create(self , validated_data):
        new_project = Gig_Project_Completed(**validated_data)
        new_project.save()
        return new_project
    def update(self , instance , validated_data):
        instance.gig_id = validated_data.get('gig_id' , instance.gig_id)
        instance.Account_id_of_customer = validated_data.get('Account_id_of_customer' , instance.Account_id_of_customer)
        instance.Date_of_application = validated_data.get('Date_of_application' , instance.Date_of_Application)
        instance.save()
        return instance

class Gig_Transaction_serializer(serializers.ModelSerializer):
    '''Serializer for serializing gig Transaction(fields taken : From_gig_id , To_gig_id , From_account_id , To_account_id , Date_of_transaction , Transaction_id )'''
    class Meta :
        model = Gig_Transaction
        field = '__all__'
    def create(self , validated_data):
        new_transaction = Gig_Transaction(**validated_data)
        new_transaction.save()
        return new_transaction
    def update(self , instance , validated_data):
        instance.From_gig_id = validated_data.get('From_gig_id' , instance.From_gig_id)
        instance.To_gig_id = validated_data.get('To_gig_id' , instance.To_gig_id)
        instance.From_account_id = validated_data.get('From_account_id' , instance.From_account_id)
        instance.To_account_id = validated_data.get('To_account_id' , instance.To_account_id)
        instance.Date_of_transaction = validated_data.get('Date_of_transaction' , instance.Date_of_transaction)
        instance.save()
        return instance

class Gig_Additional_info_serializer(serializers.ModelSerializer):
    '''Serializer for serializing gig additional info(fields taken : gig_id , Name ) '''
    class Meta : 
        model = Gig_Additional_info
        exclude = ['File']
    def create(self , validated_data):
        new_info = Gig_Additional_info(**validated_data)
        new_info.save()
        return new_info
    def update(self,instance,validated_data):
        instance.gig_id = validated_data.get('gig_id' , instance.gig_id)
        instance.Name = validated_data.get('Name' , instance.Name)
        instance.File = validated_data.get('File' , instance.File)
        instance.save()
        return instance

class Gig_serializer(serializers.ModelSerializer):
    """ Class for serializing Gig data (excluded fields : Gig_info , Gig_Applicants ,Gig_Projects, Gig_Transactions , Gig_Deals_Applicants , All ShowCases  ) """
    class Meta :
        model = Gig
        exclude = [
             'Gig_info',
             'Gig_Applicants',
             'Gig_Projects',
             'Gig_Transactions',
             'Gig_Deals_Applicants',
             'ShowCase_1',
             'ShowCase_2',
             'ShowCase_3',
             'ShowCase_4',
        ]
    def create(self , validated_data):
        new_Gig = Gig(**validated_data)
        new_Gig.save()
        return new_Gig
    def update(self , instance , validated_data):
        instance.Gig_type = validated_data.get('Gig_type' , instance.Gig_type)
        instance.Gig_name = validated_data.get('Gig_name' , instance.Gig_name)
        instance.Gig_genre = validated_data.get('Gig_genre' , instance.Gig_genre)
        instance.Gig_description = validated_data.get('Gig_description' , instance.Gig_description)
        instance.Gig_date_of_creation = validated_data.get('Gig_date_of_creation' , instance.Gig_date_of_creation)
        instance.Gig_days_of_completion = validated_data.get('Gig_days_of_completion' , instance.Gig_days_of_completion)
        instance.Gig_deadline = validated_data.get('Gig_deadline' , instance.Gig_deadline)
        instance.Gig_expiration_date = validated_data.get('Gig_expiraion_date' , instance.Gig_expiration_date)
        instance.Gig_payment_mode = validated_data.get('Gig_payment_mode', instance.Gig_payment_mode)
        instance.Gig_salary = validated_data.get('Gig_salary' , instance.Gig_salary)
        instance.Gig_location = validated_data.get('Gig_location' , instance.Gig_location)
        instance.Gig_negotiation = validated_data.get('Gig_negotiation' , instance.Gig_negotiation)
        instance.save()
        return instance


# ======================================End of Personal serializers======================================================


# ======================================Start of fetching serializers======================================================
class gigs (serializers.HyperlinkedModelSerializer):
    """ class for serializing basic gig info ( fields taken : Gig_info , Gig_Deals_Applicants , Gig_Projects , Gig_Applicants )  """
    Gig_info = Gig_Additional_info_serializer(many=True)
    Gig_Deals_Applicants = Gig_Deal_Applicant_serializer(many = True)
    Gig_Projects = Gig_Project_completed_serilizer(many = True)
    Gig_Applicants = Gig_Applicant_serializer(many = True)
    class Meta :
        model = Gig
        exclude = [
            'url'
        ]        
class slicer_gigs(serializers.Serializer):
    """ class for serializing also basic gig info for showcasing
        fields taken :
            Name
            Place_of_residence
            Profile_pic
            Rating
            Gig_name
            Gig_type
            Gig_date_of_creation
            Gig_salary
            ShowCase_1
            Gig_id
            Account_id
            Count
     """
    Name = serializers.CharField(required=True)
    Place_of_residence = serializers.CharField(required=True)
    Profile_pic = serializers.CharField()
    Rating = serializers.IntegerField()
    Gig_name = serializers.CharField(required=True)
    Gig_type = serializers.CharField(required=True)
    Gig_date_of_creation = serializers.CharField(required = True)
    Gig_salary = serializers.CharField(required=True)
    ShowCase_1 = serializers.CharField( required=None,initial='None')
    Gig_id = serializers.CharField()
    Account_id = serializers.CharField()
    Count = serializers.IntegerField()

class slicer_hot_deal_bidders(serializers.Serializer):
    """ class for serializing hot deal bidders ( fields taken : Name , Profile_pic , Bid_amount , Date_of_application) """
    Name = serializers.CharField(required=True)
    Profile_pic = serializers.CharField()
    Bid_amount = serializers.IntegerField()
    Date_of_application = serializers.DateTimeField()




# ======================================End of fetching serializers======================================================
