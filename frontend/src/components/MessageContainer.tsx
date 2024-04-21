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
  const [messageArray,setMessageArray] = useState<any[]>([])
  const dispatch = useAppDispatch()
  const user = useAppSelector(state=>state.chat.users)
  const message = useAppSelector(state=>state.chat.getMessage)


  useEffect(()=>{
    joinRoom(chatid)
  },[])

  useEffect(()=>{
    getMessage()
  },[])

  useEffect(()=>{
    {message && setMessageArray(message)}
    },[message])

  const getMessage = async ()=>{
    chatid && await dispatch(fetchGetChatMessage(chatid))
  }

  const joinRoom = (room:any) => {
    socket.emit("join", {"username" : "12345", "chat_id" : room});
  };

  const sendMessage = () => {
    // отправляю сообщение 
    socket.emit("message", {"data" : messageText, "chat_id" : chatid, "token" : localStorage.getItem("token")});
    setMessageText("")
    }; 

    
   useEffect(()=>{ 
    // получаю сообщения вопрос от кого?
    if(chatid){
      socket.on("message", (data:string) => {
        console.log(data, "dataMesage")
        setMessageArray((prev)=>[...prev,{content: data, from_user_id : "6dc5d949-d47a-4121-a5e6-a3596a75178b", uuid : Math.random() * 100000 | 0}]) 
      });
    }
  },[])
 
 


  return (
    <>
   
      <div className='message-container' style={{backgroundImage : `url(${backImage})`}}>
          {chatid  &&
          <>   
            <div className="get-message-cantainer">
              {messageArray.map(ms=><Message key={ms.uuid} classUser={ms.from_user_id}>{ms.content}</Message>)}
            </div>
            <div className="message-input-container">
              <input placeholder='iwjdijwijd' onChange={(e)=>setMessageText(e.target.value)} value={messageText}></input>
              <button onClick={()=>{sendMessage()}}>отправить</button>
            </div>
          </>  
            }
     
          
         
        
      
      </div>

     
    </>
  )
}


export default MessageContainer
