import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Fun from './tabs/fun.js';
import business from './tabs/business.js';
import religion from './tabs/religion.js'
import tools from './tabs/tools.js';
import Settings from './tabs/Settings.js';
import {Card, ListItem, Button, Icon} from 'react-native-elements'
import React , {Component,useState} from 'react'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import * as animatable from 'react-native-animatable'
import { connect } from 'react-redux'

const Tab = createBottomTabNavigator();

function MyTabs({navigation}) {
  const nav = {navigation}
  const [anime,Setanime] = useState('')

 
  return (
    <Tab.Navigator initialRouteName = {Fun}  screenOptions = {{tabBarLabelPosition :'below-icon',
    tabBarShowLabel:'true', tabBarHideOnKeyboard : true,
    }}>
      <Tab.Screen  name="fun" component={Fun}
      options={{
        headerShown : false,
        tabBarIcon : ({ color, size}) => (
          <animatable.Text animation = {anime} iterationCount={'infinite'} direction="alternate">
          <MaterialCommunityIcons name = "heart-multiple" color = {color} size={26}/>
          </animatable.Text>
        ),
      }}/>
      <Tab.Screen name="business" component={business} options={{
        headerShown : false,
        tabBarIcon : ({ color, size}) => (
          <animatable.Text animation = {anime} iterationCount={'infinite'} direction="alternate-reverse">
          <MaterialCommunityIcons name = "battlenet" color = {color} size={26}/>
          </animatable.Text>
        ),
      }}/>
      <Tab.Screen name="tools" component={tools} options={{
        headerShown : false,
        tabBarIcon : ({ color, size}) => (
          <animatable.Text animation = {anime} iterationCount={'infinite'} direction="alternate">
          <MaterialCommunityIcons name = "cog" color = {color} size={26}/>
          </animatable.Text>
        ),
      }} />
      <Tab.Screen name="Maps" component={religion}  options={{
      headerShown : false,
        tabBarIcon : ({ color, size}) => (
          <animatable.Text animation = {anime} iterationCount={'infinite'} direction="alternate-reverse">
          <MaterialCommunityIcons name = "city-variant-outline" color = {color} size={26}/>
          </animatable.Text>
        ),
      }} />
      <Tab.Screen name="Settings" component={Settings} options={{
        headerShown : false,
        tabBarIcon : ({ color, size}) => (
          <animatable.Text animation = {anime} iterationCount={'infinite'} direction="alternate">
          <MaterialCommunityIcons name = "cog" color = {color} size={26}/>
          </animatable.Text>
        ),
      }} />
    </Tab.Navigator>
  );
}


export default MyTabs