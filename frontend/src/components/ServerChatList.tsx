import  { FC, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks/redux-hoock'
import { NavLink, Outlet, useNavigate, useParams } from 'react-router-dom'

import { fetchCreateServerChat, fetchDeleteServer, fetchGetServer, fetchGetServerChatRooms, fetchpostInvitationLink, fetchpostInvitationLinkUser } from '../store/actionServer'






const ServerChatList:FC=()=> {
    const dispatch = useAppDispatch()
    const {serverid}= useParams()
    const [chatName,setChatName] = useState<string>("")
    const navigate = useNavigate()


    useEffect(()=>{
      serverid && dispatch(fetchGetServerChatRooms(serverid))
    },[serverid])

    
    const serverRooms = useAppSelector(state=>state.server.serverChatSRooms)
  
    const deleteServer=()=>{
      serverid && dispatch(fetchDeleteServer(serverid))
                .then(()=>{navigate("/chat")})
                .then(()=>{dispatch(fetchGetServer())})
    }
 

  return ( 
    <>
     <div className='chat-list-container'>
      <button onClick={deleteServer}>dalete server</button>
      <button onClick={()=>{serverid && dispatch(fetchpostInvitationLink(serverid))}}>пригласить</button>
      <button onClick={()=>{serverid && dispatch(fetchpostInvitationLinkUser("pqZTpwMIz6XLGK9BtjMFKKxQyeiOwLJ67IVaztT0xnnCd5aBSaldnnSIhFEdt"))}}>пригласить юзера</button>
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
       
   
      <Outlet></Outlet>
  
    </>
  )
}

export default ServerChatList
