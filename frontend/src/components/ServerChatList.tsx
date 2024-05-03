import  { FC, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks/redux-hoock'
import { NavLink, Outlet, useParams } from 'react-router-dom'

import { fetchCreateServerChat, fetchDeleteServer, fetchGetServerChatRooms } from '../store/actionServer'






const ServerChatList:FC=()=> {
    const dispatch = useAppDispatch()
    const {serverid}= useParams()
    const [chatName,setChatName] = useState<string>("")
    useEffect(()=>{
      serverid && dispatch(fetchGetServerChatRooms(serverid))
    },[serverid])

    
    const serverRooms = useAppSelector(state=>state.server.serverChatSRooms)
    // console.log(serverid)
    
 

  return ( 
    <>
     <div className='chat-list-container'>
     <button onClick={()=>{serverid && dispatch(fetchDeleteServer(serverid))}}>dalete server</button>
      <input type="text" onChange={(e)=>{setChatName(e.target.value)}} value={chatName}/>
     
      <button onClick={()=>{ 
        if(serverid){
          dispatch(fetchCreateServerChat({title: chatName,uuid_server : serverid}))
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
