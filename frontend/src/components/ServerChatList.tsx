import  { FC, useEffect,  useState } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks/redux-hoock'
import { NavLink, Outlet, useNavigate, useParams } from 'react-router-dom'
import { fetchCheckServerUser, fetchCreateServerAudioChatRoom, fetchCreateServerChat, fetchDejoinServer,  fetchGetServer, fetchGetServerChatRooms, fetchgetServerAudioChatRooms} from '../store/actionServer'
import ModuleTest from './Module'

import "../css/chat_meassage.css"
import ServerRolePanel from './ServerRolePanel'
import { fetchGetAllPermissions,  fetchgetServerMembersRolePermissions, fetchgetServersRoles } from '../store/acthionServerUser'
import vector from "../assets/Vector.png"
import chatli from "../assets/chat-server.png"
import chatlivoice from "../assets/voice-chat.png"




const ServerChatList:FC=()=> {
    const dispatch = useAppDispatch()
    const {serverid}= useParams()
    const [chatName,setChatName] = useState<string>("")
    const navigate = useNavigate()
    const {userPerm}= useAppSelector((state)=>state.server)
    const [isAdmin,setIsAdmin] = useState<boolean>(false)
    const serverRooms = useAppSelector(state=>state.server.serverChatSRooms)
    const serverRoomsVoice = useAppSelector(state=>state.server.serverChatSRoomsVoice)
    const [isCreateServerRoom, setIsCreateServerRoom] = useState<boolean>(false)
    const [isCreateServerRoomVoice, setIsCreateServerRoomVOice] = useState<boolean>(false)
    const [isPer,setIsPer] = useState<boolean>(false)
    const [chek,setChek] = useState<boolean>(false)

    useEffect(()=>{
      if(serverid){
        console.log(serverid)
        dispatch(fetchGetServerChatRooms(serverid)) 
        dispatch(fetchgetServerAudioChatRooms(serverid))
        dispatch(fetchCheckServerUser(serverid)).then(res=>{setIsAdmin(res.payload.is_owner)})
        dispatch(fetchgetServersRoles(serverid))
        dispatch(fetchGetAllPermissions())
        dispatch(fetchgetServerMembersRolePermissions(serverid))
      }
    },[serverid])
   

  
    
   

 

  return ( 
    <>
     <div className='chat-list-container'>
      {isAdmin ? 
       <>
       <div className="setting-server">
        <img src={vector} alt="" onClick={()=>{
            navigate(`/server/${serverid}/set`)
          }}/>
          <p>Сервер тест</p>
       </div>
      </> 
      : 
      <button onClick={()=>{serverid && dispatch(fetchDejoinServer(serverid)).then(()=>navigate("/chat")).then(()=>{dispatch(fetchGetServer())})}}>exit server</button>}
     
   
      <div className="block-chat-link">
        
    
        <p>ТЕКСТОВЫЕ КАНАЛЫ 
          {userPerm["CREATE_CHAT"] && <span onClick={()=>{setIsCreateServerRoom(true)}} className='add-server-room'>+</span>}
        </p>
       
        {serverRooms.length !==0 && serverRooms.map(room=>(
        <NavLink to={`/server/${serverid}/${room.uuid}`} key={room.uuid}
        className={({ isActive, isPending }) =>
          isPending ? "pending-link" : isActive ? "active " : "active-link"
        }
        >
          <img src={chatli} alt="" />
          <div className='server-chat-block'><p>{room.title}</p></div>
        </NavLink>
        ))}
       </div>

       <div className="block-chat-link">

        <p>ГОЛОСОВЫЕ КАНАЛЫ 
            {userPerm["CREATE_CHAT"] && <span onClick={()=>{setIsCreateServerRoomVOice(true)}} className='add-server-room'>+</span>}
          </p>
          {serverRoomsVoice && serverRoomsVoice.length !==0 && serverRoomsVoice.map(room=>(
          <NavLink to={`/server/${serverid}/voice/${room.uuid}`} key={room.uuid}
              className={({ isActive, isPending }) =>
            isPending ? "pending-link" : isActive ? "active " : "active-link"
          }
          >
             <img src={chatlivoice} alt="" />
            <div className='server-chat-block'><p>{room.title}</p></div>
          </NavLink>
          ))}

       </div>
     
        

     </div>
    

    
        {isCreateServerRoom && 
        <ModuleTest isModule={setIsCreateServerRoom}>
          <div className="input-con">
          <input type="text" onChange={(e)=>{setChatName(e.target.value)}} value={chatName}/>
          
          </div>
          <input type="checkbox" value={chek} onChange={(e)=>setChek(e.target.checked)}/>
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
