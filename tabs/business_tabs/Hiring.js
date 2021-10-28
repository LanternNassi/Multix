import React , {Component} from 'react'
import {Avatar} from 'react-native-elements'
import {View , Text , TextInput , Image , Button , StyleSheet , TouchableOpacity,FlatList } from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { ScreenHeight, ScreenWidth } from 'react-native-elements/dist/helpers'
import {connect} from 'react-redux'
import {PulseLoader} from 'react-native-indicator'
import NumberFormat from 'react-number-format'

export class Hiring extends Component {
    state = {
        IsReady : false,
        data : null, 
    }
    get_resources = () =>{
        this.props.state.request_business_json({
            method : 'GET',
            url : 'fill_gigs/?Gig_type=Hiring' ,
            data : {}
        }).then((response)=>{
            if (response.status === 202){
                this.setState({IsReady : true , data : response.data})
            }
        })
    }
    query_resources = (name)=>{
        this.props.state.request_business_json({
            method : 'GET',
            url : 'fill_gigs/?Gig_type=Hiring&Gig_name=' + name ,
            data : {}
        }).then((response)=>{
            if (response.status === 202){
                this.setState({IsReady : true , data : response.data})
            }
        })

    }
    componentDidMount(){
        this.get_resources()
    }
    render = () => {
            return (
                <View style = {{
                    flex :1 ,
                }}>
                    <View style = {styles.categorizer}>
                        <View style = {{
                            width : ScreenWidth,
                            height : 40,
                            flexDirection : 'row',
                            justifyContent : 'space-around',
                            alignItems : 'center'
                        }}>
                            <Text style = {{
                                fontSize : 14.5,
                                fontWeight : 'bold',
                            }}>
                                Sort By : 
                            </Text>
                            <TouchableOpacity style = {styles.chips}>
                                <Text>
                                    Recent
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style = {styles.chips}>
                                <Text>
                                    Top Rated
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style = {styles.chips}>
                                <Text>
                                    Online
                                </Text>
                            </TouchableOpacity>
        
        
        
                        </View>
                        <View>
                            <TextInput style = {{
                                width : 0.8 * ScreenWidth,
                                height : 30,
                                borderRadius : 20,
                                borderBottomWidth : 1,
                            }}
                            onChangeText = {
                                (text) =>{
                                    if (text){
                                        this.setState({IsReady:false})
                                        var info = text.split('')
                                        if ((info.length) >= 3) {
                                            this.query_resources(text)
                                        }
                                    } else{
                                        this.setState({IsReady:false})
                                        this.get_resources()
                                    }
                                    
                                }
                            }
                             placeholder = {'       Search Gig by Name'} />
        
                        </View>
        
                    </View>
                    {this.state.IsReady?(
                         <FlatList
                         style = {styles.list}
                         data = {this.state.data}
                         
                         ItemSeparatorComponent = {
                             ()=>(
                                 <View style = {styles.divider}/>
                             )
                         }
                         alwaysBounceVertical = {true}
                         renderItem = {
                             (item,index)=>(
                                 <TouchableOpacity style = {styles.item} onPress = {
                                     () => {
                                         this.props.state.navigation.navigation.navigate('Gig Profile' , {id : item.item.Gig_id})
                                     }
                                 }>
                                     <View style = {styles.images}>
                                         <TouchableOpacity>
                                             <TouchableOpacity style = {{
                                             position : 'absolute',
                                             top : 0.065 * ScreenHeight,
                                             right : (0.28 * ScreenWidth)/2,
                                             elevation : 10,
         
                                             }}>
                                         <Avatar icon = {{ name : 'save' , type : 'font-awesome' , color : 'white', size : 18 }} rounded containerStyle = {{
                                             backgroundColor : 'transparent',
         
                                         }} />
                                         </TouchableOpacity>
                                         <Image source = {{uri : item.item.ShowCase_1}} style = {{
                                             height : 0.2 * ScreenHeight ,
                                             width : 0.35 * ScreenWidth,
                                             borderRadius : 10,
         
                                         }} />
                                         </TouchableOpacity>
                                         <TouchableOpacity style = {styles.image_info} onPress = {
                                             () => {
                                                 this.props.state.navigation.navigation.navigate('Account Profile',{id : item.item.Account_id})
                                             }
                                         }>
                                             <Image source = {{uri : item.item.Profile_pic}} style = {{
                                                 height : 40,
                                                 width : 40,
                                                 borderRadius : 20
                                             }} />
                                             <View style = {{
                                                 height : 0.08 * ScreenHeight,
                                                 width : 0.28 * ScreenWidth,
                                                 flexDirection : 'column',
                                                 justifyContent : 'space-between',
                                                 alignItems : 'center',
                                             }}>
                                                 <Text style = {{
                                                     fontSize : 16.5,
                                                     fontWeight : 'bold'
                                                 }}>{item.item.Name}</Text>
                                                 <Text style = {{
                                                     fontWeight : 'bold'
                                                 }}>{item.item.Place_of_residence}</Text>
                                             </View>
         
                                         </TouchableOpacity>
         
                                     </View>
                                     <View style = {styles.info}>
                                         <View style = {{
                                             flexWrap : 'nowrap',
                                             maxHeight : 0.19 * ScreenHeight,
                                             maxWidth : 0.45 * ScreenWidth,
                                         }}>
                                             <Text style = {{
                                                 fontSize  : 17,
                                                 fontWeight : 'bold'
                                             }}>
                                             {item.item.Gig_name}
                                             </Text>
                                         </View>
                                         <View style = {styles.rating}> 
                                         <MaterialCommunityIcons name = "account-switch" color = {this.props.state.theme.icons_surrounding} size={26}/>
                                         <Text style = {{
                                             fontSize :20,
                                             fontWeight : 'bold',
                                         }}> 12 </Text>
                                         </View>
                                         <Text >
                                             Date : {item.item.Gig_date_of_creation.slice(0,10)}
                                         </Text>
                                             <NumberFormat value = { item.item.Gig_salary } displayType = {'text'}
                                                 thousandSeparator = {true}
                                                 prefix = {'shs.'}
                                                     renderText = {(value , props) => (
                                                         <Text > Salary :  {value} </Text>
                                                     )}
                                                     />
                                         <TouchableOpacity style = {{...styles.propose , backgroundColor : this.props.state.theme.icons_surrounding}}>
                                             <Text style = {{
                                                 color : 'white',
                                             }}>
                                                 Apply
                                             </Text>
                                         </TouchableOpacity>    
                                     </View>
                                 </TouchableOpacity>
                             )
                         }
                     />

                    ):
                    (     
                        <View style = {{
                            flex : 1,
                            alignItems : 'center',
                            justifyContent : 'center',
                        }}>
                            <PulseLoader size = {120}  />
                        </View>
                        )}
                   
                    <TouchableOpacity style = {styles.fab} onPress = {
                        () => {
                            this.props.state.navigation.navigation.navigate('Credentials', { type : 'Hiring' })
                        }
                    }>
                        <Avatar containerStyle = {{
                            backgroundColor : this.props.state.theme.icons_surrounding,
                        }} icon = {{ name : 'add' , type : 'MaterialCommunityIcons', color : 'white' , size : 18 }} size = {'medium'} rounded/>
                    </TouchableOpacity>
        
                    
                </View>
            )

        }
       

    }
    
