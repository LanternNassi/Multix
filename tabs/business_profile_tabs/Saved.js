import React, { Component } from 'react';
import {View , Text , StyleSheet , Image , FlatList} from 'react-native';
import {Avatar , Card } from 'react-native-elements';
import {connect} from 'react-redux';
import {CirclesLoader} from 'react-native-indicator';
import { ScreenHeight, ScreenWidth } from 'react-native-elements/dist/helpers';




export class Saved extends Component {
    render() {
        return (
            <View>
                 <FlatList 
                    data = {[]}
                    horizontal = {false}
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
                            }} source = {require('../../assets/no-search-result.png')}/>
                            </View>
                        )
                    
                    }
                    renderItem = {
                        ()=>(
                            <TouchableOpacity style = {styles.notification}>
                                <Avatar rounded source = {require('../../images/test.jpg')} size = {'small'} />
                                <View style = {styles.message}>
                                    <Text>
                                    On the Insert tab, the galleries include items that are designed to coordinate with the overall look of your document. You can use these galleries to insert tables, headers, footers,
                                    </Text>
                                </View>

                            </TouchableOpacity>
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

export default connect( mapStateToProps , mapDispatchToProps )(Saved)

const styles = StyleSheet.create({
    notification : {
        width : ScreenWidth,
        maxHeight : 0.3 * ScreenHeight,
        backgroundColor : 'white',
        flexDirection : 'row',
        justifyContent : 'space-evenly',
    },
    message : {
        flexWrap : 'nowrap',
        maxWidth : 0.8 * ScreenWidth,
        maxHeight : 0.27 * ScreenHeight,
    },
    divider : {
        height : 0.5,
        width : 0.9 * ScreenWidth,
        borderWidth : 0.4,
    },



})