import  { FC, useEffect, useState } from 'react'
import { useAppDispatch } from '../hooks/redux-hoock'
import { NavLink, Outlet, useParams } from 'react-router-dom'
import { fetchCreateServerChat, fetchGetServerChatRooms } from '../store/acthion'






const ServerChatList:FC=()=> {
    const dispatch = useAppDispatch()
    const {serverid}= useParams()
    const [chatName,setChatName] = useState<string>("")
    console.log(serverid)
    useEffect(()=>{
      serverid && dispatch(fetchGetServerChatRooms(serverid))
    },[serverid])

  return ( 
    <>
     <div className='chat-list-container'>
      <input type="text" onChange={(e)=>{setChatName(e.target.value)}} value={chatName}/>
      <button onClick={()=>{ 
        if(serverid){
          dispatch(fetchCreateServerChat({title: chatName,uuid_server : serverid}))
        }}}>создать чат</button>

        <NavLink to={`/server/${serverid}/b5633fe1-5390-468e-882e-cee73259359b`}>
          <div className='server-chat-block'>b5633fe1-5390-468e-882e-cee73259359b</div>
        </NavLink>
        
     </div>
        
     {//"b5633fe1-5390-468e-882e-cee73259359b" id чата
     }
      <Outlet></Outlet>
  
    </>
  )
}

export default ServerChatList
