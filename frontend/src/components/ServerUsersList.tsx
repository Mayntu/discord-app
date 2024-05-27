
import  { FC, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks/redux-hoock'
import { fetchgetServersUsers } from '../store/actionServer'
import { useParams } from 'react-router-dom'

import avatar from "../assets/sonic.jpg"
const ServerUsersList:FC=()=> {
  const dispatch = useAppDispatch()
  const {serverid} = useParams()
  const usersServer = useAppSelector(state=>state.server.UserInServer)
  useEffect(()=>{
   serverid &&  dispatch(fetchgetServersUsers(serverid))
  },[])

  return (
    <div className="message-container-server-user">
      <p>Server Users</p>
      {usersServer.map((i)=>(
      <div className='chat-container' key={i.uuid}>
        <div className="avatar">
            <img src={i?.avatar ? "http://localhost:5173/public/"+ i.avatar : avatar} alt="" title={i?.login} />
        </div>
        <div className="content-chat" title={i?.login}>
          {i?.status ? <div className="status"></div> : <div className="status-red"></div>}
            <div className="row-content-chat">
                {i?.login} {i?.status}
            </div>
        </div>
    </div>))}
    </div>
  )
}


export default ServerUsersList