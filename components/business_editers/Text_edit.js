import React, { Component , useState } from 'react'
import {View  , Text , StyleSheet , TouchableOpacity , Button , ScrollView} from 'react-native'
import { Avatar , Card} from 'react-native-elements'
import { connect } from 'react-redux'
import * as Animatable from 'react-native-animatable'
import { ScreenHeight, ScreenWidth } from 'react-native-elements/dist/helpers';
import { Sae , Fumi , Kohana , Hoshi } from 'react-native-textinput-effects'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import business_database from '../../redux/Database_transactions'
import * as SQLite from 'expo-sqlite'




const come_out = {
    0 : {
        top : ScreenHeight

    },
    0.5 : {
        top : 0.5 * ScreenHeight,

    },
    1 : {
        top : 0.1 * ScreenHeight,

    }

}

const collapse = {
    0 : {
        top : 0.1 * ScreenHeight,

    },
    0.5 : {
        top : 0.5 * ScreenHeight,


    },
    1 : {
        top : 3 * ScreenHeight

    }

}


export const Text_edit = (props) => {
    const [ value , setvalue ] = useState(props.value)
    const [ done , setdone ] = useState(false)

    const query_maker = ( type_of_profile , official_parameter) => {
        if (type_of_profile === 'business profile'){
            return 'UPDATE Business_account SET ' + official_parameter + ' = ?'
        } else if (type_of_profile === 'Gig'){
            return 'UPDATE Gigs SET ' + official_parameter + ' = ? WHERE Server_id = ?'  

        }
    }

    const update_profile = (type_of_profile , official_parameter , updated_value) =>{
        if (type_of_profile === 'business profile') {
            console.log(official_parameter , updated_value)
            
            const db = SQLite.openDatabase('Business_database.db')
            db.transaction((tx) => {
                tx.executeSql(query_maker(type_of_profile , official_parameter),
                [updated_value],(tx,Result_set) => {
                    console.log(Result_set)
                } , (error) =>{
                    console.log(error)
                })
            } , (error) => {} , () => {})

        } else if (type_of_profile = 'Gig') {
            console.log(props.id , official_parameter , updated_value)
            const db = SQLite.openDatabase('Business_database.db')
            db.transaction((tx) => {
                tx.executeSql(query_maker(type_of_profile , official_parameter),
                [updated_value,props.id],(tx,Result_set) => {
                    console.log('update successfull')
                } , (error) =>{
                    console.log(error)
                })
            } , (error) => {} , () => {})

        }
        
    }

        return (
            <Animatable.View animation = {props.action === 'come out' && !done ? come_out : collapse} style = {styles.container}>
                <ScrollView style = {{
                   
                }}>
                <Card containerStyle = {{
                    backgroundColor:'rgba(0,0,0,0.8)'
                }}>
                    <Card.Title style = {{
                        color : 'white'
                    }}> Change {props.type}</Card.Title>
                    <Card.Divider/>
                    <View style = {styles.text_input}>
                    { props.type === 'Description' ? (
                        <Fumi

                        onChangeText = {
                            (text) =>{
                                setvalue(text)
                            }
                        }
                        value = {value}
                        style = {{ width : 0.8 * ScreenWidth , borderWidth : 1  }}
                        label={props.type}
                        
                        iconClass={FontAwesomeIcon}
                        iconName={props.icon}
                        iconColor={props.state.theme.icons_surrounding}
                        iconSize={20}
                        height = {0.14 * ScreenHeight}
                        iconWidth={40}
                        inputPadding={16}
                        inputStyle = {{ color : 'black' }}
                        multiline = {true}
                        
                        
                    />
                    ) : (
                        <Fumi
                        onChangeText = {
                            (text) =>{
                                setvalue(text)
                            }
                        }
                        value = {value}
                        style = {{ width : 0.8 * ScreenWidth , borderWidth : 1 }}
                        label={props.type}
                        iconClass={FontAwesomeIcon}
                        iconName={props.icon}
                        iconColor={props.state.theme.icons_surrounding}
                        iconSize={20}
                        iconWidth={40}
                        inputPadding={16}
                        inputStyle = {{ color : 'black' }}
                        multiline = {true}
                        
                    />
                    ) }
                    
                    </View>
                    <Text style={{marginBottom: 8 , color : 'white'}}>
                        The idea with React Native Elements is more about component structure than actual design.
                        </Text>
                        <Card.Divider/>
                        <View style = {styles.buttons_container}>
                        <Button title = {'Confirm'} onPress = {
                            ()=>{
                                console.log('pressed')
                                if (props.effect === 'business profile'){
                                    let overall_data = {'update' : {data : value} , mode : props.mode , type : props.name }
                                    props.state.request_business_json({
                                        method : 'PUT',
                                        url : 'update_business_profile',
                                        data : overall_data,
                                    }).then((response) => {
                                        update_profile(props.effect,props.name,value)
                                        props.update_profile_account_redux(props.name , value)
                                        //let business_db = new business_database()
                                        //let profile = business_db.business_data()
                                        //setTimeout(()=>{
                                        //props.store_profile_redux(profile)
                                        //},3000)
                                    })
                                } else if ( props.effect === 'Gig' ){
                                    let data = props.type
                                    let overall_data = {'update' : {data : value} , mode : props.mode , Gig_id : props.id , type : props.name }
                                    //console.log(overall_data)
                                    props.state.request_business_json({
                                        method : 'PUT',
                                        url : 'update_gig',
                                        data : overall_data,
                                    }).then((response) => {
                                        update_profile(props.effect,props.name,value)
                                        //let business_db = new business_database()
                                        //let gigs = business_db.gig_data()
                                        //props.store_gigs_redux(gigs)
                                        props.update_profile_gigs_redux(props.id , props.name , value)
                                        //console.log(response.data)
                                    })
                                }
                                
                            }
                        }/>
                            
                            <Button onPress = {
                                () =>{
                                    setdone(true)
                                    
                                    setTimeout(()=>{
                                        props.notifier()
                                        setdone(false)
                                    },800)
                                }
                            } title = {'Cancel'} titleStyle = {{ color : 'white' }} />
                                
                            
                             
                        </View>
                </Card>
                </ScrollView>
            </Animatable.View>
        )

   


    
}

