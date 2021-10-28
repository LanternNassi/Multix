import React, { Component } from 'react'
import { View , Text , TouchableOpacity, StyleSheet , ScrollView  } from 'react-native';
import { CheckBox , Avatar , Switch , ListItem , Image } from 'react-native-elements';
import { connect } from 'react-redux'
import { ScreenHeight, ScreenWidth } from 'react-native-elements/dist/helpers';

export class Chat_screen_settings extends Component {
    render() {
        return (
            <ScrollView horizontal = {false}>
                <View  style = {styles.status} >
                    <View style = {{ justifyContent : 'center' }}>
                        <View style = {{...styles.profile_pic_layout , backgroundColor : this.props.state.theme.icons_surrounding}}>
                            <Avatar source = {require('../images/test.jpg')} rounded size = {'xlarge'}  />
                        </View>
                    </View>
                    <View style = {{ justifyContent : 'space-between', height : 0.4 * ScreenHeight }}>
                        <View style = {styles.shared}>
                            <Avatar rounded size = {'small'} containerStyle = {{ backgroundColor : this.props.state.theme.icons_surrounding }} icon = {{ name : 'file-photo-o', type : 'font-awesome' ,  }} />
                            <View style = {{ justifyContent : 'center'}}>
                                <View style = {{flexDirection : 'row'}}>
                                    <Text style = {{ fontWeight : '700' }}>Sent :</Text>
                                    <Text> 10 </Text>
                                </View>
                                <View style = {{flexDirection : 'row'}}>
                                    <Text style = {{ fontWeight : '700' }}>Received :</Text>
                                    <Text>20</Text>
                                </View>
                           
                            </View>
                        </View>
                        <View style = {styles.shared} >
                            <Avatar rounded size = {'small'} containerStyle = {{ backgroundColor : this.props.state.theme.icons_surrounding }} icon = {{ name : 'file-video-o', type : 'font-awesome' }} />
                            <View style = {{ justifyContent : 'center'}}>
                            <View style = {{flexDirection : 'row'}}>
                                    <Text style = {{ fontWeight : '700' }}>Sent :</Text>
                                    <Text> 10</Text>
                                </View>
                                <View style = {{flexDirection : 'row'}}>
                                    <Text style = {{ fontWeight : '700' }}>Received :</Text>
                                    <Text> 20</Text>
                                </View>
                            </View>
                        </View>
                        <View  style = {styles.shared} >
                            <Avatar rounded size = {'small'} containerStyle = {{ backgroundColor : this.props.state.theme.icons_surrounding }} icon = {{ name : 'file-pdf-o', type : 'font-awesome' }} />
                            <View style = {{ justifyContent : 'center'}}>
                                <View style = {{flexDirection : 'row'}}>
                                        <Text style = {{ fontWeight : '700' }}>Send :</Text>
                                        <Text> 10</Text>
                                    </View>
                                    <View style = {{flexDirection : 'row'}}>
                                        <Text style = {{ fontWeight : '700' }}>Received :</Text>
                                        <Text> 20</Text>
                                    </View>
                                </View>
                        </View>
                        <View style = {styles.shared} >
                            <Avatar rounded size = {'small'} containerStyle = {{ backgroundColor : this.props.state.theme.icons_surrounding }} icon = {{ name : 'envelope',  type : 'font-awesome' }} />
                            <View style = {{ justifyContent : 'center'}}>
                                <View style = {{flexDirection : 'row'}}>
                                        <Text style = {{ fontWeight : '700' }}>Sent :</Text>
                                        <Text> 10</Text>
                                    </View>
                                    <View style = {{flexDirection : 'row'}}>
                                        <Text style = {{ fontWeight : '700' }}>Received :</Text>
                                        <Text> 20</Text>
                                    </View>
                            </View>
                        </View>


                    </View>
                </View>
                <View>
                <TouchableOpacity>
                <ListItem>
                    <Avatar rounded icon = {{ name : 'share-alt' , color : 'black', type : 'font-awesome' }} />
                    <ListItem.Content style = {{ flexDirection : 'row' , justifyContent : 'space-between' }}>
                    <ListItem.Title>Share Contact</ListItem.Title>
                    <ListItem.Chevron/>
                    </ListItem.Content>
                </ListItem>
                </TouchableOpacity>
                <TouchableOpacity>
                <ListItem>
                    <Avatar rounded icon = {{ name : 'user-circle' , color : 'black', type : 'font-awesome' }} />
                    <ListItem.Content style = {{ flexDirection : 'row', justifyContent : 'space-between' }}>
                    <ListItem.Title>Go To Profile</ListItem.Title>
                    <ListItem.Chevron/>
                    </ListItem.Content>
                </ListItem>
                </TouchableOpacity>
                <TouchableOpacity>
                
                <ListItem>
                    <Avatar rounded icon = {{ name : 'bell' , color : 'black', type : 'font-awesome' }} />
                    <ListItem.Content style = {{ flexDirection : 'row', justifyContent : 'space-between' }}>
                    <ListItem.Title>Mute</ListItem.Title>
                    <Switch value = {false} color = {'black'}/>
                    </ListItem.Content>
                </ListItem>
                </TouchableOpacity>
                <TouchableOpacity>
                <ListItem>
                    <Avatar rounded icon = {{ name : 'minus' , color : 'black' , type : 'font-awesome' }} />
                    <ListItem.Content style = {{ flexDirection : 'row', justifyContent : 'space-between' }}>
                    <ListItem.Title>Block</ListItem.Title>
                    <Switch value = {false} color = {'black'}/>
                    </ListItem.Content>
                </ListItem>
                </TouchableOpacity>
                <TouchableOpacity>
                <ListItem>
                    <Avatar rounded icon = {{ name : 'bullhorn' , color : 'black' , type : 'font-awesome' }} />
                    <ListItem.Content style = {{ flexDirection : 'row', justifyContent : 'space-between' }}>
                    <ListItem.Title>Report</ListItem.Title>
                    <ListItem.Chevron/>
                    </ListItem.Content>
                </ListItem>
                </TouchableOpacity>


                </View>
            </ScrollView>
        )
    }
}

const mapStateToProps = (state) => {
    return{state}
    
}

const mapDispatchToProps = {
    
}

export default connect(mapStateToProps, mapDispatchToProps)(Chat_screen_settings)

const styles = StyleSheet.create({
    status : {
        height : 0.5 * ScreenHeight,
        width : 0.9 * ScreenWidth,
        maxWidth : 0.9 * ScreenWidth,
        minHeight : 0.4 * ScreenWidth,
        flexDirection : 'row',
        justifyContent : 'space-between',
        alignItems : 'center',
        left : 0.05 * ScreenWidth,

    },
    profile_pic_layout : {
        height : 160 ,
         width : 160 , 
         borderRadius : 80 , 
         backgroundColor : 'red', 
         justifyContent : 'center',
          alignItems : 'center'

    },
    shared : {
        flexDirection : 'row',
        alignItems : 'center',
        height : 50,
        width : 0.45 * ScreenWidth,
        
        justifyContent : 'space-evenly'
        
    },
    subtitleView: {
        flexDirection: 'row',
        paddingLeft: 10,
        paddingTop: 5
      },
      ratingImage: {
        height: 19.21,
        width: 100
      },
      ratingText: {
        paddingLeft: 10,
        color: 'grey'
      }


})