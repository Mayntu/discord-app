import  { FC, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import backImage from "../assets/Rectangle 59.png"
import { socket } from '../socket';
import { useAppDispatch, useAppSelector } from '../hooks/redux-hoock';

import { fetchGetChatMessage } from '../store/acthion';
import Message from './Message';



const  MessageContainer : FC=()=> {
  const {chatid} = useParams()
  const [messageText,setMessageText] = useState<string>("")
  const [messageArray,setMessageArray] = useState<string[]>([])
  const dispatch = useAppDispatch()
  const user = useAppSelector(state=>state.chat.users)
  const message = useAppSelector(state=>state.chat.getMessage)
  
  const getMessage =async ()=>{
    dispatch(fetchGetChatMessage())
  
    
  }
  useEffect(()=>{
    getMessage()
    // console.log(message.messages,"mas")
    // setMessageArray((prev)=>[...prev,...message.messages])
  },[])

  const joinRoom = (room:any) => {
    socket.emit("join", {"username" : "12345", "chat_id" : room});
  };

  const sendMessage = () => {
    socket.emit("message", {"data" : messageText, "chat_id" : chatid, "token" : localStorage.getItem("token")});
    setMessageText("")
    };

    useEffect(()=>{
      joinRoom(chatid)
    },[])

    useEffect(()=>{
      getMessage()
      
      socket.on("message", (data:string) => {
        setMessageArray((prev)=>[...prev,{content: data}])  
      });
    },[])
    useEffect(()=>{
      console.log(message.messages,"mas")
      {message && setMessageArray(message)}
    },[message])
  return (
    <>
   
      <div className='message-container' style={{backgroundImage : `url(${backImage})`}}>
          {/* MessageContainer {chatid} */}
          {chatid  &&
          <>   
            <div className="get-message-cantainer">
              {messageArray.map(ms=><Message key={ms.uuid}>{ms.content}</Message>)}
            </div>
            <div className="message-input-container">
              <input placeholder='iwjdijwijd' onChange={(e)=>setMessageText(e.target.value)} value={messageText}></input>
              <button onClick={()=>{sendMessage()}}>отправить</button>
               <button onClick={()=>{}}>ex</button>
            </div>
          </>  
            }
     
          
         
        
      
      </div>

     
    </>
  )
}


export default MessageContainer
