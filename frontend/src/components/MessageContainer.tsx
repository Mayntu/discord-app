import  { FC, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams, } from 'react-router-dom'
// import backImage from "../assets/Rectangle 59.png"
import Add from "./Add"
import { socket } from '../socket';
import { useAppDispatch, useAppSelector } from '../hooks/redux-hoock';
import { fetchDeleteUser, fetchGetChatMessage, fetchGetServerChatRoomMessages, fetchGetUserChats } from '../store/acthion';
import Message from './Message';
import InputEmoji from "react-input-emoji";
import avatar from "../assets/sonic.jpg"
import { IUserChatT } from '../models/IUserChat';



const  MessageContainer : FC=()=> {
  const {chatid,chatserverid} = useParams()
  const [messageText,setMessageText] = useState<string>("")
  const [roomId,setRoomId] = useState<string>("")
  const [messageArray,setMessageArray] = useState<any[]>([])
  const dispatch = useAppDispatch()
  const message = useAppSelector(state=>state.chats.getMessage)
  const serverMessages = useAppSelector(state=>state.server.serverChatMessages)
  const userMe = useAppSelector(state=>state.auth.user)
  const refImage = useRef<HTMLInputElement>(null) 
  const [file,setFile] = useState<File | undefined>()
  const [usersChat,setUsersChat]= useState<IUserChatT>()
  const navigate = useNavigate()
  const [arrayURL,setArrayURL] = useState<string[]>([])

  const joinRoom = (room:any) => {
   
    console.log("room")
    socket.emit("join", {"username" : userMe.login, "chat_id" : room});
    setRoomId(room)
   
    
  };
 
  const getMessage = async ()=>{
    chatid && await dispatch(fetchGetChatMessage(chatid))
  }

  useEffect(()=>{
    //вход в комнату
  
    if(chatid){
      joinRoom(chatid)
      }

      return ()=>{
        if(roomId !== chatid && chatid !== undefined && roomId !== ""){
          console.log("ok",roomId,chatid,"выход")
          socket.emit("leave",{"chat_id" : roomId})
          socket.on("leave",(data)=>{
          console.log(data)
        })
        }
      }
  },[chatid,socket])

  useEffect(()=>{
    if(chatid){
      getMessage()
    }
  },[chatid])
 useEffect(()=>{
  if(Object.keys(userMe).length !== 0){
    socket.on("join",(data)=>{
      console.log(data.users_data.users_data,"user")
      const user  = data.users_data.users_data.find(usern=>usern.uuid !== userMe.uuid)
      setUsersChat(user)
    })
  }
  },[userMe])

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
        setArrayURL([])
        setFile(undefined)
    }

  }; 

    
  useEffect(()=>{ 
    // получаю сообщения
      if(chatid){
        socket.on("message", (data:any) => {
          data = JSON.parse(data)
          console.log( data)
          setMessageArray((prev)=>[...prev,{content: data.content, from_user_id : data.from_user_id, uuid : data.uuid,timestamp : data.timestamp,media : data.media}]) 
        });
       
      }
      return ()=>{
        socket.off("message")
      }
        
    // из-за зависимости с params socket накладываеться на предыдущий и просходит отправка кучи сообщений  решение?
  },[socket,chatid])
  
  ///////////////////////////////////////////////////////////////////
                  //SERVER
  //////////////////////////////////////////////////////////////////
 


  useEffect(()=>{
    console.log(chatserverid)
    if(chatserverid){
      socket.emit("join_server_chat",{chat_id:chatserverid})
      socket.on("join_server_chat",(data:any)=>{
        console.log(data,"dataServerJoin")
      })
      dispatch(fetchGetServerChatRoomMessages(chatserverid))
    }
  },[chatserverid])


  useEffect(()=>{
    {serverMessages && setMessageArray(serverMessages)}
  },[serverMessages])

  const sendMessageServer = () => {
    // отправляю сообщение 
    console.log(file,"filevneInput")
    if(messageText.trim()){
      socket.emit("server_chat_message", {
        "data" : messageText, 
        "chat_id" : chatserverid, 
        "token" : localStorage.getItem("token"), 
        media: file ? {file, name : file.type} : ""});
        setMessageText("")
    }
  }; 

  useEffect(()=>{ 
    // получаю сообщения
      if(chatserverid){
        socket.on("server_chat_message", (data:any) => {
          data = JSON.parse(data.message)
          console.log( data,"dataServerMessage")
          setMessageArray((prev)=>[...prev,{content: data.content, from_user_id : data.from_user_id, uuid : data.uuid,timestamp : data.timestamp,media : data.media}]) 
        });
      }
      // return ()=>{
      //   socket.off("server_chat_message")
      // }
  },[chatserverid])



  const dropImage=(e:React.DragEvent<HTMLDivElement>)=>{
    e.preventDefault()
    const files = [...e.dataTransfer.files]
    console.log(files)
    if(files && files.length){
      setFile(files[0])
      setArrayURL([window.URL.createObjectURL(files[0])]) 
  }else{
      
  }
  }

  return (
    <>
      <div className='message-container'
      //  style={{backgroundImage : `url(${backImage})`}}
       >
          {chatid  &&
          <>   
          <div className="status-bar">
            <div className="user-chat avatar">
              {usersChat && (<>
              {usersChat.avatar !== "." ? <img src={avatar} alt="" />: <img src={usersChat?.avatar} alt="" /> }
              <p>{usersChat.login}</p>
              </>)}
            </div>
                <button onClick={()=>{
                  dispatch(fetchDeleteUser(chatid))
                  navigate("/chat")
                  dispatch(fetchGetUserChats(""))
                  }}>удалить</button>
          </div>
            <div className="get-message-cantainer">
              {messageArray.length !==0 ? messageArray.map((ms,index)=><Message key={index} classUser={ms.from_user_id} media={ms.media}  time={ms.timestamp}>{ms.content}</Message>): null}
            </div>
            <div className="file-input">
              {file && (
              <img src={arrayURL[0]}/>
              )}
            </div>
            <div className="message-input-container" 
            onDrop={(e)=>{dropImage(e)}} 
            
            onDragOver={e=>e.preventDefault()}>
              <Add onClick={()=>refImage.current?.click()}/>
              <InputEmoji shouldConvertEmojiToImage={false} shouldReturn={true} inputClass='emoji' onEnter={sendMessage} cleanOnEnter  onChange={setMessageText} value={messageText}    placeholder="Введите сообщение"/>
              <button onClick={()=>{sendMessage()}}>отправить</button>
              <input ref={refImage} type="file" multiple accept='image/*,.png,.web,.jpg,.gif' onChange={(e)=>{setFile(e.target.files[0])}} className='none'/>
            </div>
          </>  
            }
            {chatserverid && 
            <>
              <div className="status-bar">
              <div className="user-chat avatar">
                {usersChat && (<>
                {usersChat.avatar !== "." ? <img src={avatar} alt="" />: <img src={usersChat?.avatar} alt="" /> }
                <p>{usersChat.login}</p>
                </>)}
              </div>
                  {/* <button onClick={()=>{
                    // dispatch(fetchDeleteUser(chatid))
                    // navigate("/")
                    }}>удалить</button> */}
            </div>
              <div className="get-message-cantainer">
                {messageArray.length !==0 ? messageArray.map((ms,index)=><Message key={index} classUser={ms.from_user_id} media={ms.media}  time={ms.timestamp}>{ms.content}</Message>): null}
              </div>
              <div className="file-input">
                {file && (<p>pltcm afqk</p>)}
              </div>
              <div className="message-input-container">
                <Add onClick={()=>refImage.current?.click()}/>
                <InputEmoji shouldReturn={true} shouldConvertEmojiToImage={false}  inputClass='emoji' onEnter={sendMessageServer} cleanOnEnter  onChange={setMessageText} value={messageText}    placeholder="Введите сообщение"/>
                <button onClick={()=>{sendMessageServer()}}>отправить</button>
                <input ref={refImage} type="file" accept='image/*,.png,.web,.jpg,.gif' onChange={(e)=>{setFile(e.target.files[0])}} className='none'/>
              </div>
            </>  
            }
            {!chatid && !chatserverid && <p>Hello add chat</p>}
      </div>

     
    </>
  )
}


export default MessageContainer
