import  { FC, useEffect,  useRef,  useState } from 'react'
import { useNavigate, useParams, } from 'react-router-dom'
import { socket } from '../socket';
import { useAppDispatch, useAppSelector } from '../hooks/redux-hoock';
import { fetchDeleteUser } from '../store/acthion';
import avatar from "../assets/sonic.png"
import callIcon from "../assets/Mask group.png"
import { IMessage, IUserChatT } from '../models/IUserChat';
import { fetchDeleteServerChatRoom, fetchDeleteServersMessage, fetchGetServerChatRoomMessages, fetchGetServerChatRooms, } from '../store/actionServer';
import {  fetchDeleteChatMessage, fetchGetChatMessage, fetchGetUserChats, fetchReadMessage } from '../store/acthionChat';
import InputMessage from './InputMessage';
import ServerUsersList from './ServerUsersList';
import VideoCallBlock from './VideoCallBlock';
import { addMessage, addNewBlockMessage, addNewMessagNull, addNewMessage, addNewMessageStatus, addUsersChat} from '../store/ChatsSlice';
import "../css/message_container.css"
import {  changeMessageN } from '../hooks/changeMessage';
import ModuleTest from './Module';
import MessageBlock from './MessageBlock';
import { v4 as uuidv4 } from 'uuid';
import { TmessageBlocks } from '../hooks/useCreateMessageBlock';
import deletepmg from "../assets/delete.png"
import icon4 from "../assets/icon4.png"


