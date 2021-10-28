import React , {Component , useState , useEffect} from 'react'
import {} from 'react-native-elements'
import {View , Text , TextInput , Image , Button} from 'react-native';
import Header from '../constants/Header.js'
import DB from 'react-native-sqlcipher'
import FileSystem from 'expo-file-system'
import * as SQLite from 'expo-sqlite';
//import SQLite from 'react-native-sqlite-storage'
import business_database from '../redux/Database_transactions.js'


export default function Settings() {
    const data_insertion = () => {
           let db = SQLite.openDatabase('Business_database.db')
           db.transaction((tx)=>{
               tx.executeSql('SELECT * FROM Gig_additional_info' , [] , (tx , Result)=>{
                console.log(Result.rows._array)
               })
           }  , (error)=> {console.log(error)} , ()=>{console.log('Success transacting')})
      }
     
    useEffect(()=>{
        data_insertion()
    } , [])
    return (
        <View>
            <Header/>
        </View>
    )
}