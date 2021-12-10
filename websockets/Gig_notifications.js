

export default class Gig_notifications {
    constructor(name){
        this.ws = new WebSocket('ws://192.168.43.232:8000/ws/gig_notifications/'+ name + '/')
    }
    onMessage = (handler) =>{
        this.ws.addEventListener('message',handler)
    }
    sendMessage(message){
        this.ws.send(JSON.stringify(message))
    }
    onOpen = (handler) => {
        this.ws.addEventListener('open',handler)
    }
    onError = (handler) => {
        this.ws.addEventListener('error',handler)
    }
    onClose = (handler) => {
        this.ws.addEventListener('close',handler)
    }

}