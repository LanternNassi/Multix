
import React , {Component} from 'react'
import {View , Text , TextInput , Image , Button , StyleSheet} from 'react-native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import SkeletonContent from 'react-native-skeleton-content';
import {connect} from 'react-redux'

function Profile(props) {
    return (
        <View >
           
        </View>
    )
}

let mapStateToProps = (state) =>
    {
        return {state}
    }

let mapDispatchToProps = (dispatch) => ({

})

export default connect(mapStateToProps,mapDispatchToProps)(Profile)


const styles = StyleSheet.create({

})
