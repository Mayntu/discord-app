import  { FC } from 'react'
import { useAppDispatch } from '../hooks/redux-hoock'
import { Outlet, useParams } from 'react-router-dom'






const ServerChatList:FC=()=> {
    const dispatch = useAppDispatch()
    const {serverId}=useParams()


  return ( 
    <>
     <div className='chat-list-container'>
        
     </div>

      <Outlet></Outlet>
  
    </>
  )
}

export default ServerChatList
