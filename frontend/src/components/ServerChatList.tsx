import  { FC, useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks/redux-hoock'
import { NavLink, Outlet, useNavigate, useParams } from 'react-router-dom'
import { fetchCheckServerUser, fetchCreateServerAudioChatRoom, fetchCreateServerChat, fetchDejoinServer, fetchDeleteServer, fetchGetServer, fetchGetServerChatRooms, fetchgetServerAudioChatRooms, fetchpostChangeServersTitle, fetchpostInvitationLink,fetchСhangeServersAvatar } from '../store/actionServer'
import ModuleTest from './Module'
import avatar from "../assets/sonic.jpg"
import "../css/chat_meassage.css"
import ServerRolePanel from './ServerRolePanel'
import { fetchPostCheckUserPermission, fetchPostGetServersMembers, fetchgetServersRoles } from '../store/acthionServerUser'





const ServerChatList:FC=()=> {
    const dispatch = useAppDispatch()
    const {serverid}= useParams()
    const [chatName,setChatName] = useState<string>("")
    const navigate = useNavigate()
    const [isModule,setIsModule] = useState<boolean>(false)
    const [isModuleAvatar,setIsModuleAvatar] = useState<boolean>(false)
    const [isModuleInvite,setIsModuleInvite] = useState<boolean>(false)
    const [serverTitle,setServerTitle] = useState<string>("")
    const [link,setLink] = useState<string>("")
    const [isAdmin,setIsAdmin] = useState<boolean>(false)
    const serverRooms = useAppSelector(state=>state.server.serverChatSRooms)
    const serverRoomsVoice = useAppSelector(state=>state.server.serverChatSRoomsVoice)
    const refImage = useRef<HTMLInputElement>(null) 
    const [file,setFile] = useState<File | undefined>(undefined)
    const [isCreateServerRoom, setIsCreateServerRoom] = useState<boolean>(false)
    const [isCreateServerRoomVoice, setIsCreateServerRoomVOice] = useState<boolean>(false)
    const [isPer,setIsPer] = useState<boolean>(false)

    useEffect(()=>{
      if(serverid){
        console.log(serverid)
        dispatch(fetchGetServerChatRooms(serverid)) 
        dispatch(fetchgetServerAudioChatRooms(serverid))
        dispatch(fetchCheckServerUser(serverid)).then(res=>{setIsAdmin(res.payload.is_owner)})
        dispatch(fetchPostGetServersMembers(serverid))
        dispatch(fetchPostCheckUserPermission({server_uuid:serverid,permission:"CREATE_PRIVATE_CHAT"}))
        dispatch(fetchgetServersRoles(serverid))
      }
    },[serverid])
   
    const newAvatar=()=>{
      console.log(file)
      const formData = new FormData()
      if(file && serverid){
        formData.append("file",file)
        formData.append("title",serverid)
        dispatch(fetchСhangeServersAvatar(formData)).then(()=>{dispatch(fetchGetServer())})
        setIsModuleAvatar(false)
      }
      
    }
    const deleteServer=()=>{
      serverid && dispatch(fetchDeleteServer(serverid))
                .then(()=>{navigate("/chat")})
                .then(()=>{dispatch(fetchGetServer())})
    }
    
    const newTitleServer=()=>{
      dispatch(fetchpostChangeServersTitle({server_uuid : serverid,title: serverTitle}))
      setIsModule(false)
      console.log("wojdiw")
    }

    const inviteServer=()=>{
      serverid && dispatch(fetchpostInvitationLink(serverid)).then((res)=>{setLink(res.payload.link)})
      setIsModuleInvite(true)
    }

  return ( 
    <>
     <div className='chat-list-container'>
      {isAdmin ? 
       <>
        {/* <button onClick={deleteServer}>dalete server</button>
        <button onClick={()=>setIsModule(true)}>изменить имя сервера</button>
        <button onClick={()=>{setIsModuleAvatar(true)}}>изменить аватар сервера</button> */}
        <button onClick={()=>{setIsPer(true)}}>permession</button>
        <button onClick={()=>{
          navigate(`/server/${serverid}/set`)
        }}>setting</button>
      </> 
      : 
      <button onClick={()=>{serverid && dispatch(fetchDejoinServer(serverid)).then(()=>navigate("/chat")).then(()=>{dispatch(fetchGetServer())})}}>exit server</button>}
     
      <button onClick={inviteServer}>пригласить</button>
        <p>ТЕКСТОВЫЕ КАНАЛЫ 
          {isAdmin && <span onClick={()=>{setIsCreateServerRoom(true)}} className='add-server-room'>+</span>}
        </p>
       
        {serverRooms && serverRooms.length && serverRooms.map(room=>(
        <NavLink to={`/server/${serverid}/${room.uuid}`} key={room.uuid}
        className={({ isActive, isPending }) =>
          isPending ? "pending-link" : isActive ? "active " : "active-link"
        }
        >
          <div className='server-chat-block'><p>{room.title}</p></div>
        </NavLink>
        ))}


        <p>ГОЛОСОВЫЕ КАНАЛЫ 
          {isAdmin && <span onClick={()=>{setIsCreateServerRoomVOice(true)}} className='add-server-room'>+</span>}
        </p>
        {serverRoomsVoice && serverRoomsVoice.length && serverRoomsVoice.map(room=>(
        <NavLink to={`/server/${serverid}/voice/${room.uuid}`} key={room.uuid}
        className={({ isActive, isPending }) =>
          isPending ? "pending-link" : isActive ? "active " : "active-link"
        }
        >
          <div className='server-chat-block'><p>{room.title}</p></div>
        </NavLink>
        ))}
        

     </div>
      {isModule && 
        <ModuleTest isModule={setIsModule}>
          <input type="text" onChange={e=>setServerTitle(e.target.value)} value={serverTitle}/>
          <button onClick={newTitleServer}>Сохранить</button>
        </ModuleTest>}
      {isModuleInvite && <ModuleTest isModule={setIsModuleInvite}>
        <h1>Скопируйте ссылку</h1>
        <button onClick={()=>{
          navigator.clipboard.writeText("localhost:5173/"+link).then(()=>{console.log(true)})
          setIsModuleInvite(false)
        }}>copy</button>
        <p>localhost:5173/{link}</p>
        </ModuleTest>}
        {isModuleAvatar && <ModuleTest isModule={setIsModuleAvatar}>
        <input ref={refImage} type="file" accept='image/*,.png,.web,.jpg,.gif' onChange={(e)=>{if(e.target.files) setFile(e.target.files[0])}} className='none'/>
           {file ? <img src={window.URL.createObjectURL(file)} alt="" className='server-setting-avatar'/> : <img src={"http://localhost:5173/"+avatar} alt="" className='server-setting-avatar'/>}
           <button onClick={()=>{
               if(refImage.current){
                refImage.current.click()
              }
           }}>иыбрать</button>
            <button onClick={newAvatar}>Сохранить</button>
        </ModuleTest>}
        {isCreateServerRoom && 
        <ModuleTest isModule={setIsCreateServerRoom}>
          <input type="text" onChange={(e)=>{setChatName(e.target.value)}} value={chatName}/>
          <button onClick={()=>{ 
             if(serverid && chatName){
            dispatch(fetchCreateServerChat({title: chatName,uuid_server : serverid}))
            .then(()=>{dispatch(fetchGetServerChatRooms(serverid))})
            setChatName("")
            setIsCreateServerRoom(false)
        }}}>создать чат</button>
        </ModuleTest>
        }
        {isCreateServerRoomVoice &&  
        <ModuleTest isModule={setIsCreateServerRoomVOice}>
          <input type="text" onChange={(e)=>{setChatName(e.target.value)}} value={chatName}/>
          <button onClick={()=>{ 
             if(serverid){
            dispatch(fetchCreateServerAudioChatRoom({title: chatName,uuid : serverid}))
            .then(()=>{dispatch(fetchgetServerAudioChatRooms(serverid))})
            setChatName("")
            setIsCreateServerRoomVOice(false)
        }}}>создать чат</button>
        </ModuleTest>}

        {isPer  && 
          <ModuleTest isModule={setIsPer}>
            <ServerRolePanel></ServerRolePanel>
          </ModuleTest>
        }
      <Outlet></Outlet>
  
    </>
  )
}

export default ServerChatList
