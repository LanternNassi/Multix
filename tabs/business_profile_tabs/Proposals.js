import React, { Component } from 'react';
import {View , Text , StyleSheet , FlatList, Image,TouchableOpacity } from 'react-native';
import {Avatar , Card } from 'react-native-elements';
import {connect} from 'react-redux';
import {CirclesLoader} from 'react-native-indicator';
import { ScreenHeight, ScreenWidth } from 'react-native-elements/dist/helpers';




export class Proposals extends Component {
    render() {
        return (
            <View style = {{
                flex : 1
            }}>
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
                            height :0.78 * ScreenHeight,
                            width : ScreenWidth,
                            justifyContent : 'center',
                            alignItems : 'center',

                        }}>
                        <Image style = {{
                            height : 0.5*ScreenHeight,
                            width : ScreenWidth,
                            opacity : 0.3
                        }} source = {require('../../assets/no-business-deals.jpg')}/>
                        </View>
                    )}
                renderItem = {
                    (item)=>(
                        <View style = {styles.contract}>
                            <View style = {styles.pics}>
                                <Image style = {styles.gig_pic} source = {require('../../images/test.jpg')} />
                                <TouchableOpacity>
                                <Avatar source = {require('../../images/test.jpg')} rounded size = {'small'} />
                                </TouchableOpacity>
                            </View>
                            <View style = {{...styles.details , maxHeight : 0.27 * ScreenHeight}}>
                                <Text style = {styles.header}> Gig : Bike </Text> 
                                <Text>Contractor : Nassim</Text>
                                <Text>Type : Hiring</Text>
                                <Text>Deadline : 12/07/2022</Text>
                                <Text>StartDate : 12/07/2022</Text>
                                <Text>Salary : 120000</Text>
                                
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
                                    }}>Approve</Text>
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
                
            </View>
        )
    }
}

let mapDispatchToProps = (dispatch) => ({

})
let mapStateToProps = (state) => {
    return {state}

}

export default connect( mapStateToProps , mapDispatchToProps )(Proposals)

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