from channels.generic.websocket import AsyncJsonWebsocketConsumer
import json
from django.utils import timezone
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from channels.db import database_sync_to_async
from exponent_server_sdk import (
    DeviceNotRegisteredError,
    PushClient,
    PushMessage,
    PushServerError,
    PushTicketError,
    
)
from requests.exceptions import ConnectionError, HTTPError

from Gigs.Serializers import (
    slicer_hot_deal_bidders,
    Gig_Deal_Applicant_serializer
)
from Business_Accounts.Serializers import (
    get_Account,
    business_account_notifications
) 
from Gigs.models import (
    Gig_Deal_Applicant,
    Gig_Project_Completed,
    Gig_Applicant,
    Gig,
)
from Business_Accounts.models import (
    Business_Account,
    Notification
) 

def send_push_message(token , title, message, extra=None):
    try:
        response = PushClient().publish(
            PushMessage(to=token,
                        title=title,
                        body=message,
                        category='Multix Business',
                        priority='high',
                        data=extra))
    
    except (ConnectionError, HTTPError) as exc:
        # Encountered some Connection or HTTP error - retry a few times in
        # case it is transient.
        print('error')
        pass
       
    try:
        # We got a response back, but we don't know whether it's an error yet.
        # This call raises errors so we can handle them with normal exception
        # flows.
        response.validate_response()
    except DeviceNotRegisteredError:
        # Mark the push token as inactive
        pass
        print('error')

class Gigs_consumer(AsyncJsonWebsocketConsumer):
    def authenticate_user(self,name_of_user):
        user = get_object_or_404(User , username = name_of_user)
        if user :
            return user
        else :
            return None
    
    async def connect(self):
        self.room_group_name = self.scope['url_route']['kwargs']['room_name']
        self.user = await database_sync_to_async(self.authenticate_user)(self.room_group_name) 
        if self.user :
            await self.accept()
            await self.channel_layer.group_add(
                self.room_group_name , self.channel_name
            )
        else :
            await self.close()

    def get_notifications_token(self,customer_id):
        account = Business_Account.objects.get(user = User.objects.get(id = customer_id))
        return account.Notifications_token

    def Save_notification(self,account_id,content,Type_id_contract):
        serialized_notification = business_account_notifications(data = content)
        if serialized_notification.is_valid():
            notification = serialized_notification.create(serialized_notification.validated_data)
            user = User.objects.get(id = account_id)
            account = Business_Account.objects.get(user = user)
            new_content = content
            new_content['Type'] = 'Contract'
            new_content['notifier_id'] = account_id
            new_content['Type_id'] = Type_id_contract
            new_notification = business_account_notifications(data = new_content)
            if new_notification.is_valid():
                created_notification = new_notification.create(new_notification.validated_data)
                print('done')
                our_account = Business_Account.objects.get(user = self.user)
                our_account.Notifications.add(created_notification)
                account.Notifications.add(notification)
                return True
        else : 
            return False
    
    async def receive_json(self , content):
        type_of_notification = content['type']
        if (type_of_notification == 'Bidding'):
            print('here')
            content['notification']['Message'] = '{} has bid on your gig {} with an amount of {}'.format(self.room_group_name,content['gig'],content['amount'])
            content['notification']['notifier_id'] = self.user.id
            Notifications_token = await database_sync_to_async(self.Save_notification)(content['account_id'],content['notification'],content['contract_type_id'])
            await self.channel_layer.group_send(
                content['Name'],
                {
                    'type' : 'Gig_Bidding',
                    'message' : '{} has bid on your gig {} with an amount of {}'.format(self.room_group_name,content['gig'],content['amount']),
                    'id' : self.user.id,
                }
            )
            send_push_message(Notifications_token ,'Multix Hot deals', content['notification']['Message'])
            print('sent')
        if (type_of_notification == 'Hiring'):
            content['notification']['Message'] = '{} has applied for your gig {} . Want to let him in ???'.format(self.room_group_name,content['gig'])
            content['notification']['notifier_id'] = self.user.id
            Notifications_token = await database_sync_to_async(self.Save_notification)(content['account_id'],content['notification'],content['contract_id'])
            await self.channel_layer.group_send(
                content['Name'],
                {
                    'type' : 'Gig_Hiring',
                    'message' : '{} has applied for your gig {} . Want to let him in ???'.format(self.room_group_name,content['gig']),
                    'id' : self.user.id,
                }
            )
            send_push_message(Notifications_token ,'Multix Hiring Gigs' ,content['notification']['Message'])
        if (type_of_notification == 'Selling'):
            content['notification']['Message'] = 'Seems {} is interested in your project {} . He wants to talk more with you '.format(self.room_group_name, content['gig'])
            content['notification']['notifier_id'] = self.user.id
            Notifications_token = await database_sync_to_async(self.Save_notification)(content['account_id'],content['notification'],content['contract_id'])
            await self.channel_layer.group_send(
                content['Name'],
                {
                    'type' : 'Gig_Selling',
                    'message' : 'Seems {} is interested in your project {} . He wants to talk more with you '.format(self.room_group_name, content['gig']),
                    'id' : self.user.id
                }
            )
            send_push_message(Notifications_token ,'Multix Selling Gigs', content['notification']['Message'])
        if (type_of_notification == 'Approve'):
            Message = 'Lol !!! {} has approved your gig {} . Its time to get our hands dirty for a second . For any queries try contacting our support or the client'.format(self.room_group_name , content['gig'])
            await self.channel_layer.group_send(
                content['Name'],
                {
                    'type' : 'Gig_approval',
                    'message' : Message,
                    'id' : self.user.id
                }
            )
        if (type_of_notification == 'finished'):
            Message = 'Congragulations !!! {} is pleased and has approved your gig {} . '.format(self.room_group_name , content['gig'])
            await self.channel_layer.group_send(
                content['Name'],
                {
                    'type' : 'Gig_approval',
                    'message' : Message,
                    'id' : self.user.id
                }
            )
            token = await database_sync_to_async(self.get_notifications_token)(content['account_id'])
            send_push_message(token ,'Multix Gig Approval', Message)

    async def disconnect(self , close_code):
        await self.channel_layer.group_discard(
            self.room_group_name , self.channel_name
        )
        await self.close()

    async def Gig_Bidding(self,event):
        await self.send_json(event)

    async def Gig_Hiring(self,event):
        await self.send_json(event)

    async def Gig_Selling(self,event):
        await self.send_json(event)

    async def Gig_approval(self , event):
        await self.send_json(event)