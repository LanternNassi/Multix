import { registerRootComponent } from 'expo';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, ScrollView , FlatList , Image, Button} from 'react-native';
import { Card, ListItem, Icon, BottomSheet } from 'react-native-elements';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux'
import * as SplashScreen from 'expo-splash-screen';
import { ScreenWidth, ScreenHeight } from 'react-native-elements/dist/helpers';
import { Avatar } from 'react-native-elements/dist/avatar/Avatar';
import axios from 'axios'
import * as FileSystem from 'expo-file-system';
import * as SQLite from 'expo-sqlite'
import business_database from './redux/Database_transactions.js'
import Gig_notifications from './websockets/Gig_notifications.js'
import * as Notifications from 'expo-notifications'
import  notify from './websockets/Notifications.js' 
import fun_database from './redux/Database_fun_transactions.js'
import OneSignal from 'react-native-onesignal';
 


export class App extends React.Component {
  constructor(props){
    super(props)
  }
  state = {
    api_call : null,
    notopen : true,
    first_time : true,
  };
 

  async componentDidMount() {
    await downloadAssets()
    await this.performAPICalls();
    await this.prepareResources();

  }

  connect_phone_to_name(dict , number){
    if (dict[number]){
      return dict[number]
    } else {
      return 'unknown'
    }
  }


  async api_calls(contacts,chats_contacts,token) {
    await axios({
      method : 'POST',
      url : 'https://multix-fun.herokuapp.com/Check_contact_list',
      data : {'Contacts' : contacts},
      timeout : 1000000,
      headers : { 
        'content-type' : 'application/json',
        'Authorization': 'Token ' +  token ,
    }
  }).then(async(response) => {
      if (response.status === 200){
          this.setState({notopen : false})
          let resp = response.data
          this.props.store_fun_contacts_redux(resp)
          //setTimeout(()=>{
          //await this.update_db_connes(resp , chats_contacts)
          //},3000)
          
          axios({
            method : 'POST',
            url : 'https://multix-fun.herokuapp.com/Get_online_chats',
            data : {'connected_chats' : response.data},
            timeout : 100000,
            headers : { 
              'content-type' : 'application/json',

          }
          }).then(async(response_online)=>{
            if (response_online.status == 200){
             
              let matched_data = fun_database.online_chats(response_online.data , response.data)
              this.props.store_online_chats(matched_data)
            }
          },()=>{
            //console.log('here for chats')
            this.props.store_online_chats({})
          })
      }
  } , ()=>{
          //tx.executeSql('SELECT * FROM Chats_contacts',[],(tx , Result_set)=>{
              //if (this.state.first_time){
                this.props.store_online_chats({})
                this.props.store_fun_contacts_redux(chats_contacts)
              //}
         //},(error)=>{})
  } 
   )
   
  }

   //async intermediate(contacts,chats_contacts,token){
     //if (this.state.notopen){
      //await this.api_calls(contacts,chats_contacts,token)
      //setTimeout(async()=>{await this.intermediate(contacts,chats_contacts,token)},2000)
     //} 
     //else {
       //if (!this.props.fun.Refresh){
        //setTimeout(async()=>{await this.intermediate(contacts,chats_contacts,token)},2000)
      //} else {
        //this.setState({notopen : true})
        //setTimeout(async()=>{await this.intermediate(contacts,chats_contacts,token)},2000)         
      // }
     //}
 // }


  async performAPICalls() {
    const db = SQLite.openDatabase('Fun_database.db')
    let chats_contacts = []
    db.transaction((tx)=>{
      tx.executeSql('SELECT * FROM Chats_contacts',[],(tx , Result_set_contacts)=>{
        chats_contacts = Result_set_contacts.rows._array
        this.setState({ chats_contacts : chats_contacts })
    },(error)=>{console.log(error)})
      tx.executeSql('SELECT * FROM Account WHERE id = 1',[],(tx,result)=>{
        if (result.rows.length > 0){

          fun_database.get_contacts_list().then(async (contacts)=>{
            //console.log(contacts)
            await this.api_calls(contacts,chats_contacts,result.rows.item(0)['Multix_token'])
            //await this.intermediate(contacts,chats_contacts,result.rows.item(0)['Multix_token'])
            //await this.api_calls(contacts)
        
        })
        }
       
      })
    },(error)=>{},()=>{})
  
  }
  

