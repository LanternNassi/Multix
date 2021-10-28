import React, { Component } from 'react'
import { View , Text, FlatList , StyleSheet, TouchableOpacity, Dimensions, TouchableWithoutFeedback } from 'react-native'
import { ListItem , Avatar, Card , FAB } from 'react-native-elements';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Chats_screen from './Chats_screen';
import SkeletonContent from 'react-native-skeleton-content';
import { withNavigation  } from 'react-navigation';
import {connect} from 'react-redux';


const Stack  =  createStackNavigator();

export class Chats_container extends Component {
    constructor(props){
        super(props)
    }
    state = {
        names: [
        {'name': 'Ben', 'id': 1, 'pic' : './images/test.jpg'},
        {'name': 'Susan', 'id': 2, 'pic' : './images/test 1.jpg'},
        {'name': 'Robert', 'id': 3, 'pic' : './images/test 2.jpg'},
        {'name': 'Mary', 'id': 4, 'pic' : './images/test 3.jpg'},
        {'name': 'Daniel', 'id': 5, 'pic' : './images/test 4.jpg'},
        {'name': 'Laura', 'id': 6, 'pic' : './images/test 5.jpg'},
        {'name': 'John', 'id': 7, 'pic' : './images/test 6.jpg'},
        {'name': 'Debra', 'id': 8, 'pic' : './images/test 7.jpg'},
        {'name': 'Aron', 'id': 9, 'pic' : './images/test 8.jpg'},
        {'name': 'Ann', 'id': 10, 'pic' : './images/test 9.jpg'},
        
    ],
    loading :true 
}

    componentDidMount = () => {
        //console.log(this.props.state)
    }

    render() {
        return (
            
                <FlatList 
                    horizontal = {false}
                    data = {this.props.state.friends}
                    alwaysBounceVertical = {true}
                    
                    renderItem = {
                        (item) => (
        
                            <TouchableOpacity onPress = {()=>{  this.props.current_chat(item.item.name);  this.props.state.navigation.navigation.navigate('Chat_screen' , {name:item.item.name , id : item.item.id})}}  >
                            <ListItem.Swipeable 
                            style = {styles.item}
                            
                            >
                                    <ListItem.Content style = {styles.arranger}>
                                        <SkeletonContent isLoading = {false} animationDirection = {'diagonalTopRight'} animationType = {'shiver'} containerStyle = {styles.arranger } layout = {[
                                            {key : 'pic ' , height : 50 , width : 50 , borderRadius : 25} ,
                                            {key : 'title' , left : 10, height : 10 , width : 110},
            
                                        ]} >
                                            <View>
                                                <Avatar key = {'pic'} source = {require('../images/test.jpg')} rounded size = {'medium'}/>
                                            </View>
                                            <View style = {{ marginLeft : 10, }}>
                                                <ListItem.Title key = {'title'}>
                                                {item.item.name}
                                                </ListItem.Title>
                                                <ListItem.Subtitle key ={'subtitle'}>
                                                {item.item.id}
                                                </ListItem.Subtitle>
                                            </View>
                                        </SkeletonContent>
                                    </ListItem.Content>
                                    <ListItem.Chevron/>
                                    

                            </ListItem.Swipeable> 
                            
                            </TouchableOpacity>

                        )
                    }
                />

        
                
            
        )
    }
}

let mapStateToProps = (state) => { 
    return { state}
}

let mapDispatchToProps = (dispatch) => ({
    current_chat : (param)=>dispatch({type:'current_chat',name : param })

})
export default connect(mapStateToProps,mapDispatchToProps)(Chats_container)

const styles = StyleSheet.create(
    {
        arranger : {
            flexDirection : 'row',
            justifyContent : 'flex-start',
            alignItems : 'center',
            
        } ,

        item : {
            backgroundColor : 'rgba(255,0,255,.1)',
        } ,
        element : {
            flexGrow : 1 ,
            
       }
    }
)
