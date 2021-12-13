import * as SQLite from 'expo-sqlite'
import axios from 'axios'
import * as Contacts from 'expo-contacts';
import FormData, {getHeaders} from 'form-data'
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import {  Platform } from 'react-native';


export class fun_sign_up {
    constructor(info , profile_picture){
        this.info = info
        this.profile_picture = profile_picture
    }
  
    insert_to_db(db_info){
        let data = [
            db_info.Name , db_info.Password , db_info.Contact , db_info.Email , 
            db_info.Birth_date , db_info.Sign_up_date , db_info.Nickname , this.profile_picture ? this.profile_picture.uri : null,
            db_info.Hobby , db_info.Residence , db_info.Notifications_token , db_info.Multix_token , db_info.id
        ]
        console.log(data)
        const db = SQLite.openDatabase('Fun_database.db')
        db.transaction((tx)=>{
            tx.executeSql('INSERT INTO Account (Name , Password , Contact , Email , Birth_date , Sign_up_date , Nickname , Profile_photo , Hobby  , Residence , Notifications_token , Multix_token , Server_id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)' ,
             [...data],(tx , Result_set) => {
                if (Result_set.rowsAffected > 0) {
                   console.log('Inserted successfully')
                }
            } , (error) => {
                console.log('Error about inserting into profile')
            })
        },(error) =>{} , () => {})
    }

    async insert_contacts_to_db(Contacts){
        const db = SQLite.openDatabase('Fun_database.db')
        db.transaction((tx)=>{
            for( let i=0; i < Contacts.length; i++){
                let name = Contacts[i].Name
                let contact = Contacts[i].Contact
                let Server_id = Contacts[i].ID
                tx.executeSql('INSERT INTO Chats_contacts(Name , Contact , Server_id) VALUES (?,?)',
                [name , contact , Server_id],(tx,Result_set)=>{
                    console.log('done')
                },(error)=>{})
            }
        },(error)=>{},()=>{})
    }

    async update_contacts(token , navigator , profile){
        const { status } = await Contacts.requestPermissionsAsync();
        console.log(status)
        if (status === 'granted'){
            const { data } = await Contacts.getContactsAsync({
                fields: [Contacts.Fields.PhoneNumbers],
              });
              if (data.length>0){
                  let official_numbers = []
                  for(let i=0; i<data.length; i++){
                      try {
                        official_numbers.push(data[i].phoneNumbers[0].number)
                      } catch (error) {
                          console.log('no number')
                      }
                  }
                  axios({
                      method : 'POST',
                      url : 'http://multix-fun.herokuapp.com/Check_contact_list',
                      data : {'Contacts' : official_numbers},
                      headers : { 
                        'content-type' : 'application/json',
                        'Authorization': 'Token ' + token ,
                    }
                  }).then(async (response) => {
                      if (response.status === 200){
                          console.log(response.data)
                          await this.insert_contacts_to_db(response.data)
                          navigator(
                            {
                                ...profile,
                                'Server_id' : profile.id,
                                'Contacts' : response.data,
                            }
                          )
                      }
                  })
              }

        }
    }

    async registerForPushNotificationsAsync() {
        let token;
        if (Constants.isDevice) {
          const { status: existingStatus } = await Notifications.getPermissionsAsync();
          let finalStatus = existingStatus;
          if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
          }
          if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
          }
          const result = (await Notifications.getExpoPushTokenAsync()).data;
          if (result){
              token = result
          } else {
              token = 'E000'
          }
          //console.log(token);
        } else {
          alert('Must use physical device for Push Notifications');
        }
      
        if (Platform.OS === 'android') {
          Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
          });
        }
      
        return token;
      }

   
  
    async sign_up(navigator){
        let notification_token = await this.registerForPushNotificationsAsync() 
        axios({
            method : 'POST',
            url : 'http://multix-fun.herokuapp.com/SignUp',
            data : { 'info' : {...this.info, Notifications_token : notification_token}}
        }).then(async (response_1)=>{
            if (response_1.status === 201){
                console.log(response_1.data)
                if (this.profile_picture) {
                    const form_data = new FormData()
                    form_data.append('Profile_pic' , this.profile_picture)
                    axios({
                        method : 'PUT',
                        url : 'http://multix-fun.herokuapp.com/SignUp_profilePic',
                        data : form_data,
                        headers : { 
                            'content-type' : 'multipart/form-data',
                            'Authorization': 'Token ' + response_1.data['Multix_token'] ,
                        }
                    }).then(async (response) => {
                        if (response.status === 202){
                            this.insert_to_db(response_1.data)
                            await this.update_contacts(response_1.data['Multix_token'] , navigator , {
                                'Profile' : {...response_1.data , 'Profile_photo' : this.profile_picture.uri},
                            })
                        }
                    })
                } else {
                    this.insert_to_db(response_1.data)
                    await this.update_contacts(response_1.data['Multix_token'] , navigator , {
                        'Profile' : {...response_1.data , 'Profile_photo' : null},
                    })
                }
               
            }
        })

    }



}


export default fun_sign_up