const  MessageContainer : FC=()=> {
  const {chatid,chatserverid,serverid} = useParams()
  const [limit, setLimit] = useState<number>(30)
  const {userPerm}= useAppSelector((state)=>state.server)
  const [isCallBlock,setIsCallBlock] = useState<boolean>(false)
  const [messageText,setMessageText] = useState<string>("")
  const dispatch = useAppDispatch()
  const message = useAppSelector(state=>state.chats.getMessage)
  const messageUser = useAppSelector(state=>state.chats.message)
  const serverMessages = useAppSelector(state=>state.server.serverChatMessages)
  const message_count = useAppSelector(state=>state.chats.message_count)
  const usersConnect = useAppSelector(state=>state.chats.usersConnect)
  const newMessage = useAppSelector(state=>state.chats.newMessage)
  const BlockNewMessage = useAppSelector(state=>state.chats.BlockMessage)
  const userMe = useAppSelector(state=>state.auth.user)
  const [isModule,setIsModule] = useState<boolean>(false)
  const [file,setFile] = useState<File>()
  const [usersChat,setUsersChat]= useState<IUserChatT>()
  const navigate = useNavigate()
  const [arrayURL,setArrayURL] = useState<string[]>([])
  const messageContainer = useRef<HTMLDivElement>(null)
  const [doMs,setDoMs]= useState<number>(0)
  const [newContent,setNewContent] = useState<string>("")
  const [usersInChate,setusersInChate] = useState<string[]>([])
  const [userInStatus,setUserInStatus]  = useState<boolean>(false)
  
  const joinRoom = (room:any) => {
    console.log("join","username",userMe.login,"chat_id",room,"uuid",userMe.uuid)
    socket.emit("join", {"username" : userMe.login, "chat_id" : room,uuid:userMe.uuid});
    socket.emit("user-joined",{uuid:userMe.uuid})
  
  };
 
  const getMessage = async ()=>{
    chatid && await dispatch(fetchGetChatMessage({chat_id:chatid,count:limit}))
  }

   
  useEffect(()=>{
    //вход в комнату
    if(chatid && Object.keys(userMe).length !== 0){
      joinRoom(chatid)
      getMessage()
      }
      return ()=>{
        if(chatid ){
         console.log("ok  c","na",chatid,"выход","uuid",userMe.uuid)
         socket.emit("leave",{"chat_id" : chatid, uuid:userMe.uuid})
         dispatch(addNewMessagNull())
         dispatch(addNewBlockMessage({array:[]}))
        }
       }
  },[chatid,userMe])

useEffect(()=>{

},[])

 useEffect(()=>{
 
  if(userMe && chatid && Object.keys(userMe).length !== 0 ){
    socket.on("join",(data:any)=>{
      console.log(data.users_data.users_data,"user")
      const user  = data.users_data.users_data.find((usern:any)=>usern.uuid !== userMe.uuid)
      setUsersChat(user)
      dispatch(addUsersChat(user))
    })
  }
  if(userMe && chatserverid && Object.keys(userMe).length !== 0 ){
    socket.on("join_server_chat",(data:any)=>{
      console.log(data.users_data.users_data,"userццацаца")
      const user  = data.users_data.users_data.find((usern:any)=>usern.uuid !== userMe.uuid)
      setUsersChat(user)
      dispatch(addUsersChat(user))
    })
  }
  return ()=>{
    socket.off("join")
    socket.off("join_server_chat")
  }
  },[userMe,chatid,chatserverid])

  useEffect(()=>{
    {message &&  createMeassageBlock(message)}  
  },[message])


  const sendMessage = () => {
    // отправляю сообщение 
    
    if(messageText.trim()){
      socket.emit("message", {
        "data" : messageText, 
        "chat_id" : chatid, 
        "token" : localStorage.getItem("token"), 
        // media: file ? {file, name : file?.type} : ""});
        media: file ? {file:file, name : file?.type} : ""});
        setMessageText("")
        setArrayURL([])
        setFile(undefined)
      
    }
 

  }; 

  const s=(data:any)=>{
    console.log(usersInChate,"usersInChate Status")
    if(data.from_user_id !== userMe.uuid){
      if(usersConnect.includes(data.from_user_id) && usersInChate.length == 2){
          console.log("neua")
          dispatch(fetchReadMessage(data.uuid))
          console.log(2)
          data.has_read = true
          return data
      }
    }else{
      if(usersInChate.length == 2){
        console.log("ya")
        data.has_read = true
        return data
      }
      return data
    }
    return data
  }
  useEffect(()=>{
    console.log(newMessage,"newMessage")
    console.log(BlockNewMessage,"BlockNewMessage123")
  },[newMessage])



  const createMeassageBlock=(message:any)=>{
    dispatch(addNewBlockMessage({array: []}))
    dispatch(addNewMessagNull())
    if(message.length !==0 ){
      let newMessageBlock:TmessageBlocks[]  = []
      for(let i=0;i<message.length;i++){
        if(newMessageBlock[newMessageBlock.length-1] == undefined){
          let idBlock = uuidv4()
          newMessageBlock.push({idBlock:idBlock,userBlock:message[i].from_user_id})
          dispatch(addNewBlockMessage({id:idBlock,user:message[i].from_user_id}))
          dispatch(addNewMessage({id:idBlock,ms:message[i]}))
        }else if(newMessageBlock[newMessageBlock.length-1].userBlock == message[i].from_user_id){
          let idBlock = newMessageBlock[newMessageBlock.length-1].idBlock
          dispatch(addNewMessage({id:idBlock,ms:message[i]}))
        }else{
          let idBlock = uuidv4()
          newMessageBlock.push({idBlock:idBlock,userBlock:message[i].from_user_id})
          dispatch(addNewBlockMessage({id:idBlock,user:message[i].from_user_id}))
          dispatch(addNewMessage({id:idBlock,ms:message[i]}))
        }
      }
      console.log(BlockNewMessage,"newMessage123")
      console.log(newMessage,"newMessage")
    }  else{
      dispatch(addNewBlockMessage({array: []}))
      dispatch(addNewMessagNull())
     
    }
  }

  useEffect(()=>{
    if(chatid  && Object.keys(newMessage).length !==0){
      function userChanged(data:any) {
        console.log(data,"user-changed")
        if(data.user_status){
            setusersInChate([...data.users_in_room])
            if(data.users_in_room.length == 2){
              let keys = Object.keys(newMessage)
              keys.map(i=>{
                if(newMessage[i].find((i)=>i.has_read == false)){
                  newMessage[i].map((item)=>{
                          if(item.has_read == false){
                            // console.log(item.has_read)
                            dispatch(addNewMessageStatus({id:i}))
                           
                            console.log(1)
                            return item
                          }
                          return item
                      })
                }
                
              })
              keys.map(i=>{
                if(newMessage[i].find((i)=>i.has_read == false)){
                  newMessage[i].map((item)=>{
                          if(item.has_read == false){
                            // console.log(item.has_read)
                        
                            dispatch(fetchReadMessage(item.uuid))
                            console.log(3)
                            return item
                          }
                          return item
                      })
                }
                
              })
            }
        }else{
          const userofflineInChat = usersInChate
          if(userofflineInChat.includes(data.user_uuid)){
            userofflineInChat.splice( userofflineInChat.indexOf(data.user_uuid),1)
            setusersInChate([...userofflineInChat])
          }
        }
       console.log(usersInChate,"usersInChate")
      }
      socket.on("user-changed",userChanged)
    }
   
    return ()=>{socket.off("user-changed")}


  },[socket,chatid,usersInChate,newMessage])
    



const updateBlockOrMesasage=async(datan:any)=>{
  let  data:IMessage = JSON.parse(datan.message)
  console.log( data)
  if(chatid){
    console.log("sssssssssssss")
    data =  s(data)
  }
  
  if(BlockNewMessage[0] == undefined && Object.keys(newMessage).length ==0){
    console.log(BlockNewMessage[0],"BlockMessage[0]1")
    console.log(newMessage,"newMessage1")
    let idBlock = uuidv4()
    console.log(1)
    dispatch(addNewBlockMessage({id:idBlock,user:data.from_user_id}))
    dispatch(addNewMessage({id: idBlock,ms:data}))
  }else if(BlockNewMessage[BlockNewMessage.length-1].userBlock == data.from_user_id ){
    console.log(2)
    console.log(BlockNewMessage[BlockNewMessage.length-1].userBlock,"=BlockMessage[0]1   data.from_user_id =",data.from_user_id)
    console.log(newMessage,"newMessage1")
    dispatch(addNewMessage({id: BlockNewMessage[BlockNewMessage.length-1].idBlock,ms:data}))
  }else{
    let idBlock = uuidv4()
    dispatch(addNewBlockMessage({id:idBlock,user:data.from_user_id}))
    dispatch(addNewMessage({id: idBlock,ms:data}))
  }
  scroll()
}



  useEffect(()=>{ 
      if(chatid && Object.keys(userMe).length !== 0 && usersChat && usersConnect && usersInChate){
        socket.on("message", updateBlockOrMesasage);
      }
      return ()=>{
        socket.off("message")
      }
        
  },[socket,chatid,userMe,usersChat,usersConnect,usersInChate,newMessage])



  
  ///////////////////////////////////////////////////////////////////
                  //SERVER
  //////////////////////////////////////////////////////////////////
 


  useEffect(()=>{
    if(chatserverid){
      socket.emit("join_server_chat",{chat_id:chatserverid})
      dispatch(fetchGetServerChatRoomMessages(chatserverid))
    }

    return()=>{
      dispatch(addNewMessagNull())
      dispatch(addNewBlockMessage({array:[]}))
    }

  },[chatserverid])


  useEffect(()=>{
    {serverMessages && createMeassageBlock(serverMessages)}
  },[serverMessages])

  const sendMessageServer = () => {
    // отправляю сообщение 
   
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
      if(chatserverid ){
        socket.on("server_chat_message", updateBlockOrMesasage);
      }
        return ()=>{
          socket.off("server_chat_message")
        }
  },[chatserverid,BlockNewMessage])



  const dropImage=(e:React.DragEvent<HTMLDivElement>)=>{
    e.preventDefault()
    setArrayURL([])
    const files = [...e.dataTransfer.files]
    console.log(files)
    if(files && files.length){
      setFile(files[0])
      console.log(files)
      setArrayURL([window.URL.createObjectURL(files[0])]) 
  }else{
      
  }
  }

  const scroll=()=>{
   setTimeout(()=>{
    messageContainer.current?.scrollBy(0,messageContainer.current.scrollHeight+100)
   },50)
    if(messageContainer.current)
    messageContainer.current && setDoMs(messageContainer.current?.scrollHeight)
  }

  const scrollView=()=>{
      if(doMs !==messageContainer.current?.scrollHeight && messageContainer.current ){
          messageContainer.current?.scrollBy(0,messageContainer.current.scrollHeight - (doMs))
          setDoMs(messageContainer.current.scrollHeight)
      }
  }



  useEffect(()=>{
    if(limit ==10){
      scroll()
    }else{
      scrollView()
    }
  
  },[newMessage])

  useEffect(()=>{
   if(usersChat && usersChat.uuid){
    if(usersConnect.find((i)=>i==usersChat.uuid)){
      setUserInStatus(true)
    }else{
      setUserInStatus(false)
    }
   }
},[usersConnect,usersChat])

