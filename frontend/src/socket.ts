
import {io} from "socket.io-client"

 export const socket = io("http://127.0.0.1:5000")

 export const socketWebRTC = io("http://127.0.0.1:5555",{
   timeout: 10000,
   transports: ["websocket"]
 })