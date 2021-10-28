
import React , {Component} from 'react'
import { Avatar, Card , Icon , Button} from 'react-native-elements'
import {View , Text , TextInput , Image, ScrollView } from 'react-native'
import Post from '../../components/Post_elements/Post.js';
import Songs_movies from '../../components/Post_elements/Songs_movies.js'

export default class Sports extends Component {
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
        
        )
    }
}