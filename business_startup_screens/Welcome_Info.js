import React , {useState , useEffect} from 'react'
import { View , StyleSheet , Text , TouchableOpacity } from 'react-native'
import { Avatar } from 'react-native-elements'
import { ScreenHeight, ScreenWidth } from 'react-native-elements/dist/helpers'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import { Sae , Fumi , Kohana , Hoshi } from 'react-native-textinput-effects'
import {connect} from 'react-redux'

export function Welcome_Info(props) {
    const [Name , setName] = useState('')
    const [Contact , setContact] = useState('')

    //useEffect(()=>{
        //props.create_instance();
    //})

    return (
        <View style = {styles.container}>
            <View style = {{ top : 20 , alignItems : 'center' }}>   
            <View style = {{ justifyContent : 'space-around' , alignItems : 'center'  }}>
                <Avatar rounded containerStyle = {{ backgroundColor: props.state.theme.icons_surrounding , elevation : 10 }} icon = {{ name : 'user-plus' , color : props.state.theme.icons , type : 'font-awesome' }} size = {'medium'} />
                <Text style = {styles.disclaimer}>STEP 1 OF 8</Text>
            </View>
            <View style = {styles.input_container} >
            <Fumi
                style = {{ width : ScreenWidth-10 }}
                label={'Name'}
                iconClass={FontAwesomeIcon}
                iconName={'user-circle'}
                iconColor={props.state.theme.icons_surrounding}
                iconSize={20}
                iconWidth={40}
                inputPadding={16}
                inputStyle = {{ color : 'black' }}
                onChangeText = {text =>{
                    setName(text)
                }}
            />
            <Fumi
                keyboardType = {'numeric'}
                style = {{ width : ScreenWidth-10 }}
                label={'Contact'}
                iconClass={FontAwesomeIcon}
                iconName={'phone'}
                iconColor={props.state.theme.icons_surrounding}
                iconSize={20}
                iconWidth={40}
                inputPadding={16}
                inputStyle = {{ color : 'black' }}
                onChangeText = {text =>{
                    setContact(text)
                }}
            />
            
            
  </View>
  <View style = {{ position : 'relative' , bottom : -20 }}>
        <TouchableOpacity onPress = {
            async ()=>{
                props.destroyer()
                setTimeout(()=>{
                    props.create_instance();
                    props.send_info_name(Name)
                    props.send_info_contact(Contact)
                    console.log(props.state.Business_sign_up)
                },800)
                props.state.navigation.navigation.navigate('Step 2')

                
            }
        } style = {{ width : 180 , height : 42 , borderRadius :21  , backgroundColor : props.state.theme.icons_surrounding, justifyContent : 'center' , alignItems : 'center'  }}>
            <Text style = {{color : 'white'}}>Next</Text>
        </TouchableOpacity>

  </View>
  </View>

        </View>
    )
}
let mapStateToProps = (state) => {
    return {state}
}

let mapDispatchToProps = (dispatch) => ({
    create_instance : () => dispatch({type : 'initiate_business_sign_up'}),
    send_info_name : (Name) => dispatch({type : 'Business account' , key : 'Name' , value : Name}),
    send_info_contact : (Contact) => dispatch({type : 'Business account' , key : 'Contact' , value : Contact}),
    destroyer : () => dispatch({type : 'Business_account_destroyer'})

})

export default connect(mapStateToProps,mapDispatchToProps)(Welcome_Info)

const styles = StyleSheet.create({
    container : {
        flexDirection : 'column',
        alignItems : 'center',
        flex : 1,
    },
    disclaimer : {
        color : 'black',
        fontSize : 20,
        fontWeight : '700',
    },
    input_container : {
        position : 'relative',
        flexDirection : 'column',
        justifyContent : 'space-around',
        alignItems : 'center',
        height : 200,
        width : ScreenWidth ,
        elevation : 10

    }

})
