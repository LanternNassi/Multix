
import React , {Component} from 'react'
import {View , Text , FlatList , StyleSheet, Image, SafeAreaView, ScrollView,  TouchableHighlight,TouchableOpacity, TouchableHighlightBase} from 'react-native'
import { Avatar , Badge , ListItem, Button, Icon, Card } from 'react-native-elements';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { TouchableItem } from 'react-native-tab-view';
import SkeletonContent from 'react-native-skeleton-content';
import { connect } from 'react-redux'






class Chats_bars extends Component {
    state = {
        'chat_screen_visibility' : false ,
        loading : true,

}

    componentDidMount = () => {
        setTimeout(()=>{
            this.state.loading = false
        },5000)
    }


    
    render(){
        return (
            <View style = {styles.container}>
            <FlatList
            alwaysBounceHorizontal = {true}
            showsHorizontalScrollIndicator = {false}
            ListEmptyComponent = {<Text>No chats yet</Text>} 
            horizontal = {true}
             data = {this.props.state.friends}
             renderItem = {
                 (item) => (
                     <TouchableOpacity onPress = {( )=>{}}>
                 <View style = {styles.item}> 
                    <SkeletonContent isLoading = {false} containerStyle = {{ width : 50 }} layout = {[
                        {key : 'pic' , width : 50 , height : 50 , borderRadius : 25},
                        {key : 'name' , width : 50 , height : 10 }
                    ]} >
                    
                 <Avatar activeOpacity = {3} key = {'pic'} title = {item.item.name} source = {require('../images/test.jpg')} rounded size = {'medium'}/>
                 

                 <Badge status="success" containerStyle={{ position: 'absolute', top: 3, right: 3 }} />

                 
                 <Text key = {'name'}>{item.item.name}</Text>
                 </SkeletonContent>
                 
                 </View>
                 </TouchableOpacity>
                 )
                 
             }
             
            />
          


            </View>    
            
        )
    }
        
}

let mapStateToProps = (state) => {
    return {state}

}
let mapDispatchToProps = () => ({

})

export default connect(mapStateToProps,mapDispatchToProps)(Chats_bars)

const styles = StyleSheet.create({
    container : {
        marginTop :0,
        justifyContent : 'center',
        height : 79,
        backgroundColor : 'white',
        elevation : 5
        
       
    },
    item : {
        padding : 9,


    }


})