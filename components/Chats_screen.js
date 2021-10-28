import React , {Component} from 'react'
import {Text , View, StyleSheet ,TextInput, TouchableOpacity , FlatList,TouchableNativeFeedback } from 'react-native';
import { Avatar,SpeedDial,Badge } from 'react-native-elements'
import { ScreenWidth, ScreenHeight } from 'react-native-elements/dist/helpers';
import Theme from './../constants/Theme.js'
import {connect} from 'react-redux';
import Message from './Message.js';
import { FAB,Portal,Provider } from 'react-native-paper';
import * as Animatable from 'react-native-animatable'
import { Camera  } from 'expo-camera';
import Camera_Screen from '../hardware/Camera.js'
import { Audio } from 'expo-av';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

const spread_out = {
    0 : {
        
        width : 1 * ScreenWidth,
        height : 0* ScreenHeight,
        backgroundColor : 'rgba(0,0,0,0)'
    },
   
    0.5 : {
        
        width : 1 * ScreenWidth,
        height : 1 * ScreenHeight,
        backgroundColor : 'rgba(0,0,0,0.4)'
    },
},

 jump_up_timer = {
    0 : {
        left : 0.88*ScreenWidth ,
         bottom : 0.1*ScreenHeight
       
    },
    0.5 : {
        left : 0.88*ScreenWidth ,
        bottom : 0.5*ScreenHeight
       
    }
},

 spread_out_camera = {
    0 : {
        bottom : 0,
        right : 0 ,

    },
    1 : {
        bottom : 0.5*ScreenHeight-90,
        right : 0.5*ScreenWidth-90,
    }

}

class Chats_screen extends Component {
    constructor(props){
        super(props)
    }
    times = 0
    cam = null;
    
     
    messo_flatlist = null;
    state= {
        
        theme : Theme.lovely,
        open : false,
        video : false,
        video_audio_action_icon : 'microphone',
        action_opener : 'plus',
        video_height : 0,
        video_width : 0,
        Are_permissions_granted : false,
        camera_video_active : false,
        message_action : false,
        message : null,
        recording : new Audio.Recording(),
        time_recorded : 0,
        files_picked : null,
        image : null,
        
    }
    
    

    video_starter_or_stopper_recorder = async ( action ) => {
        const {status} = await Camera.requestPermissionsAsync()
        const audio_perms = await Audio.requestPermissionsAsync()

        
        if (status==="granted" && action === "Start" && audio_perms.status === "granted" ){
            
            this.setState({video_height: ScreenHeight , video_width : ScreenWidth , camera_video_active : true , Are_permissions_granted : true});
            setTimeout(async ( ) => {
                try {
                    let video = await this.cam.recordAsync()
                    console.log(video.uri)
                } catch(e){
                    console.log(e)
                }
                
 

        },1 )


        } else if ( status === "granted" && action === "Stop" && this.cam ){
            this.cam.stopRecording()
            this.setState({video_height: 0 , video_width : 0 , camera_video_active : false});
        }
        
        
    }

    audio_starter_or_stopper_recorder = async (action) =>{
        const audio_perms = await Audio.requestPermissionsAsync()
        //const recording = new Audio.Recording();
        if ( action === "Start" && audio_perms.status === "granted" ){
            try {
                this.state.recording.setOnRecordingStatusUpdate((audio_status)=>{

                    this.setState({time_recorded : (audio_status.durationMillis/1000).toFixed(0)})
                    
                })
                this.state.recording.setProgressUpdateInterval(1000)
                await this.state.recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
                await this.state.recording.startAsync();
                console.log("Starting to record ....")
            // You are now recording!
            } catch (error) {
            // An error occurred!
            }

        } else if (action === "Stop" ) {
            try {
                const audio = await this.state.recording.stopAndUnloadAsync()
                console.log(this.state.recording.getURI())
                console.log("Stopping to record ....")
                
            } catch (error) {
                
                
            }
            
        }
        
    }