  //  Loading messages and account data from the database
  async Load_Fun_Account_data(){
    const db = SQLite.openDatabase('Fun_database.db')
    let phone_names = await fun_database.get_contacts_with_name()
    db.transaction((tx)=>{
        tx.executeSql('SELECT * FROM Account WHERE id = 1',
        [],(tx , Result_set)=>{
          //console.log(Result_set.rows.item(0))
            if (Result_set.rows.length > 0){ 
              this.props.store_fun_profile_redux(Result_set.rows.item(0))
              let saved_contacts = []
              tx.executeSql('SELECT * FROM Chats_contacts',[],(tx,result)=>{saved_contacts = result.rows._array},(error)=>{console.log('error')})
              tx.executeSql('SELECT * FROM Messages' , [] , (tx , Result)=>{
                if (Result.rows.length > 0){
                 
                  //Reversing the list got from the database to give us the order
                  let reversed_messages = (Result.rows._array).reverse()
                  // A dictionary to hold the index values during iteration for easy reference
                  let index_holder = {}
                  // A list to hold the messages
                  let messages = []
                  // A dummy value to hold the index value for the next free item to come
                  let current_free_index = 0

                  // A dummy list to hold the current positions of all chats that will be update later
                  let positions = []

                  //Sorting the queried messages from the database using the for loop
                  for(let i = 0; i<Result.rows.length; i++){
                    let item = reversed_messages[i]
                    //Checking if the index is recorded in the index_holder or not 
                    if(index_holder[item.Server_id] === 0 || index_holder[item.Server_id]){
                      //If the index is already recorded in the database then jhus push the message in the list 
                      messages[index_holder[item.Server_id]]['Messages'].push({
                        'id' : item.id , 
                        'Contact' : item.Contact , 
                        'Message' : item.Message , 
                        'Status' : item.Status , 
                        'Date' : item.Date , 
                        'Receiving' : item.Receiving,
                        'Server_id' : item.Server_id,
                        'forwarded' : item.forwarded,
                        'Starred' : item.Starred,
                        'Replied' : item.Replied,
                        'Type' : item.Type,
                      })
                    } else {
                      //If the index doesnot exist in the index holder then declare it as a dictionary and record its index in the index holder
                      index_holder[item.Server_id] = current_free_index 
                      messages[current_free_index] = {}
                      //messages[current_free_index]['Name'] = item.Name
                      messages[current_free_index]['Server_id'] = item.Server_id
                      messages[current_free_index]['Contact_name'] = this.connect_phone_to_name(phone_names,item.Contact)
                      messages[current_free_index]['Name'] = item.Contact
                      //console.log(saved_contacts)
                      for(let i = 0; i<saved_contacts.length; i++){
                        if(saved_contacts[i].Server_id == item.Server_id){
                          messages[current_free_index]['Name'] = saved_contacts[i].Name
                          messages[current_free_index]['Contact_name'] = this.connect_phone_to_name(phone_names,saved_contacts[i].Contact)
                        } else {
                        }
                      }
                      messages[current_free_index]['Messages'] = []
                      messages[current_free_index]['Messages'].push({
                        'id' : item.id , 
                        'Contact' : item.Contact , 
                        'Message' : item.Message , 
                        'Status' : item.Status , 
                        'Date' : item.Date, 
                        'Receiving' : item.Receiving,
                        'Server_id' : item.Server_id,
                        'forwarded' : item.forwarded,
                        'Starred' : item.Starred,
                        'Replied' : item.Replied,
                        'Type' : item.Type,
                      })
                      positions.push({
                        'Server_id' : item.Server_id,
                        'index' : current_free_index,
                      })
                      current_free_index ++
                    }
                  }
                  //console.log('navigating')
                  // Storing the sorted messages into the redux store for future reference
                  this.props.store_messages_redux(messages)
                  // Storing the positions of the different names
                  this.props.store_positions_redux(positions)

                  // Navigating to the main screen after loading the messages 
                  this.props.navigation.navigate('Multix')
                } else {
                  this.props.store_messages_redux([])
                  this.props.store_positions_redux([])
                  this.props.navigation.navigate('Multix')

                }
              } )
            }else {
              //console.log('Coming')
                this.props.navigation.navigate('Personal info')
            }
        },(error) => {console.log(error)})
    }, (error)=>{},()=>{})
}

  /**
   * Method that serves to load resources and make API calls 
   */

