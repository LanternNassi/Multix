import React , {Component} from 'react'
import {Avatar } from 'react-native-elements'
import {View , Text , TextInput , Image , Button, StyleSheet} from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Header from '../constants/Header.js';
import Chats_bar from '../components/Chats_bar.js'
import Posts from './fun_tabs/Posts.js'
import Lets_connect from './fun_tabs/Lets_connect.js';
import Profile from './fun_tabs/Profile.js';
import {createAppContainer} from 'react-navigation';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs'
import fun_database from '../redux/Database_fun_transactions.js'
import {connect} from 'react-redux';
import axios from 'axios'
import * as SQLite from 'expo-sqlite'




const Tab = createMaterialTopTabNavigator({
    Connect : {
        screen : Lets_connect,
        navigationOptions : {
            tabBarLabel : 'Connect',
        },
    
    },
    Posts : {
        screen : Posts,
        navigationOptions : {
            tabBarLabel : 'Posts',
        }},
   
    Profile : {
        screen : Profile,
        navigationOptions : {
            tabBarLabel : 'Profile',
        }},
    
}, {
    tabBarOptions : {
        showIcon : false,
        showLabel : true,
        style : {
            backgroundColor : '#006600',
            marginTop : 0,
        },
    }
});

const Navigator = createAppContainer(Tab);

export class fun extends Component {
    constructor(props){
        super(props);
    }

    state = {
        loading : false,
        open : false,
    }