    video_accessor = (icon) => {
        this.times += 1;
        if (this.times < 2) {
            setTimeout( ()=>{
                if(this.times >= 2 ){
                    (icon == "microphone")? 
                    this.setState({ video_audio_action_icon : 'video-camera', video : true }) : this.setState({ video_audio_action_icon : 'microphone', video : false })
                } else {
                    this.times -= this.times;

                }
            } , 1000  )
    
        } else {
            (icon == "microphone")? 
            this.setState({ video_audio_action_icon : 'video-camera', video : true }) : this.setState({ video_audio_action_icon : 'microphone', video : false })
            this.times -= this.times;
        }
        
    }
   

    render = () =>{
    const {name , id } = this.props.route.params ;
    const current_chat = this.props.state.current_chat ;
    
    
   
    return (
        
        <View style = {styles.container}>
            <View  style = {{ height : 500  }}>
           <FlatList s
            ref = { ref => {
                this.messo_flatlist = ref
            }  }
            
            inverted = {true}
            data = {this.props.state.messages[current_chat]}
            horizontal = {false}
            renderItem = { 
                (item) =>  (
                    <TouchableOpacity style = {{ paddingTop : 10 , paddingBottom : 10 , }} onLongPress = {
                        ()=> {
                            this.setState({message_action : true})
                        }
                    } >
                    <Message messo = {item.item.message} type = {item.item.type}/>
                    </TouchableOpacity>
                
                )
                
            }
            />
            </View>
            
            { this.state.camera_video_active && this.state.Are_permissions_granted  ? (
                
                 <View style = {{  position : 'absolute', height : this.state.video_height , width : this.state.video_width , backgroundColor : 'rgba(0,0,0,0.6)'  }}>
                        <Animatable.View animation = {spread_out_camera} style = {{  position : 'absolute', bottom : 0.5 * ScreenHeight-90 , right : 0.5*ScreenWidth-90 ,  }}>
                        <Camera style={styles.camera} type={Camera.Constants.Type.front} 
                                
                                    flashMode = {Camera.Constants.FlashMode.off}
                                    ref = { ref => {
                                    this.cam = ref;
                                    } }
                                >
                                    
                            
                                </Camera>

                 </Animatable.View>
                     
                 </View>
            ) : console.log()  }
            {  this.state.message_action ? (
                <Animatable.View animation = {spread_out}
                     style = {{  position : 'absolute', height : ScreenHeight , width : ScreenWidth , backgroundColor : 'rgba(0,0,0,0.6)'  }}>
                    <View style = {{
                        position : 'absolute',
                         bottom : 0.5 * ScreenHeight-90 ,
                          right : 0.4*ScreenWidth-90 ,
                        height : 50,
                        width : 240,
                        backgroundColor : 'transparent',
                        flexDirection : 'row',
                        justifyContent : 'space-between',
                        alignItems : "center",
                    }} >
                        <Animatable.View animation = {"slideInDown"} direction = {"alternate"} iterationCount = {1} >
                            <TouchableOpacity>
                                <Avatar rounded containerStyle = {{ backgroundColor : 'white' }} size = {'medium'} icon = {{ name : 'trash' , color : this.props.state.theme.icons_surrounding , type : 'font-awesome' }}/>
                            </TouchableOpacity>
                        </Animatable.View>
                        <Animatable.View animation = {"slideInDown"} direction = {"alternate"} iterationCount = {1} >
                        <TouchableOpacity>
                            <Avatar rounded containerStyle = {{ backgroundColor : 'white' }} size = {'medium'} icon = {{ name : 'star' , color : this.props.state.theme.icons_surrounding , type : 'font-awesome' }}/>
                        </TouchableOpacity>
                        </Animatable.View>
                        <Animatable.View animation = {"slideInDown"} direction = {"alternate"} iterationCount = {1} >
                        <TouchableOpacity>
                            <Avatar rounded containerStyle = {{ backgroundColor : 'white' }} size = {'medium'} icon = {{ name : 'reply' , color : this.props.state.theme.icons_surrounding , type : 'font-awesome' }}/>
                        </TouchableOpacity>
                        </Animatable.View>
                    </View>

                </Animatable.View>

            ) : ( <View/> )  }
               <Animatable.View animation = {"slideInDown"} direction = {"alternate"} iterationCount = {'infinite'}  style = {{position : 'absolute' ,height : 50 , width : 50 , left : 0.88*ScreenWidth , bottom : 0.1*ScreenHeight }}  >
                   <Badge value = {this.state.time_recorded} status = {'warning'} />
               </Animatable.View>
                <TouchableOpacity style = {{ position : 'absolute', bottom : 70 , right : 20 ,  }}
                onPressOut = { ()=>{
                    this.state.camera_video_active ? 
                    this.video_starter_or_stopper_recorder("Stop") : this.audio_starter_or_stopper_recorder("Stop"); setTimeout(()=>{
                        this.setState({recording : new Audio.Recording(),time_recorded : 0}); 
                    },500) 

                }}
                    onLongPress= { ()=> {
                        this.state.video_audio_action_icon == "video-camera" ? this.video_starter_or_stopper_recorder("Start")
                         : this.audio_starter_or_stopper_recorder("Start");  }}
                           
                    onPress = { ()=> this.video_accessor( this.state.video_audio_action_icon ) }
                 >
                    <Avatar rounded size ={"medium"} icon = {{ name : this.state.video_audio_action_icon ,type : 'font-awesome', color : 'white' }} containerStyle = {{backgroundColor : this.props.state.theme.icons_surrounding,elevation : 5 }}/>
                </TouchableOpacity>

                <Portal>
                <FAB.Group
                    fabStyle  = {{ backgroundColor : this.props.state.theme.icons_surrounding,paddingLeft:4 }}
                    visible = {false}
                    color = {this.props.state.theme.icons}
                    style = {{ bottom : 50 , }}
                    onPress = { ()=> this.state.open ? this.setState({open : false}) : this.setState({open : true})  }
                    open = {this.state.open}
                
                    icon = { this.state.open ? 'video-camera' : 'microphone'  }
                    
                    actions = {[
                        {icon : 'plus', accessibilityLabel : 'add', label : 'Add friend to conversation', onPress : ()=> {
                            this.props.state.navigation.navigation.navigate("Add chats to conversation")
                        } , style : {backgroundColor : this.props.state.theme.icons_surrounding, height : 40 , width : 40 },   color : this.props.state.theme.icons  },
                        {icon : 'bell' , label : 'mute' , onPress : ()=>console.log("pressed") , style : {backgroundColor : this.props.state.theme.icons_surrounding, height : 40 , width : 40 },   color : this.props.state.theme.icons  },
                        {icon : 'file' , label : 'Send a document' , onPress : async ()=>{
                            try {
                                
                                await DocumentPicker.getDocumentAsync({type : '*/*', multiple : true}).then(file =>{
                                    console.log(file);
                                })
                            
                            }catch(e){

                            }
                            
                            //this.setState({files_picked : files})
                            
                        },  style : {backgroundColor : this.props.state.theme.icons_surrounding, height : 40 , width : 40 },   color : this.props.state.theme.icons  },
                        {icon : 'video-camera' , label : 'Send video' ,  onPress : async ()=>{
                            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
                            if (status === "granted"){
                            try {
                                let result = await ImagePicker.launchImageLibraryAsync({
                                  mediaTypes: ImagePicker.MediaTypeOptions.Videos,
                                  allowsEditing: true,
                                  aspect: [4, 3],
                                  quality: 1,
                                });
                                if (!result.cancelled) {
                                  this.setState({ image: result.uri });
                                }
                          
                                console.log(result);
                              } catch (E) {
                                console.log(E);
                              }} else {
                                  console.log("No permissions")
                              }
                            

                        } , style : {backgroundColor : this.props.state.theme.icons_surrounding, height : 40 , width : 40   },   color : this.props.state.theme.icons  },
                        {icon : 'image' , label : 'Send an image' ,  onPress : async ()=>{
                            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
                            if (status === "granted"){
                            try {
                                let result = await ImagePicker.launchImageLibraryAsync({
                                  mediaTypes: ImagePicker.MediaTypeOptions.Images,
                                  allowsEditing: true,
                                  aspect: [4, 3],
                                  quality: 1,
                                });
                                if (!result.cancelled) {
                                  this.setState({ image: result.uri });
                                }
                          
                                console.log(result);
                              } catch (E) {
                                console.log(E);
                              }} else {
                                  console.log("No permissions")
                              }
                            
                        } , style : {backgroundColor : this.props.state.theme.icons_surrounding, height : 40 , width : 40   },   color : this.props.state.theme.icons  },
                    ]}
                    onStateChange = {()=> this.state.open ? this.setState({open : false}) : this.setState({open : true})  }
            
                />
                </Portal>  

                
    

                        
            <View style = {{ ...styles.accessories , backgroundColor : this.props.state.theme.icons_surrounding }}>
                <TouchableOpacity onPress = {
                    async ()=>{
                        //this.props.state.navigation.navigation.navigate("Camera")
                        let image = await ImagePicker.launchCameraAsync({mediaTypes : ImagePicker.MediaTypeOptions.Images , allowsEditing : true , aspect : [4,3] , quality : 0.8 , base64 : true})
                        console.log(image)
                    }
                }>
                <Avatar containerStyle = {{elevation : 5 , backgroundColor : this.props.state.theme.icons }} rounded size = {'small'} icon = {{name : 'camera', color : this.props.state.theme.icons_surrounding, type : 'font-awesome'}}/>
                </TouchableOpacity>
                <TextInput  onChangeText = {
                    (text) => {
                        this.setState({ message : text  })
                        //console.log(text)
                    
                    }
                } inlineImageLeft = 'splashscreen_image' value = {this.state.message}  style = {styles.input} multiline = {true} placeholder = {"       Enter Message "} />
                <TouchableOpacity onPress = {
                    () => {
                        this.props.send_message(this.state.message);
                        this.setState({ message : ''  })
                        //console.log(this.props.state.messages[current_chat])
                        //this.messo_flatlist.scrollToEnd()
                    }
                } >
                    <Avatar containerStyle = {{elevation : 5 , backgroundColor : this.props.state.theme.icons }} rounded size = {'small'} icon = {{name : 'send', color : this.props.state.theme.icons_surrounding, type : 'font-awesome'}}/>
                </TouchableOpacity>
                <TouchableOpacity onPress = {() => {
                    if (this.state.open) {
                        this.setState({action_opener:'plus'})
                        this.setState({open:false})
                    } else {
                        this.setState({open : true})
                        this.setState({action_opener:'remove'})
                    }
                    
                  } }>
                    <Avatar containerStyle = {{elevation : 5 , backgroundColor : this.props.state.theme.icons }} rounded size = {'small'} icon = {{name : this.state.action_opener, color :this.props.state.theme.icons_surrounding, type : 'font-awesome'}}/>
                </TouchableOpacity>
            </View>    
        </View>
        
    )}
}

