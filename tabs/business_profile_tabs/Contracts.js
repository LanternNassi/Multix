import React, { Component } from 'react';
import {View , Text , StyleSheet , FlatList , TouchableOpacity , ScrollView , Image} from 'react-native';
import {Avatar , Card } from 'react-native-elements';
import {connect} from 'react-redux';
import {CirclesLoader} from 'react-native-indicator';
import { ScreenHeight, ScreenWidth } from 'react-native-elements/dist/helpers';




export class Contracts extends Component {
    render() {
        return (
            <ScrollView style = {{
                flex : 1,
                justifyContent : 'space-between'
                
             }}>
                <FlatList 
                style = {styles.contract_section}
                data = {this.props.state.friends}
                ItemSeparatorComponent = {
                    ()=>(
                        <View style = {styles.divider}/>
                    )
                }
                ListEmptyComponent = {
                    ()=>(
                        <View style = {{
                            height :0.5 * ScreenHeight,
                            width : ScreenWidth,
                            justifyContent : 'center',
                            alignItems : 'center',

                        }}>
                        <Image style = {{
                            height : 0.5*ScreenHeight,
                            width : ScreenWidth,
                            opacity : 0.3
                        }} source = {require('../../assets/no-notifications.jpg')}/>
                        </View>
                    )
                }
                renderItem = {
                    (item)=>(
                        <TouchableOpacity style = {styles.contract}>
                            <View style = {styles.pics}>
                                <Image style = {styles.gig_pic} source = {require('../../images/test.jpg')} />
                                <Avatar source = {require('../../images/test.jpg')} rounded size = {'small'} />
                            </View>
                            <View style = {styles.details}>
                                <Text style = {styles.header}> Gig : App </Text> 
                                <Text>Contractor : Nassim</Text>
                                <Text>Status : Pending</Text>
                                <Text>Deadline : 12/07/2022</Text>
                                <Text>Salary : 120000</Text>
                            </View>
                            <View style = {{
                                height : 0.2 * ScreenHeight,
                                width : 0.1 * ScreenWidth,
                            }}>
                                <Avatar rounded containerStyle = {{
                                    backgroundColor : 'green'
                                }} icon = {{ name : 'check' , size : 17 , color :'white' }} />
                            </View>

                        </TouchableOpacity>

                    )
                }
                />
                <View style = {{
                    width : ScreenWidth,
                    height : 0.1 * ScreenHeight,
                    justifyContent : 'center',
                    alignItems : 'center',
                }}>
                    <Text style = {styles.header}>Contracts Given Out </Text>
                </View>
                <FlatList 
                style = {{...styles.contract_section, }}
                data = {[]}
                ItemSeparatorComponent = {
                    ()=>(
                        <View style = {styles.divider}/>
                    )
                }
                ListEmptyComponent = {
                    ()=>(
                        <View style = {{
                            height :0.5 * ScreenHeight,
                            width : ScreenWidth,
                            justifyContent : 'center',
                            alignItems : 'center',

                        }}>
                        <Image style = {{
                            height : 0.5*ScreenHeight,
                            width : ScreenWidth,
                            opacity : 0.3
                        }} source = {require('../../assets/no-search-result.png')}/>
                        </View>
                    )
                }
                renderItem = {
                    (item)=>(
                        <View style = {styles.contract}>
                            <View style = {styles.pics}>
                                <Image style = {styles.gig_pic} source = {require('../../images/test.jpg')} />
                                <Avatar source = {require('../../images/test.jpg')} rounded size = {'small'} />
                            </View>
                            <View style = {{...styles.details , maxHeight : 0.25 * ScreenHeight}}>
                                <Text style = {styles.header}> Gig : Bike </Text> 
                                <Text>Contractor : Nassim</Text>
                                <Text>Status : Pending</Text>
                                <View style = {styles.edit}>
                                    <Text>Deadline : 12/07/2022</Text>
                                    <TouchableOpacity style = {styles.pen_edit}>
                                        <Avatar icon = {{ name : 'pencil' , type : 'font-awesome' , size : 14 , color : 'black' }} rounded/>
                                    </TouchableOpacity>
                                </View>
                                <View style = {styles.edit}>
                                <Text>Salary : 120000</Text>
                                <TouchableOpacity style = {styles.pen_edit}>
                                        <Avatar icon = {{ name : 'pencil' , type : 'font-awesome' , size : 14 , color : 'black' }} rounded/>
                                </TouchableOpacity>
                                </View>
                                <TouchableOpacity style = {{
                                    backgroundColor : this.props.state.theme.icons_surrounding,
                                    height : 30,
                                    width : 0.45 * ScreenWidth,
                                    borderRadius : 15,
                                    flexDirection : 'row',
                                    justifyContent : 'space-around',
                                    alignItems : 'center',
                                }}>
                                    <Text style = {{
                                        color : 'white',
                                    }}>Confirm Completion</Text>
                                </TouchableOpacity>
                            </View>
                            <View style = {{
                                height : 0.2 * ScreenHeight,
                                width : 0.1 * ScreenWidth,
                            }}>
                                <Avatar rounded containerStyle = {{
                                    backgroundColor : 'green'
                                }} icon = {{ name : 'check' , size : 17 , color :'white' }} />
                            </View>

                        </View>

                    )
                }
                />
                
            </ScrollView>
        )
    }
}

let mapDispatchToProps = (dispatch) => ({

})
let mapStateToProps = (state) => {
    return {state}

}

export default connect( mapStateToProps , mapDispatchToProps )(Contracts)

const styles = StyleSheet.create({
    contract : {
        width : ScreenWidth,
        height : 0.3 * ScreenHeight,
        backgroundColor : 'white',
        flexDirection : 'row',
        justifyContent  : 'space-evenly',
        alignContent : 'flex-start',
        

    },
    contract_section : {
        maxHeight : 4 * ScreenHeight,
        width : ScreenWidth,
        
    },
    details : {
        flexDirection : 'column',
        maxHeight : 0.2 * ScreenHeight,
        maxWidth : 0.6 * ScreenWidth,
        justifyContent : 'space-between',
        alignContent : 'flex-start'
    },
    pics : {
        height : 0.3 * ScreenHeight,
        width : 0.4 * ScreenWidth,
        flexDirection : 'column',
        justifyContent : 'space-evenly',
        alignItems : 'center',
    },
    gig_pic : {
        height : 0.2 * ScreenHeight,
        width :0.35 * ScreenWidth, 
    },
    header : {
        fontSize : 19,
        fontWeight : '700',
    },
    divider : {
        height : 1,
        width : 0.9 * ScreenWidth,
        borderWidth : 0.4,
    },
    edit : {
        flexDirection : 'row',
        justifyContent : 'space-between',
        width : 0.5 * ScreenWidth,
    },
    pen_edit : {
        height : 22,
        width : 22,
        borderRadius : 11,
        justifyContent : 'center',
        alignItems : 'center',
        borderWidth : 0.5,
    },


})