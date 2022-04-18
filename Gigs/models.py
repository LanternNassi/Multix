from django.db import models
from django.utils.timezone import datetime



class Gig_Applicant(models.Model):
    gig_id = models.CharField(max_length=1000)
    Account_id_of_customer = models.CharField(max_length=200 , null = False , blank = False)
    Date_of_application = models.DateTimeField()
    Approved = models.CharField(default = False , max_length = 300)


class Gig_Project_Completed(models.Model):
    '''For managing Selling deals'''
    gig_id = models.CharField(max_length=200 )
    Account_id_of_customer = models.CharField(max_length=200)
    Date_of_application = models.DateTimeField()
    Extra_info = models.CharField(max_length = 10000)
    Approved = models.CharField(default=False , max_length = 300)


class Gig_Deal_Applicant(models.Model):
    '''For managing Hot deals '''
    gig_id = models.CharField(max_length = 200)
    Bid_amount = models.IntegerField(blank = False)
    Account_id_of_customer = models.CharField(max_length=200)
    Date_of_application = models.DateTimeField()
    Approved = models.CharField(default=False , max_length = 300)


class Gig_Transaction(models.Model):
    From_gig_id = models.CharField(max_length=200)
    To_gig_id = models.CharField(max_length=200)
    From_account_id = models.CharField(max_length=200)
    To_account_id = models.CharField(max_length=200)
    Date_of_transaction = models.DateField(auto_now_add=True)
    Transaction_id = models.CharField(max_length=200)

class Gig_Additional_info(models.Model):
    gig_id = models.CharField(max_length = 200)
    Name = models.CharField(max_length=200 , verbose_name="Names" , null= False , blank = False)
    File = models.FileField(blank = True , null = True , verbose_name = "Files")
    


class Gig(models.Model):
    """For creating a gig"""
    Account_id = models.CharField(max_length=200)
    Multix_token = models.CharField(max_length=200)
    Gig_type = models.CharField(verbose_name="Gig Types" , blank = False , null = False , max_length=10)
    Gig_name = models.CharField(verbose_name="Gig Names" , max_length=100 , blank=False )
    Gig_genre = models.CharField(verbose_name="Gig genre" , blank = False , null = False , default = "All" , max_length=100)
    Gig_description = models.CharField(verbose_name="Gig Descriptions" , max_length = 1000 , blank = False)
    Gig_date_of_creation = models.DateTimeField(verbose_name=" Dates " , auto_now_add=True)
    Gig_days_of_completion = models.IntegerField( null = True , blank = True )
    Gig_deadline = models.DateField(verbose_name='Deadlines' , null = True, auto_now_add=True)
    Gig_expiration_date = models.DateTimeField(verbose_name="Gig Expirations" ,null = True, blank = True )
    Gig_payment_mode = models.CharField(verbose_name="Payment modes", max_length=300,blank=False)
    Gig_salary = models.IntegerField(blank = False)
    Gig_location = models.CharField(verbose_name = 'Locations' , blank = True , null = True , default = 'Uganda' , max_length=100)
    Gig_negotiation = models.BooleanField(default=True , verbose_name="Negotiable")
    Gig_info = models.ManyToManyField(Gig_Additional_info)
    Gig_Applicants = models.ManyToManyField(Gig_Applicant)
    Gig_Projects = models.ManyToManyField(Gig_Project_Completed)
    Gig_Transactions = models.ManyToManyField(Gig_Transaction)
    Gig_Deals_Applicants = models.ManyToManyField(Gig_Deal_Applicant)
    ShowCase_1 = models.ImageField(null = True , blank = True , upload_to='ShowCase_1/%Y/%m/%d')
    ShowCase_2 = models.ImageField(null = True , blank = True, upload_to='ShowCase_2/%Y/%m/%d')
    ShowCase_3 = models.ImageField(null = True , blank = True, upload_to='ShowCase_3/%Y/%m/%d')
    ShowCase_4 = models.ImageField(null = True , blank = True, upload_to='ShowCase_4/%Y/%m/%d')
    def __str__(self):
        return (self.Gig_name)
