let mapStateToProps = (state) => {
    return {state}

}

let mapDispatchToProps = (dispatch) => ({

})

export default connect(mapStateToProps , mapDispatchToProps)(Hiring)

const styles = StyleSheet.create({
    categorizer : {
        width : ScreenWidth,
        height : 0.23 * ScreenWidth,
        elevation : 10,
        backgroundColor : 'white',
        flexDirection : 'column',
        alignItems : 'center',
        justifyContent : 'space-evenly',
    },
    list : {
        flexGrow : 1,
        width : ScreenWidth,
    },
    item : {
        height : 0.32 * ScreenHeight,
        width : ScreenWidth,
        flexDirection : 'row',
        justifyContent : 'space-between',
        alignItems : 'center',
    },
    images : {
        height : 0.3 * ScreenHeight,
        width : 0.47 * ScreenWidth,
        flexDirection : 'column',
        justifyContent : 'space-between',
        alignItems : 'center',

    },
    image_info : {
        flexDirection : 'row',
        width : 0.44 * ScreenWidth,
        height : 0.1 * ScreenHeight,
        justifyContent : 'space-around',
        alignItems : 'center',
    },
    info : {
        height : 0.34 * ScreenHeight,
        width : 0.47 * ScreenWidth,
        flexDirection : 'column',
        justifyContent : 'space-around',
        alignItems : 'flex-start',

    },
    rating : {
        height : 30 ,
        width : 0.2 * ScreenWidth,
        maxWidth : 0.45 * ScreenWidth,
        flexDirection : 'row',
        alignItems : 'center',
        justifyContent : 'space-around',
        borderRadius : 15,

    },
    divider : {
        height : 1,
        width : 0.9 * ScreenWidth,
        borderWidth : 0.4,
    },
    propose : {
        height : 30,
        width : 0.4 * ScreenWidth,
        borderRadius : 15,
        flexDirection : 'row',
        justifyContent : 'space-around',
        alignItems : 'center', 
    },
    chips : {
        height : 20,
        width : 80,
        borderRadius : 10,
        backgroundColor : 'rgba(10,200,0,0.5)',
        justifyContent : 'center',
        alignItems : 'center',
    },
    fab : {
        position : 'absolute',
        bottom : 0.05 * ScreenHeight,
        right : 0.1 * ScreenWidth,
        elevation : 18
        

    }
})

