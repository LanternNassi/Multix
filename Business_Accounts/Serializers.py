from rest_framework import routers , serializers
from .models import *
from Gigs.Serializers import gigs







# ======================================Personal serializers======================================================

#For serializing Languages
class business_account_languages(serializers.ModelSerializer):
    class Meta : 
        model = Language
        fields = '__all__'
    def create(self , validate_data):
        new_language = Language(**validate_data)
        new_language.save()
        return new_language
    def update(self , instance , validated_data):
        instance.Language = validated_data.get('Language' , instance.Language)
        instance.save()
        return instance

class business_account_transaction(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = '__all__'
    def create(self , validated_data):
        new_Transaction = Transaction(**validated_data)
        new_Transaction.save()
        return new_Transaction
    def update(self , instance , validated_data):
        instance.From_gig_id = validated_data.get('From_gig_id' , instance.From_gig_id)
        instance.To_gig_id = validated_data.get('To_gig_id' , instance.To_gig_id)
        instance.From_account_id = validated_data.get('From_account_id' , instance.From_account_id)
        instance.To_account_id = validated_data.get('To_account_id' , instance.To_account_id)
        instance.Date_of_transaction = validated_data.get('Date_of_transaction' , instance.Date_of_transaction)
        instance.save()
        return instance

class business_account_contract(serializers.ModelSerializer):
    class Meta :
        model = Contract
        fields = '__all__'
    def create(self , validated_data):
        new_Contract = Contract(**validated_data)
        new_Contract.save()
        return new_Contract
    def update(self, instance , validated_data):
        instance.Contract_owner_id = validated_data.get('Contract_owner_id' , instance.Contract_owner_id)
        instance.Date_Started = validated_data.get('Date_Started' , instance.Date_Started)
        instance.Deadline = validated_data.get('Deadline' , instance.Deadline)
        instance.Status  = validated_data.get('Statue' , instance.Staus)
        instance.save()
        return instance

class business_account_reviews(serializers.ModelSerializer):
    class Meta :
        model = Review
        fields = '__all__'
    def create(self , validated_data):
        new_review = Review(**validated_data)
        new_review.save()
        return new_review
   

class business_account_notifications(serializers.ModelSerializer):
    class Meta : 
        model = Notification
        fields = '__all__'
    def create(self , instance , validated_data):
        new_notifications = Notification(**validated_data)
        new_notifications.save()
        return new_notifications
    def update(self , instance , validated_data):
        instance.Type = validated_data.get('Tyoe ', instance.Type)
        instance.Message = validated_data.get('Message' , instance.Message)
        instance.save()
        return instance

# For serializing a new object of the business_account_billing
class create_business_account_billing_serializer(serializers.ModelSerializer):
    class Meta:
        model = Billing_Information
        fields = '__all__'
    def create(self , validated_data):
        new_billin_info = Billing_Information(**validated_data)
        new_billin_info.save()
        return new_billin_info
    def update(self ,instance, validated_data  ):
        instance.Card_number = validated_data.get('Card_number' , instance.Card_number)
        instance.Name_on_card = validated_data.get('Name_on_card' , instance.Name_on_card)
        instance.Expiration_date = validated_data.get('Expiration_date' , instance.Expiration_date)
        instance.CVC = validated_data.get('CVC' , instance.CVC)
        instance.save()
        return instance

#For serializing a new object of the business_certifications
class create_business_account_certifications_serializer(serializers.ModelSerializer):
    class Meta:
        model = Certifications
        fields = '__all__'
    def create(self,validated_data):
        new_certification = Certifications( **validated_data)
        new_certification.save()
        return new_certification

    def update(self , instance, validated_data  ):
        instance.Certification_name = validated_data.get('Certification_name' , instance.Card_number)
        instance.save()
        return instance

# For serializing a new object of the business_account
class create_business_accounts_serializer(serializers.ModelSerializer):
    """ For creating a new business account and updating the account"""
    class Meta:
        model = Business_Account
        exclude = ["Profile_pic", "user" , 
        "Gigs" , "Billing_Info" , 
        "Certifications" , "Transactions" , 
        "Languages" , "Contracts" , "Reviews",
        "Notifications"]
    def create(self ,connected_account , validated_data):
        new_user = Business_Account(user = connected_account , **validated_data)
        new_user.save() 
        return new_user

    def update(self , instance , validated_data):
        instance.Email = validated_data.get('Email', instance.Email)
        instance.Contact = validated_data.get('Contact', instance.Contact)
        instance.Date_of_creation = validated_data.get('Date_of_creation', instance.Date_of_creation)
        instance.Name = validated_data.get('Name' , instance.Name)
        instance.Password = validated_data.get('Password' , instance.Password)
        instance.Description = validated_data.get('Description' , instance.Description)
        instance.Place_of_residence = validated_data.get('Place_of_residence' , instance.Place_of_residence)
        instance.Date_of_birth =  validated_data.get('Date_of_birth' , instance.Date_of_birth)
        instance.Preference_1 = validated_data.get('Preference_1' , instance.Preference_1)
        instance.Preference_2 = validated_data.get('Preference_2' , instance.Preference_2)
        instance.Preference_3 = validated_data.get('Preference_3' , instance.Preference_3)
        instance.Preference_4 = validated_data.get('Preference_4' , instance.Preference_4)
        instance.save()
        return instance


# ======================================End of Personal serializers======================================================





# ======================================Start of Fetching serializers====================================================
class get_Account(serializers.HyperlinkedModelSerializer):
    Certifications = create_business_account_certifications_serializer(many=True)
    Billing_Info = create_business_account_billing_serializer(many = True)
    Languages = business_account_languages(many = True)
    class Meta :
        model = Business_Account
        exclude = [
            'url',
            'Gigs',
             'user'
        ]
        
class Account_detail(serializers.HyperlinkedModelSerializer):
    Gigs = gigs(many=True )
    Billing_Info = create_business_account_billing_serializer(many=True)
    Certifications = create_business_account_certifications_serializer(many = True)
    Contracts = business_account_contract(many = True)
    Languages = business_account_languages(many = True)
    Notifications = business_account_notifications(many = True)
    Reviews = business_account_reviews(many = True)
    class Meta :
        model = Business_Account
        exclude = ['user','url']




# ======================================End of Fetching serializers======================================================
