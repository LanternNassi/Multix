from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from Business_Accounts.models import Business_Account

# Create your tests here.

class AccountsTest(APITestCase):
    def testSignup(self):
        url = reverse('Business Account')
        data = {
            'Business account' : {
                'Name' : 'APITEST',
                'Multix_token' : '00000',
                'Password' : 'APITEST',
                'Contact' : '08989094',
                'Email' : 'APITEST@gmail.com',
                'Description' : 'Jhus for testing',
                'Place_of_residence' : 'Masaka',
                'Date_of_birth' : '2003-05-05',
                'Preference_1' : 'Swimming',
                'Preference_2' : 'Dancing',
                'Multix_general_account_id':'000',
                'Notifications_token' : 'E0001',
                'Rating' : 0
            },
            'Billing information' : {
                'Name_on_card' : 'JCB',
                'Expiration_date' : '2026-05-05',
                'Card_Number' : 1,
                'CVC' : 432
            },
            'Certifications' : [
                'PLE' , 'UCE' , 'UACE'
            ]
        }
        response = self.client.post(url,data , format='json')
        self.assertEqual(response.status_code , status.HTTP_201_CREATED)
        self.assertEqual(response.data['Account']['Name'] , 'APITEST')
        self.assertEqual(response.data['Billing information']['Name_on_card'] , 'JCB')
        self.assertEqual(response.data['Certifications'] , ['PLE' , 'UCE' , 'UACE'])


