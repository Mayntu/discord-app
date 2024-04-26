import  { FC, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import backImage from "../assets/Rectangle 59.png"
import { socket } from '../socket';
import { useAppDispatch, useAppSelector } from '../hooks/redux-hoock';
import { fetchGetChatMessage } from '../store/acthion';
import Message from './Message';
import { useGetfetchGetUserChatsQuery } from '../store/RTQChat';




const  MessageContainer : FC=()=> {
  const {chatid} = useParams()
  const [messageText,setMessageText] = useState<string>("")
  const [messageArray,setMessageArray] = useState<any[]>([])
  const dispatch = useAppDispatch()
  const message = useAppSelector(state=>state.chat.getMessage)
  const {users,isLoading} = useAppSelector(state=>state.chat)
  
  const [userMessage,setUserMessage] = useState<any>()
  const getMessage = async ()=>{
    chatid && await dispatch(fetchGetChatMessage(chatid))
  }

  const joinRoom = (room:any) => {
    socket.emit("join", {"username" : "12345", "chat_id" : room});
    socket.on("join",(data: any)=>{
      console.log(data,"join")
    })
  };


  useEffect(()=>{
   setUserMessage(users)
},[users])
 

  
  

  useEffect(()=>{
   
    joinRoom(chatid)
  },[chatid])

 useEffect(()=>{
    getMessage()
  },[chatid])

  useEffect(()=>{
    {message && setMessageArray(message)}
  },[message])


  const sendMessage = () => {
    // отправляю сообщение 
    if(messageText.trim()){
      socket.emit("message", {"data" : messageText, "chat_id" : chatid, "token" : localStorage.getItem("token")});
      setMessageText("")
    }
    }; 

    
  useEffect(()=>{ 
    // получаю сообщения
      if(chatid){
      socket.on("message", (data:any) => {
        data = JSON.parse(data)
        setMessageArray((prev)=>[...prev,{content: data.content, from_user_id : data.from_user_id, uuid : data.uuid,timestamp : data.timestamp}]) 
      });
    }
    // из-за зависимости с params socket накладываеться на предыдущий и просходит отправка кучи сообщений  решение?
  },[chatid])
 
 


  return (
    <>
      <div className='message-container' style={{backgroundImage : `url(${backImage})`}}>
          {chatid  &&
          <>   
            <div className="get-message-cantainer">
              {messageArray.map(ms=><Message key={ms.uuid} classUser={ms.from_user_id}  time={ms.timestamp}>{ms.content}</Message>)}
            </div>
            <div className="message-input-container">
              <input placeholder='iwjdijwijd' onChange={(e)=>setMessageText(e.target.value)} value={messageText}></input>
              <button onClick={()=>{sendMessage()}}>отправить</button>
            </div>
          </>  
            }
            {!chatid && <p>Hello add chat</p>}
      </div>

     
    </>
  )
}


export default MessageContainer
