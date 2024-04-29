import  { FC, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import backImage from "../assets/Rectangle 59.png"
import { socket } from '../socket';
import { useAppDispatch, useAppSelector } from '../hooks/redux-hoock';
import { fetchGetChatMessage } from '../store/acthion';
import Message from './Message';
import InputEmoji from "react-input-emoji";




const  MessageContainer : FC=()=> {
  const {chatid} = useParams()
  const [messageText,setMessageText] = useState<string>("")
  const [messageArray,setMessageArray] = useState<any[]>([])
  const dispatch = useAppDispatch()
  const message = useAppSelector(state=>state.chat.getMessage)
  const refImage = useRef<HTMLInputElement>(null) 
  const [file,setFile] = useState()


  const joinRoom = (room:any) => {
    console.log("room")
    socket.emit("join", {"username" : "12345", "chat_id" : room});
    getMessage()
  };
 
  const getMessage = async ()=>{
    chatid && await dispatch(fetchGetChatMessage(chatid))
  
  }

  useEffect(()=>{
    //вход в комнату
    joinRoom(chatid)

  
  },[chatid])




  useEffect(()=>{
    {message && setMessageArray(message)}
  },[message])


  const sendMessage = () => {
    // отправляю сообщение 
    if(messageText.trim()){
      socket.emit("message", {
        "data" : messageText, 
        "chat_id" : chatid, 
        "token" : localStorage.getItem("token"), 
        media: file ? {file, name : file?.type} : ""});
        setMessageText("")
    }
  }; 

    
  useEffect(()=>{ 
    // получаю сообщения
      if(chatid){
        socket.on("message", (data:any) => {
          data = JSON.parse(data)
          console.log(data,"users-message232323")
          setMessageArray((prev)=>[...prev,{content: data.content, from_user_id : data.from_user_id, uuid : data.uuid,timestamp : data.timestamp,media : data.media}]) 
        });
      }
    
  

    // из-за зависимости с params socket накладываеться на предыдущий и просходит отправка кучи сообщений  решение?
  },[chatid])
 
 


  return (
    <>
      <div className='message-container' style={{backgroundImage : `url(${backImage})`}}>
          {chatid  &&
          <>   
          <div className="status-bar">

          </div>
            <div className="get-message-cantainer">
              {messageArray.length !==0 ? messageArray.map(ms=><Message key={ms.uuid} classUser={ms.from_user_id} media={ms.media}  time={ms.timestamp}>{ms.content}</Message>): null}
            </div>
            <div className="message-input-container">
              <InputEmoji onEnter={sendMessage} cleanOnEnter  onChange={setMessageText} value={messageText}    placeholder="Введите сообщение"/>
              <button onClick={()=>{sendMessage()}}>отправить</button>
              <input ref={refImage} type="file" accept='image/*,.png,.web,.jpg,.gif' onChange={(e)=>{setFile(e.target.files[0])}} className='none'/>
              <button onClick={()=>{refImage.current?.click()}}>отправить  image</button>
            </div>
          </>  
            }
            {!chatid && <p>Hello add chat</p>}
      </div>

     
    </>
  )
}


export default MessageContainer
