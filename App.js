import { registerRootComponent } from 'expo';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, ScrollView , FlatList , Image, Button} from 'react-native';
import { Card, ListItem, Icon, BottomSheet } from 'react-native-elements';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux'
import * as SplashScreen from 'expo-splash-screen';
import { ScreenWidth, ScreenHeight } from 'react-native-elements/dist/helpers';
import { Avatar } from 'react-native-elements/dist/avatar/Avatar';
import axios from 'axios'
import * as FileSystem from 'expo-file-system';
import * as SQLite from 'expo-sqlite'
import business_database from './redux/Database_transactions.js'
 


export class App extends React.Component {
  constructor(props){
    super(props)
  }
  state = {
  };
 

  async componentDidMount() {
    await downloadAssets()
    await this.prepareResources();
    await performAPICalls();
    this.props.navigation.navigate('Multix')
  }

 
  /**
   * Method that serves to load resources and make API calls
   */
  prepareResources =  async() => {
   
    function fill_data(){
      let business_db = new business_database()
      let output = business_db.business_data()
      return output
    }
    let profile = fill_data();
    this.props.action(this.props)
    this.props.store_profile_redux(profile)
  };


  render() {
      return (
        <View style={styles.container}>
        
        <Avatar rounded containerStyle = {{ elevation : 5 }} size = {'xlarge'}  source = {require('./assets/multix_logo.jpg')} />
        <Text style={styles.text}>Multix 👋</Text>
      </View>
      )
  }
}

// Put any code you need to prepare your app in these functions
 async function performAPICalls() {
  
}


async function downloadAssets(){
  const dir = await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'SQLite/')
  if (!dir.exists){
        console.log('Folder doesnt exist . Creating one ...')
        await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'SQLite/' )
        await FileSystem.downloadAsync('http://192.168.43.232:8080/Business_database.db', FileSystem.documentDirectory + 'SQLite/Business_database.db').then((result) => {
        console.log(result)
      }).catch((error) => {
        console.log(error)
      })
  } else if (dir.exists) {
        console.log('Folder exists . Proceeding...')
        //await FileSystem.downloadAsync('http://192.168.43.232:8080/Business_database.db', FileSystem.documentDirectory + 'SQLite/Business_database.db').then((result) => {
        //console.log(result)
        //this.props.load_database(result.uri)
      //}).catch((error) => {
        //console.log(error)
      //})
  } 
  console.log("done inserting database ....")

}
let mapStateToProps = (state) => {
  return {state}
}

let mapDispatchToProps = (dispatch) => ({
  action : (param) => {dispatch({type : 'Navigate' , navigation : param})},
  store_profile_redux : (Profile) => dispatch({type : 'update_business_profile' , value : Profile  }),
})

export default connect(mapStateToProps,mapDispatchToProps)(App)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
    top : 20
  },
});





