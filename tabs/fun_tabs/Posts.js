
import React , {Component} from 'react'
import { Avatar, Card , Icon , Button} from 'react-native-elements'
import {View , Text , TextInput , Image, ScrollView, TouchableOpacity , StyleSheet } from 'react-native'
import Post from '../../components/Post_elements/Post.js';
import Songs_movies from '../../components/Post_elements/Songs_movies.js'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { ScreenHeight, ScreenWidth } from 'react-native-elements/dist/helpers'
import {connect} from 'react-redux'


export class Posts extends Component {
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
        {'name': 'Steve', 'id': 11, 'pic' : './images/test 4.jpg'}
    ],
}
    render = () => {
        return(
            <View style = {{ flex: 1 }}>
                <ScrollView style = {{ flex : 1}}>
                    <Post/>
                    <Songs_movies name = {this.state.names} genre = {'Movies'}/>
                    <Post/>
                    <Songs_movies name = {this.state.names} genre = {'Thrillers'}/>
                    <Post/>
                    <Post/>
                    <Songs_movies name = {this.state.names} genre = {'Songs'}/>
                    <Post/>

                    
                </ScrollView>
                <TouchableOpacity style = {styles.fab} onPress = {
                    () => {
                    }
                }>
                    <Avatar containerStyle = {{
                        backgroundColor : this.props.state.theme.icons_surrounding,
                    }} icon = {{ name : 'edit' , type : 'MaterialCommunityIcons', color : 'white' , size : 18 }} size = {'medium'} rounded/>
                </TouchableOpacity>
            </View>
        )
    }
}


let mapStateToProps = (state_redux) => {
    let state = state_redux.business
    return {state}

}

let mapDispatchToProps = (dispatch) => ({

})


export default connect(mapStateToProps, mapDispatchToProps)(Posts)


const styles = StyleSheet.create({
    fab : {
        position : 'absolute',
        bottom : 0.05 * ScreenHeight,
        right : 0.1 * ScreenWidth,
        elevation : 18
        

    }
})