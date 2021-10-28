import React , {Component , useEffect} from 'react'
import {Avatar} from 'react-native-elements'
import {View , Text , TextInput , Image , Button, StyleSheet} from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Header_business from '../constants/Header_business.js'
import Business_page from './business_tabs/Business_page.js'
import Hiring from './business_tabs/Hiring.js';
import transactions from './business_tabs/transactions.js'
import { createMaterialTopTabNavigator } from 'react-navigation-tabs'
import { createAppContainer } from 'react-navigation'
import {connect} from 'react-redux'
import * as SQLite from 'expo-sqlite'
import business_database from '../redux/Database_transactions.js'




const Tab_Navigator = createMaterialTopTabNavigator({
    Business : {
        screen :Business_page,
        navigationOptions : {
            tabBarLabel : 'Business',
        }},
    transactions : {
        screen : transactions,
        navigationOptions : {
            tabBarLabel : 'transact',
        }},
    
    Hiring : {
        screen : Hiring,
        navigationOptions : {
            tabBarLabel : 'Hiring',
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

const Navigator = createAppContainer(Tab_Navigator);


export function business(props) {
    useEffect(()=>{
        function fill_data(){
            let business_db = new business_database()
            let gigs = business_db.gig_data()
            return gigs
        }
        let Gigs = fill_data();
        props.store_gigs_redux(Gigs)
        props.create_request_instances((props.state.Business_profile.Account)?(props.state.Business_profile.Account.Multix_token) : ('000'))
        
    },
    [])
    return (
        <View style = {{flex : 1}}>
            <Header_business/>
            <Navigator>
                <Business_page/>
            </Navigator>
            
            
        </View>
    )
}
let mapStateToProps = (state) => {
    return {state}

}
let mapDispatchToProps = (dispatch) => ({
    store_gigs_redux : (Gigs) => dispatch({type : 'update_bus_profile' , key : 'Gigs' , value : Gigs}),
    create_request_instances : (token) => dispatch({ type : 'create_business_request_instances' , token : token })
})
export default connect(mapStateToProps , mapDispatchToProps)(business)

const styles = StyleSheet.create({
   
})
