import  { FC, useEffect,  useRef,  useState } from 'react'
import { useNavigate, useParams, } from 'react-router-dom'
import { socket } from '../socket';
import { useAppDispatch, useAppSelector } from '../hooks/redux-hoock';
import { fetchDeleteUser } from '../store/acthion';
import Message from './Message';
import avatar from "../assets/sonic.jpg"
import callIcon from "../assets/call.png"
import { IUserChatT } from '../models/IUserChat';
import { fetchDeleteServerChatRoom, fetchDeleteServersMessage, fetchGetServerChatRoomMessages, fetchGetServerChatRooms, fetchGetchangeServerMessage } from '../store/actionServer';
import { fetchDeleteChatMessage, fetchGetChatMessage, fetchGetUserChats } from '../store/acthionChat';
import InputMessage from './InputMessage';
import ServerUsersList from './ServerUsersList';
import VideoCallBlock from './VideoCallBlock';
import { addMessage, addUsersChat } from '../store/ChatsSlice';
import "../css/message_container.css"


const  MessageContainer : FC=()=> {
  const {chatid,chatserverid,serverid} = useParams()
  const [limit, setLimit] = useState<number>(10)
  const [isCallBlock,setIsCallBlock] = useState<boolean>(false)
  const [messageText,setMessageText] = useState<string>("")
  const [roomId,setRoomId] = useState<string>("")
  const [messageArray,setMessageArray] = useState<any[]>([])
  const dispatch = useAppDispatch()
  const message = useAppSelector(state=>state.chats.getMessage)
  const messageUser = useAppSelector(state=>state.chats.message)
  const serverMessages = useAppSelector(state=>state.server.serverChatMessages)
  const message_count = useAppSelector(state=>state.chats.message_count)
  const userMe = useAppSelector(state=>state.auth.user)
  const [file,setFile] = useState<File>()
  const [files,setFiles] = useState<File[] | undefined>()
  const [usersChat,setUsersChat]= useState<IUserChatT>()
  const navigate = useNavigate()
  const [arrayURL,setArrayURL] = useState<string[]>([])
  const messageContainer = useRef<HTMLDivElement>(null)
  const [doMs,setDoMs]= useState<number>(0)

  const joinRoom = (room:any) => {
    console.log("room")
    socket.emit("join", {"username" : userMe.login, "chat_id" : room});
    setRoomId(room)
  };
 
  const getMessage = async ()=>{
    console.log(limit)
    chatid && await dispatch(fetchGetChatMessage({chat_id:chatid,count:limit}))
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
  if(userMe && Object.keys(userMe).length !== 0 ){
    socket.on("join",(data:any)=>{
      console.log(data.users_data.users_data,"user")
      const user  = data.users_data.users_data.find((usern:any)=>usern.uuid !== userMe.uuid)
      setUsersChat(user)
      dispatch(addUsersChat(user))
    })
  }
  if(userMe && Object.keys(userMe).length !== 0 ){
    socket.on("join_server_chat",(data:any)=>{
      console.log(data.users_data.users_data,"userццацаца")
      const user  = data.users_data.users_data.find((usern:any)=>usern.uuid !== userMe.uuid)
      setUsersChat(user)
      dispatch(addUsersChat(user))
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
        // media: file ? {file, name : file?.type} : ""});
        media: files ? {file:files, name : files[0]?.type} : ""});
        setMessageText("")
        setArrayURL([])
        setFile(undefined)
      
    }
 

  }; 

    
  useEffect(()=>{ 
    // получаю сообщения
      if(chatid){
        socket.on("message", async(data:any) => {
          data = JSON.parse(data.message)
          console.log( data)
          await setMessageArray((prev)=>[...prev,{content: data.content, from_user_id : data.from_user_id, uuid : data.uuid,timestamp : data.timestamp,media : data.media}]) 
          scroll()
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
    
      // socket.on("join_server_chat",(data:any)=>{
      //   console.log(data,"dataServerJoin")
      // })
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
          console.log(data)
          setMessageArray((prev)=>[...prev,{content: data.content, from_user_id : data.from_user_id, uuid : data.uuid,timestamp : data.timestamp,media : data.media}]) 
        });
      }
        return ()=>{
          socket.off("server_chat_message")
        }
  },[chatserverid])



  const dropImage=(e:React.DragEvent<HTMLDivElement>)=>{
    e.preventDefault()
    setArrayURL([])
    const files = [...e.dataTransfer.files]
    console.log(files)
    if(files && files.length){
      setFile(files[0])
      console.log(files)
      setFiles(files)
      files.filter((i)=>setArrayURL((prev)=>[...prev,window.URL.createObjectURL(i)]) )
      // setArrayURL([window.URL.createObjectURL(files[0])]) 
  }else{
      
  }
  }

  const scroll=()=>{
   
    messageContainer.current?.scrollBy(0,messageContainer.current.scrollHeight)
    if(messageContainer.current)
    console.log(messageContainer.current.scrollHeight,"scroll")
    console.log(doMs,"scroll")
    messageContainer.current && setDoMs(messageContainer.current?.scrollHeight)
  }

  const scrollView=()=>{
      if(doMs !==messageContainer.current?.scrollHeight && messageContainer.current ){
          console.log(doMs,"do")
          console.log(messageContainer.current.scrollHeight,"posle")
          messageContainer.current?.scrollBy(0,messageContainer.current.scrollHeight - (doMs))
          setDoMs(messageContainer.current.scrollHeight)
      }
  }
  useEffect(()=>{
    if(limit ==10){
      scroll()
      // console.log(messageContainer.current.scrollHeight,"scroll2")
    }else{
      scrollView()
    }
  
  },[messageArray])




  return (
    <>
      
          {chatid  &&
          <>   
          <div className='message-container'>
          <div className="status-bar">
            <div className="user-chat avatar">
              {usersChat && (<>
              {usersChat.avatar== ""  ? <img src={"http://localhost:5173/"+avatar} alt="" />: <img src={"http://localhost:5173/"+usersChat.avatar} alt="" /> }
              <p>{usersChat.login}</p>
              </>)}
            </div>
                <button onClick={()=>{
                  dispatch(fetchDeleteUser(chatid))
                  .then(()=>{navigate("/chat")})
                  .then(()=>{dispatch(fetchGetUserChats())})
                  }}>удалить</button>
                  <img src={callIcon} className='icon-message' onClick={()=>{setIsCallBlock(true)}}/>
          </div>
            <div className="get-message-cantainer" ref={messageContainer} onScroll={()=>{
              if(messageContainer.current?.scrollTop == 0){
                if(limit >= message_count+10){
                }else{
                  setLimit((prev)=>prev+10)
                  getMessage()
                }
              }
            }}>
              {messageArray.length !==0 ? messageArray.map((ms,index)=><Message key={index} uuid={ms.uuid} classUser={ms.from_user_id} media={ms.media}  time={ms.timestamp} children={ms.content}/>): null}
                  
            </div>
            <div className="file-input">
              {file &&  arrayURL.map(i=>(<img src={i} key={i}/>)) }
            </div>
            {messageUser.uuid &&   
            <div> 
              <button onClick={()=>dispatch(addMessage(""))}>X</button>
              <button onClick={()=>{
                chatid &&  dispatch(fetchDeleteChatMessage(messageUser.uuid)).then(()=>{dispatch(fetchGetChatMessage({chat_id:chatid,count:limit}))}).then(()=>dispatch(addMessage("")))
                }}>удалить
              </button>
              <button>Ответ</button>
              
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
                <div className="user-chat avatar">
                  {usersChat && (<>
                  {usersChat.avatar !== "." ? <img src={avatar} alt="" />: <img src={usersChat?.avatar} alt="" /> }
                  <p>{usersChat.login}</p>
                  </>)}
                </div>
                    <button onClick={()=>{
                      dispatch(fetchDeleteServerChatRoom({server_chat_room_id: chatserverid, server_id: serverid}))
                      .then(()=>navigate(`/server/${serverid}`))
                      .then(()=>{dispatch(fetchGetServerChatRooms(serverid))})
                      }}>удалить</button>

                      <img/>
              </div>
                <div className="get-message-cantainer" ref={messageContainer} >
                  {messageArray.length !==0 ? messageArray.map((ms,index)=><Message key={index} classUser={ms.from_user_id} media={ms.media} uuid={ms.uuid}  time={ms.timestamp}>{ms.content}</Message>): null}
                </div>
                <div className="file-input">
                {file &&  arrayURL.map(i=>(<img src={i} key={i}/>)) }
                </div>
                {messageUser.uuid &&   
                  <div> 
                    <button onClick={()=>{
                      chatserverid && dispatch(fetchDeleteServersMessage(messageUser.uuid)).then(()=>{dispatch(fetchGetServerChatRoomMessages(chatserverid))}).then(()=>dispatch(addMessage("")))
                      }}>удалить
                    </button>
                    <button onClick={()=>{dispatch(fetchGetchangeServerMessage({message_uuid: messageUser.uuid,new_content:"iuwhduwhdu"}))
                                          .then((res)=>{        
                                           if(res.payload.result){
                                            const str = messageArray.map((item)=>{
                                              if(item.uuid == messageUser.uuid){
                                                // item.content = "iuwhduwhdu"
                                                return {...item,content : "iuwhduwhdu"}
                                              }
                                              return item
                                              } )          
                                              setMessageArray(str)
                                           }
                                        })}}>Изменить</button>
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
            {!chatid && !chatserverid && <div className="message-container"><p>Hello add chat</p></div>}
     
           
     
    </>
  )
}


export default MessageContainer
