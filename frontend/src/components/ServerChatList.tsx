import  { FC, useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks/redux-hoock'
import { NavLink, Outlet, useNavigate, useParams } from 'react-router-dom'
import { fetchCheckServerUser, fetchCreateServerChat, fetchDejoinServer, fetchDeleteServer, fetchGetServer, fetchGetServerChatRooms, fetchpostChangeServersTitle, fetchpostInvitationLink,fetchСhangeServersAvatar } from '../store/actionServer'
import ModuleTest from './Module'







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
    const refImage = useRef<HTMLInputElement>(null) 
    const [file,setFile] = useState<File | undefined>(undefined)

    useEffect(()=>{
      if(serverid){
        dispatch(fetchGetServerChatRooms(serverid)) 
        dispatch(fetchCheckServerUser(serverid)).then(res=>{setIsAdmin(res.payload.is_owner)})
      }
    },[serverid])
   
    const newAvatar=()=>{
      console.log(file)
      const formData = new FormData()
      if(file && serverid){
        formData.append("file",file)
        formData.append("uuid",serverid)
        dispatch(fetchСhangeServersAvatar(formData))
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
        <button onClick={deleteServer}>dalete server</button>
        <button onClick={()=>setIsModule(true)}>изменить имя сервера</button>
        <button onClick={()=>{setIsModuleAvatar(true)}}>изменить аватар сервера</button>
      </> 
      : 
      <button onClick={()=>{serverid && dispatch(fetchDejoinServer(serverid)).then(()=>navigate("/chat")).then(()=>{dispatch(fetchGetServer())})}}>exit server</button>}
     
      <button onClick={inviteServer}>пригласить</button>
      <input type="text" onChange={(e)=>{setChatName(e.target.value)}} value={chatName}/>
      <button onClick={()=>{ 
        if(serverid){
          dispatch(fetchCreateServerChat({title: chatName,uuid_server : serverid}))
          .then(()=>{dispatch(fetchGetServerChatRooms(serverid))})
        }}}>создать чат</button>
        {serverRooms.map(room=>(
        <NavLink to={`/server/${serverid}/${room.uuid}`} key={room.uuid}>
          <div className='server-chat-block'>{room.title}</div>
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
        <p>http://127.0.0.1:8000/{link}</p>
        </ModuleTest>}
        {isModuleAvatar && <ModuleTest isModule={setIsModuleAvatar}>
        <input ref={refImage} type="file" accept='image/*,.png,.web,.jpg,.gif' onChange={(e)=>{if(e.target.files) setFile(e.target.files[0])}} className='none'/>
           <button onClick={()=>{
               if(refImage.current){
                refImage.current.click()
              }
           }}>иыбрать</button>
            <button onClick={newAvatar}>Сохранить</button>
        </ModuleTest>}
      <Outlet></Outlet>
  
    </>
  )
}

export default ServerChatList