    persist(){
        setTimeout(()=>{
            if (this.props.state.fun.Messages){
                axios({
                    method : 'GET',
                    url : 'http://multix-fun.herokuapp.com/Get_all_messages/',
                    timeout : 1000000,
                    headers : {
                        'content-type' : 'application/json',
                        'Authorization': 'Token ' + this.props.state.fun.Fun_profile['Multix_token'] ,
                    }
                }).then(async (response)=>{
                   // this.setState({open : true})
                    if (response.status === 200){
                        if (response.data.length > 0){
                            for (let i = 0; i<response.data.length; i++){
                                let index = fun_database.verify_if_number_exists(props.state.fun.Messages , response.data[i]['From'])
                                if (props.state.fun.Fun_profile.Server_id !== response.data[i]['From'] ){
        
                                    // Checking if the contact has any recent messages in our redux store
                                    if (index === 0 || index ){
                                        // Checking the type of the message whether its text or not
                                        if (response.data[i]['Type'] == 'text'){
                                                //if it is text and known to our redux store
                                                props.send_message( index , {
                                                    'id' : 'Not saved',
                                                    'Message' : response.data[i]['Message'],
                                                    'Receiving' : true,
                                                    'Date' : new Date().toString(),
                                                    'status' : 'delivered',
                                                    'Contact' :  response.data[i]['Contact'],
                                                    'Server_id' : response.data[i]['From'],
                                                    'forwarded' : response.data[i]['forwarded'],
                                                    'Starred' : false,
                                                    'Replied' : response.data[i]['Reply'],
                                                    'Type' : 'text',
                                                });
                                                props.update_chat_position(response.data[i]['From'])
                                                await fun_database.store_message_db({
                                                    'Contact' : response.data[i]['Contact'],
                                                    'Message' : response.data[i]['Message'],
                                                    'Status' : 'Delivered',
                                                    'Date' : new Date().toString(),
                                                    'Receiving' : true,
                                                    'Server_id' : response.data[i]['From'],
                                                    'forwarded' : response.data[i]['forwarded'],
                                                    'Starred' : false,
                                                    'Replied' : response.data[i]['Reply'],
                                                    'Type' : 'text'
                                                })
                    
                                        } else {
                                            //Then if it is not text and known to our redux store
                                            await fun_database.store_received_media(response.data[i]['Message'] , response.data[i]['Type']).then(async(resource)=>{
                                            await fun_database.store_message_db({
                                                'Contact' :  response.data[i]['Contact'],
                                                'Message' : resource,
                                                'Status' : 'Downloaded',
                                                'Date' : new Date().toString(),
                                                'Receiving' : true,
                                                'Server_id' :response.data[i]['From'],
                                                'forwarded' : response.data[i]['forwarded'],
                                                'Starred' : false,
                                                'Replied' : response.data[i]['Reply'],
                                                'Type' : response.data[i]['Type']
                                            })
                                            props.send_message( index , {
                                                'id' : 'Not saved',
                                                'Message' : resource,
                                                'Receiving' : true,
                                                'Contact' :  response.data[i]['Contact'],
                                                'Date' : new Date().toString(),
                                                'status' : 'delivered',
                                                'Server_id' : response.data[i]['From'],
                                                'forwarded' : response.data[i]['forwarded'],
                                                'Starred' : false,
                                                'Replied' : response.data[i]['Reply'],
                                                'Type' : response.data[i]['Type'],
                                            });
                                            props.update_chat_position(response.data[i]['From'])
                                            })
                    
                                        }
                                        // If he is a newbie then we proceed we the code below
                                    } else {
                                        if (message['Type'] == 'text'){
                                            //if they are a newbie and not known to the redux store while the message is text
                                            let info = {
                                                    'Name' :  response.data[i]['Name'],
                                                    'Server_id' : message['From'],
                                                    'Contact_name' : '@unknown',
                                                    'Messages' : [
                                                        { 
                                                            'id' : 'Not saved',
                                                            'Contact' :  response.data[i]['Contact'],
                                                            'Message' :  response.data[i]['Message'],
                                                            'Receiving' : true,
                                                            'Date' : new Date().toString(),
                                                            'status' : 'delivered',
                                                            'Server_id' :  response.data[i]['From'],
                                                            'forwarded' :  response.data[i]['forwarded'],
                                                            'Starred' : false,
                                                            'Replied' :  response.data[i]['Reply'],
                                                            'Type' : 'text'
                                                        }
                                                    ]
                                                }
                                                props.send_message_new(info)
                                                props.create_new_chat_position({
                                                    'Server_id' : message['From'],
                                                    'Index' : (props.state.fun.Messages.length-1),
                                                })
                                                await fun_database.store_message_db({
                                                'Contact' :  response.data[i]['Contact'],
                                                'Message' :  response.data[i]['Message'],
                                                'Status' : 'Delivered',
                                                'Date' : new Date().toString(),
                                                'Receiving' : true,
                                                'Server_id' :  response.data[i]['From'],
                                                'forwarded' :  response.data[i]['forwarded'],
                                                'Starred' : false,
                                                'Replied' :  response.data[i]['Replied'],
                                                'Type' : 'text'
                                                })
                                            
                                            
                                        } else {
                                            //if they are a newbie and the message is not text
                                            await fun_database.store_received_media(message['Message'] , message['Type']).then(async(resource)=>{
                                                await fun_database.store_message_db({
                                                //'Contact' : message['Contact'],
                                                'Message' : resource,
                                                'Status' : 'Downloaded',
                                                'Date' : new Date().toString(),
                                                'Receiving' : true,
                                                'Server_id' : response.data[i]['From'],
                                                'forwarded' :response.data[i]['forwarded'],
                                                'Starred' : false,
                                                'Replied' : response.data[i]['Replied'],
                                                'Type' : response.data[i]['Type']
                                                })
                                                let info = {
                                                //'Name' : response.data[i]['Name'],
                                                'Server_id' : response.data[i]['From'],
                                                'Contact_name' : '@unknown',
                                                'Messages' : [
                                                    { 
                                                        'id' : 'Not saved',
                                                        //'Contact' : message['Contact'],
                                                        'Message' :resource,
                                                        'Receiving' : true,
                                                        'Date' : new Date().toString(),
                                                        'status' : 'delivered',
                                                        'Server_id' : response.data[i]['From'],
                                                        'forwarded' : response.data[i]['forwarded'],
                                                        'Starred' : false,
                                                        'Replied' : response.data[i]['Reply'],
                                                        'Type' : response.data[i]['Type']
                                                    }
                                                ]
                                            }
                                            props.send_message_new(info)
                                            props.create_new_chat_position({
                                                'Server_id' : response.data[i]['From'],
                                                'Index' : (props.state.fun.Messages.length-1),
                                            })
                                            })
                                        }
                    
                                    }
                                    
                                        
                                }
                    
                            }
                        }
                    }
                })
                //console.log(this.props.state.fun.Contacts)
            }
            if (this.props.state.fun.Connected){
                let contacts = []
                const db = SQLite.openDatabase('Fun_database.db')
                db.transaction((tx)=>{
                    tx.executeSql('SELECT * FROM Chats_contacts',[],(tx,result)=>{
                        contacts = Result_set_contacts.rows._array
                    },(error)=>{})
                },(error)=>{},()=>{})
                fun_database.update_db_connes(this.props.state.fun.Contacts , contacts)
                }
                 
            
            //this.persist()
        
        // else {
          //  if (!this.props.state.fun.Refresh){
            //    this.persist()
            //} else {
              //  this.setState({ open : false })
                //this.persist()
            //}
        //}
        },1000)
    }

    componentDidMount(){
        if (this.props.state.fun.Messages){
            this.persist()
        }
        //console.log(this.props.state.fun)
    }
    static router = Navigator.router;
    render() {
        return(
        <View style = {{flex : 1}}>
            <Header/>
            <Lets_connect />
          </View>
        )
    }
}

let mapStateToProps = (state) => {
    return {state}
}
let mapDispatchToProps = (dispatch) => ({
    update_chat_position : (Server_id) => dispatch({type : 'update_chats_positions' , Server_id : Server_id }),
    store_online_chats : (online_chats) => dispatch({ type : 'online_chats' , Online_chats : online_chats }),
    send_message_new : (content) => dispatch({type : 'new_chats' , content : content}),
    send_message : (Index,message ) => dispatch({type : 'message_handler', content : message , Index : Index }),
    update_messages : (Name , Content) => dispatch({ type : 'update_messages' , Name : Name , Content : Content}),
    create_new_chat_position : (Values) => dispatch({ type : 'new_chats_position' , New : Values }),

})

export default connect(mapStateToProps , mapDispatchToProps)(fun)
