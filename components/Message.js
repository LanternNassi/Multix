import React, { Component } from 'react'
import { View , Text , TouchableOpacity , StyleSheet } from 'react-native';
import { Avatar } from 'react-native-elements'
import { connect } from 'react-redux';
import { ScreenWidth, ScreenHeight } from 'react-native-elements/dist/helpers';

export class Message extends Component {
    constructor(props){
        super(props)
    }
    render() {
        if (this.props.type === "Sender"){
            return (
                <View>
                <View style = {{ ...styles.container , backgroundColor : this.props.state.theme.icons_surrounding , 
                    left : ScreenWidth - 190 ,
                    elevation : 5
                    
                     }}>
                         <View style = {{ ...styles.image_wrapper , left : 150 , backgroundColor : 'white', 
                    }}>
                        <Avatar source = {require('../images/test.jpg')} rounded size = {"small"} />
                    </View>

                    
                    <View style = {styles.text}>
                        <Text style = {styles.message_text} >
                            {this.props.messo}
                        </Text>
                    </View>
                    
                </View>
                <Text  style = {{ left : 160  }} >  Seen at 12:35pm.  </Text>
                </View>
            )

        } else {
            return (
                <View>
                <View style = {{ ...styles.container ,
                 backgroundColor : this.props.state.theme.icons ,
                 elevation : 5,
                 left : 10,
                   borderBottomRightRadius : 0 ,
                   borderBottomLeftRadius : 20,
                   alignItems : 'center',
                   
                   
                    }}>
                        <View style = {{ ...styles.image_wrapper , right : 150, backgroundColor : this.props.state.icons_surrounding }}>
                        <Avatar source = {require('../images/test.jpg')} rounded size = {"small"} />
                    </View>
                    
                    <View style = {styles.text}>
                        <Text style = {{...styles.message_text, color : 'black'}} >
                            Thi is it bro . How are u doig over there , hope ur doing great . Am also doing great ...
                        </Text>
                    </View>
                    
                </View>
                <Text  style = {{ left : 80  }} >  Seen at 12:35pm.  </Text>
                </View>
            )

        }
        
    }
}

const mapStateToProps = (state) => {
    return({state}) 
}



export default connect(mapStateToProps, null)(Message)


const styles = StyleSheet.create({
    container : {
        width :180,
        flexDirection : 'column',
        minHeight : 70,
        borderRadius : 20,
        justifyContent : 'center',
        alignItems : 'center',
        borderBottomLeftRadius : 0,
        
        
       

    },
    image_wrapper : {
        
        height : 40,
        width : 40 ,
        borderRadius : 20,
        alignItems : 'center',
        justifyContent : 'center',
        position : 'absolute',
        zIndex : 1,
        top : 0,
        
    },
    text : {

        width : 160,
        justifyContent : 'center',
        alignItems : 'center',
    },
    message_text : {
        fontWeight : "700",
        color : 'white'
    }


})