const mapStateToProps = (state) => {
    return {state}
    
}

const mapDispatchToProps = (dispatch) => ({
    notifier : () => dispatch({type : 'done' , decide : true}),
    //store_gigs_redux : (Gigs) => dispatch({type : 'update_bus_profile' , key : 'Gigs' , value : Gigs}),
    //store_profile_redux : (Profile) => dispatch({type : 'update_business_profile' , value : Profile  }),
    update_profile_account_redux : (name , value) => dispatch({ type : 'update_business_profile_account' , name : name , value : value }),
    update_profile_gigs_redux : (Server_id , name , value) => dispatch({ type : 'update_business_profile_gig' , name : name , value : value , Server_id : Server_id })
    
})

export default connect(mapStateToProps, mapDispatchToProps)(Text_edit)

const styles = StyleSheet.create({
    container : {
        position : 'absolute',
        
        
    },
    text_input : {
        height : 0.16 * ScreenHeight,
        width : 0.83 * ScreenWidth,
        justifyContent : 'center',
        alignItems : 'center',
    },
    buttons_container : {
        width : 0.82 * ScreenWidth,
        height : 0.08 * ScreenHeight,
        flexDirection :'row',
        justifyContent : 'space-around',
        alignItems : 'center',
    },
    button : {
        width : 0.4 * ScreenWidth,
        height : 48,
        borderRadius : 24,
        flexDirection : 'row',
        justifyContent : 'space-around',
        alignItems : 'center',
    }
})
