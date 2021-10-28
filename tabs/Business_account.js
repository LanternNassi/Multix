import React, { Component } from 'react';
import {View , Text , StyleSheet } from 'react-native';
import {Avatar , Card } from 'react-native-elements';
import {connect} from 'react-redux';
import {CirclesLoader} from 'react-native-indicator';
import { ScreenHeight, ScreenWidth } from 'react-native-elements/dist/helpers';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
//Bringing in the tab screens
import Profile from './business_profile_tabs/Profile.js'
import Notifications from './business_profile_tabs/Notifications.js'
import Proposals from './business_profile_tabs/Proposals.js'
import Saved from './business_profile_tabs/Saved.js'
import Contracts from './business_profile_tabs/Contracts.js'
import * as animatable from 'react-native-animatable'
import * as SQLite from 'expo-sqlite'



const Tab = createBottomTabNavigator();





export class Business_account extends Component {
   
    state = {
        anime : ''
    }
    render() {
        return (
            <Tab.Navigator initialRouteName = {'PROFILE'}  screenOptions = {{tabBarLabelPosition :'below-icon',
            tabBarShowLabel:'true',
             tabBarHideOnKeyboard : true,
             
    }}>
      <Tab.Screen  name="PROFILE" component={Profile}
      options={{
        headerShown : false,
        tabBarIcon : ({ color, size}) => (
          <animatable.Text animation = {this.state.anime} iterationCount={'infinite'} direction="alternate">
          <MaterialCommunityIcons name = "account-circle" color = {color} size={26}/>
          </animatable.Text>
        ),
      }}/>
      <Tab.Screen name="CONTRACTS" component={Contracts} options={{
        headerShown : false,
        tabBarIcon : ({ color, size}) => (
          <animatable.Text animation = {this.state.anime} iterationCount={'infinite'} direction="alternate-reverse">
          <MaterialCommunityIcons name = "account-tie" color = {color} size={26}/>
          </animatable.Text>
        ),
      }}/>
      <Tab.Screen name="PROPOSALS" component={Proposals} options={{
        headerShown : false,
        tabBarIcon : ({ color, size}) => (
          <animatable.Text animation = {this.state.anime} iterationCount={'infinite'} direction="alternate">
          <MaterialCommunityIcons name = "account-switch" color = {color} size={26}/>
          </animatable.Text>
        ),
      }} />
      <Tab.Screen name="NOTIFICATIONS" component={Notifications}  options={{
      headerShown : false,
        tabBarIcon : ({ color, size}) => (
          <animatable.Text animation = {this.state.anime} iterationCount={'infinite'} direction="alternate-reverse">
          <MaterialCommunityIcons name = "comment-account" color = {color} size={26}/>
          </animatable.Text>
        ),
      }} />
      <Tab.Screen name="SAVED" component={Saved} options={{
        headerShown : false,
        tabBarIcon : ({ color, size}) => (
          <animatable.Text animation = {this.state.anime} iterationCount={'infinite'} direction="alternate">
          <MaterialCommunityIcons name = "content-save" color = {color} size={26}/>
          </animatable.Text>
        ),
      }} />
    </Tab.Navigator>
        )
    }
}

let mapDispatchToProps = (dispatch) => ({
  store_profile_redux : (Profile) => dispatch({type : 'update_business_profile' , value : Profile}),
  update_profile_redux : (key , value) => dispatch({type : 'business_profile_up' , key : key , value : value})

})
let mapStateToProps = (state) => {
    return {state}

}

export default connect( mapStateToProps , mapDispatchToProps )(Business_account)

const styles = StyleSheet.create({


})