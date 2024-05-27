import  { FC, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks/redux-hoock'
import { NavLink, Outlet, useNavigate, useParams } from 'react-router-dom'

import { fetchCreateServerChat, fetchDeleteServer, fetchGetServer, fetchGetServerChatRooms, fetchpostChangeServersTitle, fetchpostInvitationLink, fetchpostInvitationLinkUser } from '../store/actionServer'
import { isModuleSet } from '../store/ModuleSlice'
import Module from './Module'






const ServerChatList:FC=()=> {
    const dispatch = useAppDispatch()
    const {serverid}= useParams()
    const [chatName,setChatName] = useState<string>("")
    const navigate = useNavigate()
    const [isModule,setIsModule] = useState<boolean>(false)

    useEffect(()=>{
      serverid && dispatch(fetchGetServerChatRooms(serverid))
    },[serverid])

    
    const serverRooms = useAppSelector(state=>state.server.serverChatSRooms)
  
    const deleteServer=()=>{
      serverid && dispatch(fetchDeleteServer(serverid))
                .then(()=>{navigate("/chat")})
                .then(()=>{dispatch(fetchGetServer())})
    }
 

    const newTitleServer=()=>{
      dispatch(fetchpostChangeServersTitle({server_uuid : "277bc986-dfbe-43f6-b6e4-034c460ef58a",title: "sonic"}))
      console.log("wojdiw")
    }

  return ( 
    <>
     <div className='chat-list-container'>
      <button onClick={deleteServer}>dalete server</button>
      <button onClick={()=>{serverid && dispatch(fetchpostInvitationLink(serverid))}}>пригласить</button>
      <button onClick={()=>{dispatch(fetchpostInvitationLinkUser("tVurNtAJ0pLi0VChn4m60Q9zioSEOCcOlKNaDpAIs7Qm30iI0HS9luKZA7MaT"))}}>пригласить юзера</button>
      <input type="text" onChange={(e)=>{setChatName(e.target.value)}} value={chatName}/>
      <button onClick={()=>{
       
       dispatch(isModuleSet({isViewModuleSetting:true,isModule:setIsModule, children: (<button onClick={()=>{console.log("ssssss")}}>save</button>)}))
      }}>изменить имя сервера</button>
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
       {/* {isModule && <Module newFile={newTitleServer} isModule={setIsModule}/>} */}
   
      <Outlet></Outlet>
  
    </>
  )
}

export default ServerChatList
