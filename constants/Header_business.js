import React , {Component,useState,useEffect} from 'react'
import {Avatar} from 'react-native-elements'
import {View , Text , TextInput , Image , Button, StyleSheet , TouchableOpacity} from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import * as animatable from 'react-native-animatable';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { ScreenWidth } from 'react-native-elements/dist/helpers';
import Theme from './Theme.js';
import {connect} from 'react-redux';


export function Header_business(props){
    const [theme , settheme] = useState(Theme.purger)
    const [Profile_pic , setProfile_pic] = useState((props.state.Business_profile.Account) ? (props.state.Business_profile.Account.Profile_pic):(null))
    useEffect(()=>{
        console.log('changed')
    },[props.state.Business_profile.Account.Profile_pic])
    return(
        <View style = {styles.container}>
                <View style = {styles.header}>
                    <View style = {{flex : 2}}>
                        <Text style = {{ fontSize : 29, marginLeft : 8, fontWeight : '800' }} >MULTIX</Text>
                    </View>
                    <View style = {{ flexDirection : 'row' , justifyContent : 'space-around' , alignItems : 'center' , flex:1.5 }}>
                        <TouchableOpacity>
                        <Avatar containerStyle = {{elevation : 4 , backgroundColor : props.state.theme.icons_surrounding}} rounded size = 'small' icon = {{ name : 'search' , color : theme.icons, type : 'font-awesome'  }} />
                        </TouchableOpacity>
                        <TouchableOpacity style = {styles.pic} onPress = {
                            () =>{
                                props.state.Business_profile['Account'] ? (
                                    props.state.navigation.navigation.navigate('Business Profile')
                                    ) : ('')
                            }
                        }>
                        <Avatar containerStyle = {{elevation : 4 , backgroundColor : props.state.theme.icons_surrounding}} rounded  size = 'small' source = {Profile_pic?({uri : props.state.Business_profile.Account.Profile_pic}):(require('../assets/Male_no_profile_pic.jpg'))}/>
                        </TouchableOpacity>
                    </View>
                </View>
            
            </View>


    )
}
const mapStateToProps = (state) => {
    return {state};
}

const mapDispatchToProps = (dispatch) => ({

})

export default connect(mapStateToProps,mapDispatchToProps)(Header_business)

const styles = StyleSheet.create({
    container : { 
        backgroundColor : 'white',
        height : 100,
        width : '100%',
        top : 0,
        elevation : 0,
        
        
    } ,
    header : {
        flexDirection : 'row',
        justifyContent : 'space-between',
        alignItems : 'center',
        marginTop : 47
        
    },
    pic : {
        width : 40,
        height : 40 ,
        borderRadius : 20,
        backgroundColor : 'white',
        justifyContent : 'center',
        alignItems : 'center',
        elevation : 8 ,
    }

})




            