const isChangemessage=()=>{
  return(
    <>
    <ModuleTest isModule={setIsModule}>
                <>
                  <input type="text" onChange={(e)=>{setNewContent(e.target.value)}} value={newContent}/>
                  <button onClick={()=>{
                    chatid && changeMessageN(newMessage,messageUser,dispatch,{chatid},newContent)
                    chatserverid && changeMessageN(newMessage,messageUser,dispatch,{chatserverid},newContent)
                    setIsModule(false)
                    setNewContent("")
                    }}>сохранить</button>
                </>
    </ModuleTest>
    </>
  )
}


  return (
    <>
      
          {chatid  &&
          <>   
          <div className='message-container' >
          <div className="status-bar">
            <div className="user-chat avatar">
              {usersChat && (<>
              {usersChat.avatar== ""  ? <img src={"http://localhost:5173/"+avatar} alt="" />: <img src={"http://localhost:5173/"+usersChat.avatar} alt="" /> }
              <p>{usersChat.login}</p>
              </>)}
              {userInStatus ? <div className="status-ch"></div> : <div className="status-red-ch"></div>}
            
            </div>
            
            <div className="con-sh">
            <img src={deletepmg} alt="" onClick={()=>{
                        dispatch(fetchDeleteUser(chatid))
                        .then(()=>{navigate("/chat")})
                        .then(()=>{dispatch(fetchGetUserChats())})
                        }}/>
                  <img src={callIcon} className='icon-message icon-call' onClick={()=>{setIsCallBlock(true)}}/>
            </div>
               
          </div>
            <div className="get-message-cantainer" ref={messageContainer} 
            onScroll={()=>{
              if(messageContainer.current?.scrollTop == 0){
                if(limit >= message_count+10){
                }else{
                  setLimit((prev)=>prev+10)
                  getMessage()
                }
              }
            }}>
                {BlockNewMessage.length !==0 ? BlockNewMessage.map((messageBlock)=><MessageBlock key={messageBlock.idBlock} messageBlock={messageBlock.userBlock} Blockid={messageBlock.idBlock}></MessageBlock>) : null}  
            </div>
            <div className="file-input">
              {file &&  arrayURL.map(i=>(<img src={i} key={i}/>)) }
            </div>
            {messageUser.uuid &&   
            <div className='block-act'> 
              <button onClick={()=>dispatch(addMessage(""))}>закрыть</button>
              <button onClick={()=>{
                chatid &&  dispatch(fetchDeleteChatMessage(messageUser.uuid)).then(()=>{dispatch(fetchGetChatMessage({chat_id:chatid,count:limit}))}).then(()=>dispatch(addMessage("")))
                }}>удалить
              </button>
              {messageUser.media.length == 0  &&  <button onClick={()=>setIsModule(true)}>изменить</button>}
                {isModule && isChangemessage()}
            </div>
        }
            <InputMessage 
              sendMessage={sendMessage} 
              setFile={setFile} 
              setMessageText={setMessageText} 
              messageText={messageText} 
              dropImage={dropImage}
              setArrayURL={setArrayURL}
            />
             {isCallBlock && <VideoCallBlock user={userMe.login} setIsCallBlock={setIsCallBlock}/>}
            </div>
          </>  
            }
            {chatserverid && serverid && 
            <>
            <div className="server-message-container ">
              <div className="message-container">
                <div className="status-bar">
                  <img src={icon4}/>
                {userPerm["DELETE_CHAT"] &&  <img src={deletepmg} alt="" onClick={()=>{
                      dispatch(fetchDeleteServerChatRoom({server_chat_room_id: chatserverid, server_id: serverid}))
                      .then(()=>navigate(`/server/${serverid}`))
                      .then(()=>{dispatch(fetchGetServerChatRooms(serverid))})
                      }}/>
                  }
              </div>
                <div className="get-message-cantainer" ref={messageContainer} >
                {BlockNewMessage.length !==0 ? BlockNewMessage.map((messageBlock)=><MessageBlock key={messageBlock.idBlock} messageBlock={messageBlock.userBlock}  Blockid={messageBlock.idBlock}></MessageBlock>) : null}  
               
                </div>
                <div className="file-input">
                {file &&  arrayURL.map(i=>(<img src={i} key={i}/>)) }
                </div>
                {messageUser.uuid &&   
                  <div className='block-act'> 
                    {userPerm["DELETE_MSGS"] && 
                     <button onClick={()=>{
                      console.log(messageUser.uuid)
                      chatserverid && dispatch(fetchDeleteServersMessage({ms:messageUser.uuid,server:serverid})).then(()=>{dispatch(fetchGetServerChatRoomMessages(chatserverid))}).then(()=>dispatch(addMessage("")))
                      }}>удалить
                    </button>
                    }
                   {/* {userMe.uuid ==} */}
                    <button onClick={()=>setIsModule(true)}>Изменить</button>
                    {isModule && isChangemessage()}
                  </div>
                }
                <InputMessage 
                  sendMessage={sendMessageServer}
                  setFile={setFile} 
                  setMessageText={setMessageText} 
                  messageText={messageText} 
                  dropImage={dropImage}
                  setArrayURL={setArrayURL}
                />
              
                </div>
               <ServerUsersList/>
              </div>
            </>  
            }
            {!chatid && !chatserverid && <div className="message-container"><p className='center'>Здесь пока ничего нет...</p></div>}
     
           
     
    </>
  )
}


export default MessageContainer
