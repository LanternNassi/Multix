import React , {useState} from 'react'
import { View , StyleSheet , Text , TouchableOpacity,ScrollView, Modal } from 'react-native'
import { Avatar } from 'react-native-elements'
import { ScreenHeight, ScreenWidth } from 'react-native-elements/dist/helpers'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import { Sae , Fumi , Kohana , Hoshi } from 'react-native-textinput-effects'
import {connect} from 'react-redux'

export function Screen_2(props) {
    const [Email , setEmail] = useState('')
    const [Residence , setResidence] = useState('')
    const [Password , setPassword] = useState('')
    return (
        <ScrollView style = {styles.container}>
            
            <View style = {{ top : 20 , alignItems : 'center' }}>   
            <View style = {{ justifyContent : 'space-around' , alignItems : 'center'  }}>
                <Avatar rounded containerStyle = {{ backgroundColor: props.state.theme.icons_surrounding , elevation : 10 }} icon = {{ name : 'user-plus' , color : props.state.theme.icons , type : 'font-awesome' }} size = {'medium'} />
                <Text style = {styles.disclaimer}>STEP 2 OF 8</Text>
            </View>
            <View style = {styles.input_container} >
            <Fumi
                style = {{ width : ScreenWidth-10 }}
                label={'Email'}
                iconClass={FontAwesomeIcon}
                iconName={'envelope'}
                iconColor={props.state.theme.icons_surrounding}
                iconSize={20}
                iconWidth={40}
                inputPadding={16}
                inputStyle = {{ color : 'black' }}
                onChangeText = { text => {
                    setEmail(text)
                } }
            />
            <Fumi
                style = {{ width : ScreenWidth-10 }}
                label={'Residence'}
                iconClass={FontAwesomeIcon}
                iconName={'institution'}
                iconColor={props.state.theme.icons_surrounding}
                iconSize={20}
                iconWidth={40}
                inputPadding={16}
                inputStyle = {{ color : 'black' }}
                onChangeText = { text => {
                    setResidence(text)
                } }
            />
            <Fumi
                passwordRules = {'required : upper ; required : lower ; required : digit ; minlength : 6 ;'}
                style = {{ width : ScreenWidth-10 }}
                label={'Password'}
                iconClass={FontAwesomeIcon}
                iconName={'low-vision'}
                iconColor={props.state.theme.icons_surrounding}
                iconSize={20}
                iconWidth={40}
                inputPadding={16}
                inputStyle = {{ color : 'black' }}
                onChangeText = { text => {
                    setPassword(text)
                }}
            />
            
            
  </View>
  <View style = {{ position : 'relative' , height : ScreenHeight * 0.2 , top : 50 , bottom : 0 }}>
        <TouchableOpacity onPress = {
            () => {
                props.send_info_email(Email)
                props.send_info_password(Password)
                props.send_info_residence(Residence)
                props.state.navigation.navigation.navigate('Step 3')
            }
        } style = {{ width : 180 , height : 42 , borderRadius :21  , backgroundColor : props.state.theme.icons_surrounding, justifyContent : 'center' , alignItems : 'center'  }}>
            <Text style = {{color : 'white'}}>Next</Text>
        </TouchableOpacity>

  </View>
  </View>

        </ScrollView>
    )
}
let mapStateToProps = (state) => {
    return {state}
}

let mapDispatchToProps = (dispatch) => ({
    send_info_email : (Email) => dispatch({ type : 'Business account' , key : 'Email' , value : Email  }),
    send_info_residence : (Residence) => dispatch({type : 'Business account' , key : 'Place_of_residence' , value : Residence  }),
    send_info_password : (Password) => dispatch({type : 'Business account' , key : 'Password' , value : Password  })

})

export default connect(mapStateToProps,mapDispatchToProps)(Screen_2)

const styles = StyleSheet.create({
    container : {
        flexDirection : 'column',
        //justifyContent : 'center',
        //alignItems : 'center',
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
        height : ScreenHeight * 0.5,
        width : ScreenWidth ,
        

    }

})
