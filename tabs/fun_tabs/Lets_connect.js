
import React , {Component} from 'react'
import {View , Text , TextInput , Image , Button, StyleSheet, ScrollView } from 'react-native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { SpeedDial, Card, ListItem,  Icon , Avatar, BottomSheet} from 'react-native-elements';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Chats_bars from '../../components/Chats_bar.js'
import Chats_container from '../../components/Chats_container';
import * as animatable from 'react-native-animatable';

export default class Lets_connect extends Component {
    constructor(props){
        super(props)
    }
    
    render(){
        return (
                
                <View>
                    <Chats_bars/>
                    <Chats_container navigation = {this.props.navigation}/>
                    
                </View>
                
               
            
        )
    }
        
}

const styles = StyleSheet.create({
    header : {
        flexDirection : 'row',
        justifyContent : 'space-between',
    }
})