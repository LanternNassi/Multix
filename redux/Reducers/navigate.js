
import Theme from '../../constants/Theme.js'
import * as mime from 'react-native-mime-types'
import FormData, {getHeaders} from 'form-data'
import axios from 'axios'

let Overall_State = {
    Business_profile : {},
    Username : 'Lantern',
    navigation : 'navigate',
    business_profile_edit_done : true,
    done : 'no',
    Business_database : '',
    friends : [
        {'name': 'Ben', 'id': 1, 'pic' : './images/test.jpg' , 'type' : 'Sender' },
        {'name': 'Susan', 'id': 2, 'pic' : './images/test 1.jpg' , 'type' : 'Sender'},
        {'name': 'Robert', 'id': 3, 'pic' : './images/test 2.jpg' , 'type' : 'Receiver'},
        {'name': 'Mary', 'id': 4, 'pic' : './images/test 3.jpg' , 'type' : 'Sender'},
        {'name': 'Daniel', 'id': 5, 'pic' : './images/test 4.jpg' , 'type' : 'Receiver'},
        {'name': 'Laura', 'id': 6, 'pic' : './images/test 5.jpg' , 'type' : 'Receiver'},
        {'name': 'John', 'id': 7, 'pic' : './images/test 6.jpg' , 'type' : 'Receiver'},
        {'name': 'Debra', 'id': 8, 'pic' : './images/test 7.jpg' , 'type' : 'Sender'},
        {'name': 'Aron', 'id': 9, 'pic' : './images/test 8.jpg' , 'type' : 'Sender'},
        {'name': 'Ann', 'id': 10, 'pic' : './images/test 9.jpg' , 'type' : 'Receiver'},
        {'name': 'Ann', 'id': 11, 'pic' : './images/test 9.jpg' , 'type' : 'Receiver'},

    ],
    messages : {
        Daniel : [
            {'type' : 'Sender' , 'message' : 'Hello there'},
            {'type' : 'Sender' , 'message' : '2'},
            {'type' : 'Sender' , 'message' : '3'},
            {'type' : 'Sender' , 'message' : '4'},
        ]
    },
    

    theme : Theme.purger,
    current_chat : {
        name : "Any"
    }
}


export default Navigate_Reducer = (state = Overall_State , action) => {
    switch(action.type){
        case 'Navigate':{
            return {
                ...state , navigation : action.navigation
            }
            break;
        }
        case 'color_change':{
            return {
                ...state, theme : Theme.lovely
            }
            break;
        }
        case 'current_chat': {
            return {
                ...state , current_chat : action.name
            }
        }
        case 'done' : {
            return {
                ...state , business_profile_edit_done : action.decide
            }

        }
        case 'message_handler': {
            let name = 'Daniel'
            state.messages.Daniel.push({'type' : 'Sender' , message : action.message})
            state.messages.Daniel.reverse()
    
            return {
                ...state
            }
        }
        case 'initiate_business_sign_up':{

            return{
                ...state , Business_sign_up : {
                    'Business account' : {
                        'Multix_token' : '000',
                        'Multix_general_account_id':'000',
                        'Rating' : '0'
                    } ,
                    'Billing information' : {} ,
                    'Certifications' : {}
                }
            }
        }
        case 'Business account' : {
            state.Business_sign_up['Business account'][action.key] = action.value 
            return {
                ...state
            }

        }
        case 'Business_account_destroyer' : {
            if (state.Business_sign_up){
                delete state.Business_sign_up
                return {
                    ...state
                }
            } else {
                return {
                    ...state
                }
            }
            
        }
        case 'Billing information' : {
            state.Business_sign_up['Billing information'][action.key] = action.value 
            return {
                ...state
            }

        }
        case 'Certifications' : {
            state.Business_sign_up['Certifications'] = action.value 
            return {
                ...state
            }

        }
        case 'Pic' : {
            const newImageUri = "file:///" + action.pic.split("file:/").join("")
            state['processed_image'] = {
                uri : newImageUri,
                type : mime.lookup(newImageUri),
                name : newImageUri.split("/").pop()
            }
            return {
                ...state
            }
        }
        case 'initiate_gig_sign_up' : {
            return {
                ...state , Gig_sign_up : {
                    'word_info' : {
                        'Gig_type' : action.value,
                        'Multix_token' : '000',
                    },
                    'images' : {},
                }
            }
        }
        case 'gig_word_info' : {
            state['Gig_sign_up']['word_info'][action.key] = action.value
            return {
                ...state
            }
        }
        case 'gig_images' : {
            state['Gig_sign_up']['images'][action.key] = action.value
            return {
                ...state
            }
        }
        case 'gig_add_info' : {
            state['Gig_sign_up']['Additional_info'] = action.value
            return {
                ...state
            }

        }
        case 'gig_instance_destroyer' : {
            if (state.Gig_sign_up){
                delete state.Gig_sign_up
                return {
                    ...state
                }
            } else {
                return {
                    ...state
                }
            }  
        }
        case 'update_business_profile' : {
            state['Business_profile'] = action.value
            return {
                ...state  
                
            }
        }
        case 'create_business_request_instances' : {
            state['request_business_json'] = axios.create({
                baseURL : 'http://192.168.43.232:8000',
                headers : { 
                    'content-type' : 'application/json',
                    'Authorization': 'Token ' + action.token ,
                }
            })
            state['request_business_form'] = axios.create({
                baseURL : 'http://192.168.43.232:8000',
                headers : { 
                    'content-type' : 'multipart/form-data',
                    'Authorization': 'Token ' + action.token ,
                    
                }
            })

        }
        case 'update_bus_profile' : {
            state.Business_profile[action.key] = action.value
            return {
                ...state
            }
        }
        case 'update_business_profile_account' : {
            state.Business_profile['Account'][action.name] = action.value
            return {
                ...state
            }
        }
        case 'update_business_profile_gig' : {
            for(let i = 0; i < state.Business_profile['Gigs'].length; i++){
                if (action.Server_id === state.Business_profile['Gigs'][i]['Gig_info'].Server_id){
                    state.Business_profile['Gigs'][i]['Gig_info'][action.name] = action.value
                }
            }
            return {
                ...state
            }
        }
        
        
        default :
            return state;
    }

}