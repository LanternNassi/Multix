import React , {Component} from 'react'
import { View , StyleSheet , Text , TouchableOpacity } from 'react-native'
import { Avatar } from 'react-native-elements'
import { ScreenHeight, ScreenWidth } from 'react-native-elements/dist/helpers'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import { Sae , Fumi , Kohana , Hoshi } from 'react-native-textinput-effects'
import {connect} from 'react-redux'
import { CreditCardInput, LiteCreditCardInput } from "react-native-credit-card-input";

export class Screen_4_Billing extends Component  {
    state = {
        form_data : ''
    }
    _onChange = (form) => {
        console.log(form)
        this.setState({form_data : form})
        
    }
    render = () =>{
        return (
            <View style = {styles.container}>
                <View style = {{ top : 20 , alignItems : 'center' }}>   
                <View style = {{ justifyContent : 'space-around' , alignItems : 'center'  }}>
                    <Avatar rounded containerStyle = {{ backgroundColor: this.props.state.theme.icons_surrounding , elevation : 10 }} icon = {{ name : 'credit-card-alt' , color : this.props.state.theme.icons , type : 'font-awesome' }} size = {'medium'} />
                    <Text style = {styles.disclaimer}>BILLING INFORMATION</Text>
                </View>
                <View style = {styles.input_container} >
                <CreditCardInput autofocus
                allowScroll = {true}
                 onChange={this._onChange}
                 />
      </View>
      <View style = {{ position : 'relative' , bottom : -20 }}>
            <TouchableOpacity onPress = {
                () => {
                    this.props.send_info_Name(this.state.form_data.values.type)
                    this.props.send_info_Number(this.state.form_data.values.number)
                    this.props.send_info_expiry(this.state.form_data.values.expiry)
                    this.props.send_info_cvc(this.state.form_data.values.cvc)
                    this.props.state.navigation.navigation.navigate('Profile Picture')
                }
            } style = {{ width : 180 , height : 42 , borderRadius :21  , backgroundColor : this.props.state.theme.icons_surrounding, justifyContent : 'center' , alignItems : 'center'  }}>
                <Text style = {{color : 'white'}}>Next</Text>
            </TouchableOpacity>
    
      </View>
      <View style = {{ position : 'relative' , top : 40  }}>
            <TouchableOpacity onPress = {
                () => {
                    this.props.state.navigation.navigation.navigate('Profile Picture')
                }
            } style = {{ width : 180 , elevation : 20, height : 42 , borderRadius :21  , backgroundColor : this.props.state.theme.icons_surrounding, justifyContent : 'center' , alignItems : 'center'  }}>
                <Text style = {{color : 'white'}}>Skip for now</Text>
            </TouchableOpacity>
      </View>
      </View>
    
            </View>
        )
    }
    
}
let mapStateToProps = (state) => {
    return {state}
}

let mapDispatchToProps = (dispatch) => ({
    send_info_Name : (Name) => dispatch({type : 'Billing information' , key : 'Name_on_card' , value : Name}),
    send_info_Number : (Number) => dispatch({type : 'Billing information' , key : 'Card_Number' , value : Number }),
    send_info_expiry : (Expiry) =>{ 
        let split_date = Expiry.split("/")
        let final_date = "20" + split_date[1] + "-" + split_date[0] + "-" + "01" 
        console.log(final_date)
        dispatch({type : 'Billing information' , key : 'Expiration_date' , value : final_date })},
    send_info_cvc : (cvc) => dispatch({type : 'Billing information' , key : 'CVC' , value : cvc }),

})

export default connect(mapStateToProps,mapDispatchToProps)(Screen_4_Billing)

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
        height : 300,
        width : ScreenWidth ,
        elevation : 10

    }

})
