from django.db import models
import datetime
from django.contrib.auth.models import User
from Gigs.models import Gig

# Business account models

class Billing_Information(models.Model):
    Card_Number = models.IntegerField( verbose_name= "Card numbers" , blank = False )
    Expiration_date = models.DateField(verbose_name="Expiration dates" , blank = False)
    Name_on_card = models.CharField(verbose_name="Names on Card" , blank = False , max_length=100)
    CVC = models.CharField(verbose_name="Nicknames" , blank = True , max_length=100)
    class Meta :
        verbose_name = 'Billinng Information'
        verbose_name_plural = 'Billing Information'
    
class Certifications(models.Model):
    Certification_name = models.CharField(verbose_name = "Certification Names" , blank = False , max_length = 30)
    class Meta:
        verbose_name = 'Certification'
        verbose_name_plural = 'Certifications'

class Language(models.Model):
    Language = models.CharField(verbose_name = "Certification Names" , blank = False , max_length = 30)
    class Meta : 
        verbose_name = 'Language'
        verbose_name_plural = 'Languages'

class Transaction(models.Model):
    From_gig_id = models.CharField(max_length=200 , null=True , blank = True)
    To_gig_id = models.CharField(max_length=200 , null = True , blank = True)
    From_account_id = models.CharField(max_length=200)
    To_account_id = models.CharField(max_length=200)
    Date_of_transaction = models.DateField(auto_now_add=True)

class Contract(models.Model):
    Contract_owner_id = models.CharField(max_length=100)
    Type = models.CharField(max_length = 300)
    Date_started = models.DateTimeField(auto_now_add=True)
    Deadline = models.DateTimeField(auto_now_add=True)
    Status = models.CharField(max_length= 100)
    Gig_id = models.CharField(max_length=200)
    Negotiated_price = models.CharField(max_length=3000)


class Notification(models.Model):
    notifier_id = models.CharField(max_length=20)
    Type_id = models.CharField(max_length = 300)
    Type = models.CharField(max_length=100)
    Message = models.CharField(max_length=5000)
    Date = models.DateTimeField()

class Review(models.Model):
    Reviewer_id = models.CharField(max_length = 100)
    Review = models.CharField(max_length = 2000)
    Reviewed_gig_id = models.CharField(max_length = 100)
    Date_of_review = models.DateTimeField(auto_now_add=True)
    Rating = models.IntegerField(blank = True , null = True)


class Business_Account(models.Model):
    user = models.ForeignKey(User , on_delete=models.CASCADE)
    Multix_general_account_id = models.CharField(verbose_name= 'general id' , blank = False , null = False , max_length = 100)
    Notifications_token = models.CharField(verbose_name='Notifications ids' , max_length=3000)
    Multix_token = models.CharField(verbose_name = "Multix ids", blank = False , max_length = 100)
    Name = models.CharField(verbose_name="Names",blank=False,max_length=100)
    Password = models.CharField(verbose_name="Passwords" , blank = False , null = False , max_length = 20)
    Contact = models.CharField(max_length=100,blank=False)
    Email = models.EmailField()
    Description = models.CharField(max_length=1000,verbose_name="Descriptions",blank = False , null = True)
    Place_of_residence = models.CharField(max_length=100 , blank = False ,)
    Date_of_birth = models.DateField(verbose_name="Dates of birth")
    Profile_pic = models.ImageField(upload_to='Profile_pics/%Y/%m/%d')
    Rating = models.IntegerField(blank = False , null = False )
    Date_of_creation = models.DateTimeField( default = datetime.datetime.now()  )
    Preference_1 = models.CharField(verbose_name="Preferences" , blank = True , null = True , max_length = 30)
    Preference_2 = models.CharField(verbose_name="Preferences" , blank = True , null = True , max_length = 30)
    Preference_3 = models.CharField(verbose_name="Preferences" , blank = True , null = True , max_length = 30)
    Preference_4 = models.CharField(verbose_name="Preferences" , blank = True , null = True , max_length = 30)
    Gigs = models.ManyToManyField(Gig)                          
    Billing_Info = models.ManyToManyField(Billing_Information)
    Certifications = models.ManyToManyField(Certifications)
    Transactions = models.ManyToManyField(Transaction)
    Languages = models.ManyToManyField(Language)
    Contracts = models.ManyToManyField(Contract)
    Notifications = models.ManyToManyField(Notification)
    Reviews = models.ManyToManyField(Review)
    class Meta:
        verbose_name = 'Business Account'
        verbose_name_plural = 'Business Accounts'
    def __str__(self):
        return self.Name + ' at token ' + self.Multix_token