  prepareResources =  async() => {
    // Setting handlers for push notifications
      const db = SQLite.openDatabase('Fun_database.db')
      db.transaction((tx)=>{
      tx.executeSql('SELECT * FROM Layout_Settings WHERE id = 1',[],async (tx,Result_colors)=>{
        if (Result_colors.rows.length > 0){
          //console.log(Result_colors.rows.item(0))
          this.props.store_Layout_settings(Result_colors.rows.item(0))
        } else {
          let defaults = await fun_database.default_setup_layout()
          this.props.store_Layout_settings(defaults)
        }
       },error => {console.log(error)})
      },(error)=>{},()=>{})
      //listening to changes of the push notifications from the server
      let profile = business_database.business_data();
      this.props.store_profile_redux(profile)

      let notifications_status = notify.init()
      if (notifications_status){
          Notifications.setNotificationHandler({
            handleNotification: async () => ({
              shouldShowAlert: true,
              shouldPlaySound: true,
              shouldSetBadge: true,
            }),
            handleSuccess : async () => {
              const badge_number = await Notifications.getBadgeCountAsync()
              await Notifications.setBadgeCountAsync(badge_number + 1)
            },
            handleError : async () => {

            },
          });
          Notifications.addNotificationReceivedListener((notification)=>{

          });
          Notifications.addNotificationResponseReceivedListener((notification)=>{

          })
           //Notifications categories 
          Notifications.setNotificationCategoryAsync(
            'Multix Messages',
          )   
          Notifications.setNotificationCategoryAsync('Multix Business')     
      }
       //getting data from the database
     
      //storing the apps navigations in redux
      this.props.action(this.props)
      //console.log('Request failed')
      await this.Load_Fun_Account_data()
  };


  render() {
      return (
        <View style={styles.container}>
        <Avatar rounded  size = {'xlarge'}  source = {require('./assets/Notifications.png')} />
      </View>
      )
  }
}

// Put any code you need to prepare your app in these functions


 /**
   * Method that downloads all assets databases on startup in most cases for the first time 
   */
async function downloadAssets(){
  const dir = await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'SQLite/')

  if (!dir.exists){
        alert('This is the first relese of the Multix app . The Multix engineering team would like to welcome you and hope to help them make Multix a better app through providing feedback in the settings section about some of the glitches found in the app , the new features you would like them to include ...etc   ')
        //console.log('Folder doesnt exist . Creating one ...')
        await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'SQLite/' )

        // Downloading the business database 
      await FileSystem.downloadAsync('https://multixapp.s3.af-south-1.amazonaws.com/Multix+databases/Business_database.db', FileSystem.documentDirectory + 'SQLite/Business_database.db').then((result) => {
        //console.log(result)
      }).catch((error) => {
        alert( 'Please connect to the internet seems something is wrong with your connection')
        this.props.navigation.goBack()
      })

      // Downloading the fun database
      await FileSystem.downloadAsync('https://multixapp.s3.af-south-1.amazonaws.com/Multix+databases/Fun_database.db', FileSystem.documentDirectory + 'SQLite/Fun_database.db').then((result) => {
        //console.log(result)
      }).catch((error) => {
        alert( 'Please connect to the internet seems something is wrong with your connection')
        this.props.navigation.goBack()
        })
  } else if (dir.exists) {
    //If dir exists meaning that the databases already exist 
        //console.log('Folder exists . Proceeding...')
      
  } 
  //console.log("done preparing local databases ....")

}


let mapStateToProps = (state_redux) => {
  let state = state_redux.business
  let fun = state_redux.fun
  return {state,fun}
}

let mapDispatchToProps = (dispatch) => ({
  action : (param) => {dispatch({type : 'Navigate' , navigation : param})},
  store_profile_redux : (Profile) => dispatch({type : 'update_business_profile' , value : Profile  }),
  start_gig_notifications : (Name) => dispatch({type : 'create_business_websocket_instances' , Name : Name}),
  store_fun_profile_redux : (profile) => dispatch({ type : 'store_fun_account_info' , Profile : profile }),
  store_messages_redux : (Messages) => dispatch({ type : 'Load_messages' , Messages : Messages }),
  store_positions_redux : (Positions) => dispatch({type : 'chats_positions' , list : Positions}),
  store_fun_contacts_redux : (contacts) => dispatch({ type : 'store_active_contacts' , Contacts : contacts }),
  store_online_chats : (online_chats) => dispatch({ type : 'online_chats' , Online_chats : online_chats }),
  store_Layout_settings : (content) => dispatch({type : 'Layout_Settings' , content : content})
})


export default connect(mapStateToProps,mapDispatchToProps)(App)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
    top : 20
  },
});