let mapStateToProps = (state,ownProps) => {
    return {state}
}

let mapDispatchToProps = (dispatch,ownProps) => ({
    change_color : () => dispatch({type : 'color_change'}),
    send_message : (message) => dispatch({type : 'message_handler', message : message })

})



export default connect(mapStateToProps , mapDispatchToProps)(Chats_screen)

const styles = StyleSheet.create({
    container : {
        display : "flex",
        backgroundColor : 'transparent',
        flex : 1,
        flexDirection : 'column',
        justifyContent : 'flex-end',
        
        
    
    },
    camera : {
        flex : 1,
        aspectRatio : 0.75,
        flexDirection : 'column',
        justifyContent : 'space-between',
        alignItems : 'center',
        height : 180,
        width : 180,
        overflow : 'hidden',
        
    },

    accessories : {
        bottom : 0,
        backgroundColor : Theme.lovely.icons_surrounding,
        flexDirection : 'row',
        justifyContent : 'space-between',
        alignItems : 'center',
        height : 50,
        width : ScreenWidth,
        elevation : 5,
    },
    input : {
        height : 40,
        width : 250,
        backgroundColor : Theme.lovely.icons,
        borderRadius : 20,
        elevation : 5,
        fontWeight : '700',
        fontSize : 16
    },
    dial : {
         
         justifyContent : 'center' , 
         alignItems : 'center' , 
         elevation : 5 ,       
         display : 'none',
    },
    messo : {
        
        
        
       
    }
    
    

})

