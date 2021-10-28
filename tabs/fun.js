import React , {Component} from 'react'
import {Avatar } from 'react-native-elements'
import {View , Text , TextInput , Image , Button, StyleSheet} from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Header from '../constants/Header.js';
import Chats_bar from '../components/Chats_bar.js'
import Sports from './fun_tabs/Sports.js'
import Lets_connect from './fun_tabs/Lets_connect.js';
import Hot_deals from './fun_tabs/Hot_deals.js';
import Profile from './fun_tabs/Profile.js';
import {createAppContainer} from 'react-navigation';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs'
import business_database from '../redux/Database_transactions.js'



const Tab = createMaterialTopTabNavigator({
    Connect : {
        screen : Lets_connect,
        navigationOptions : {
            tabBarLabel : 'Connect',
        },
    
    },
    Posts : {
        screen : Sports,
        navigationOptions : {
            tabBarLabel : 'Posts',
        }},
    Deals : {
        screen : Hot_deals,
        navigationOptions : {
            tabBarLabel : 'Deals',

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

export default class fun extends Component {
    constructor(props){
        super(props);
    }
    static router = Navigator.router;
    

    render() {
        return(
        <View style = {{flex : 1}}>
            <Header/>

            <Navigator/>
            

            
          
          </View>
        )
    }
}


