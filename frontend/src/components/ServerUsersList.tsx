
import  { FC, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks/redux-hoock'
import { fetchGetServersUsers } from '../store/actionServer'
import { useParams } from 'react-router-dom'
import serveruserImg from "../assets/server-user.png"
import avatar from "../assets/sonic.jpg"
const ServerUsersList:FC=()=> {
  const dispatch = useAppDispatch()
  const {serverid} = useParams()
  const usersServer = useAppSelector(state=>state.server.UserInServer)
 
  useEffect(()=>{
   serverid &&  dispatch(fetchGetServersUsers(serverid))
  },[])

  return (
    <div className="message-container-server-user">
      <div className="server-users">
        <img src={serveruserImg} alt="" />
        <p>Участники</p>
      </div>
     
      {usersServer.map((i)=>(
      <div className='chat-container-server' key={i.uuid}>
        <div className="avatar">
            <img src={i?.avatar ? "http://localhost:5173/public/"+ i.avatar : avatar} alt="" title={i?.login} />
        </div>
        <div className="content-chat" title={i?.login}>
          
        
                {i?.login} {i?.status}
          
            {i?.status ? <div className="status"></div> : <div className="status-red"></div>}
        </div>
    </div>))}
    </div>
  )
}


export default ServerUsersList