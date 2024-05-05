import  { FC, useEffect,  useState } from 'react'
import { useNavigate, useParams, } from 'react-router-dom'
import { socket } from '../socket';
import { useAppDispatch, useAppSelector } from '../hooks/redux-hoock';
import { fetchDeleteUser } from '../store/acthion';
import Message from './Message';
import avatar from "../assets/sonic.jpg"
import { IUserChatT } from '../models/IUserChat';
import { fetchDeleteServerChatRoom, fetchGetServerChatRoomMessages } from '../store/actionServer';
import { fetchGetChatMessage, fetchGetUserChats } from '../store/acthionChat';
import InputMessage from './InputMessage';



const  MessageContainer : FC=()=> {
  let [audioBlob,setAudioBlob] = useState<Blob>()
  const {chatid,chatserverid,serverid} = useParams()
  const [messageText,setMessageText] = useState<string>("")
  const [roomId,setRoomId] = useState<string>("")
  const [messageArray,setMessageArray] = useState<any[]>([])
  const dispatch = useAppDispatch()
  const message = useAppSelector(state=>state.chats.getMessage)
  const serverMessages = useAppSelector(state=>state.server.serverChatMessages)
  const userMe = useAppSelector(state=>state.auth.user)
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
      getMessage()
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
          data = JSON.parse(data.message)
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
        "server_id" : serverid,
        "token" : localStorage.getItem("token"), 
        media: file ? {file, name : file.type} : ""});
        setMessageText("")
        setArrayURL([])
        setFile(undefined)
    }
  }; 

  useEffect(()=>{ 
    // получаю сообщения
      if(chatserverid){
        socket.on("server_chat_message", (data:any) => {
          console.log( data,"dataServerMessage")
          data = JSON.parse(data.message)
          setMessageArray((prev)=>[...prev,{content: data.content, from_user_id : data.from_user_id, uuid : data.uuid,timestamp : data.timestamp,media : data.media}]) 
        });
      }
        return ()=>{
          socket.off("server_chat_message")
        }
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
      <div className='message-container'>
          {chatid  &&
          <>   
          <div className="status-bar">
            <div className="user-chat avatar">
              {usersChat && (<>
              {usersChat.avatar  ? <img src={avatar} alt="" />: <img src={usersChat.avatar} alt="" /> }
              <p>{usersChat.login}</p>
              </>)}
            </div>
                <button onClick={()=>{
                  dispatch(fetchDeleteUser(chatid))
                  navigate("/chat")
                  dispatch(fetchGetUserChats())
                  }}>удалить</button>
          </div>
            <div className="get-message-cantainer">
              {messageArray.length !==0 ? messageArray.map((ms,index)=><Message key={index} uuid={ms.uuid} classUser={ms.from_user_id} media={ms.media}  time={ms.timestamp}>{ms.content}</Message>): null}
            </div>
            <div className="file-input">
              {file && (
              <img src={arrayURL[0]}/>
              )}
            </div>
            <InputMessage 
              setAudioBlob={setAudioBlob}
              sendMessage={sendMessage} 
              setFile={setFile} 
              setMessageText={setMessageText} 
              messageText={messageText} 
              dropImage={dropImage}
            />
          </>  
            }
            {chatserverid && serverid && 
            <>
              <div className="status-bar">
              <div className="user-chat avatar">
                {usersChat && (<>
                {usersChat.avatar !== "." ? <img src={avatar} alt="" />: <img src={usersChat?.avatar} alt="" /> }
                <p>{usersChat.login}</p>
                </>)}
              </div>
                  <button onClick={()=>{
                    dispatch(fetchDeleteServerChatRoom({server_chat_room_id: chatserverid, server_uuid: serverid}))
                    }}>удалить</button>
            </div>
              <div className="get-message-cantainer">
                {messageArray.length !==0 ? messageArray.map((ms,index)=><Message key={index} classUser={ms.from_user_id} media={ms.media} uuid={ms.uuid}  time={ms.timestamp}>{ms.content}</Message>): null}
              </div>
              <div className="file-input">
                {file && (<p>pltcm afqk</p>)}
              </div>
              <InputMessage 
               setAudioBlob={setAudioBlob}
                sendMessage={sendMessageServer}
                setFile={setFile} 
                setMessageText={setMessageText} 
                messageText={messageText} 
                dropImage={dropImage}
               />

            </>  
            }
            {!chatid && !chatserverid && <p>Hello add chat</p>}
      </div>

     
    </>
  )
}


export default MessageContainer
