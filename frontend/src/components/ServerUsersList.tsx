
import  { FC, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks/redux-hoock'
import { useParams } from 'react-router-dom'
import serveruserImg from "../assets/server-user.png"
import avatar from "../assets/sonic.jpg"
import { fetchPostGetServersMembers } from '../store/acthionServerUser'


const ServerUsersList:FC=()=> {
  const dispatch = useAppDispatch()
  const {serverid} = useParams()
  const usersServer = useAppSelector(state=>state.server.UserInServer)
  const roles = useAppSelector(state=>state.server.ServersRoles)
  const [isRole,setIsRole] = useState<boolean>(false)
  
  
  useEffect(()=>{
   serverid &&  dispatch(fetchPostGetServersMembers(serverid))
  },[])

  return (
    <div className="message-container-server-user">
      <div className="server-users">
        <img src={serveruserImg} alt="" />
        <p>Участники</p>
      </div>
     
      {usersServer.map((i)=>(
      <div className='chat-container-server' key={i.uuid} onClick={()=>setIsRole(!isRole)} >
        <div className="avatar">
            <img src={i?.avatar ? "http://localhost:5173/public/"+ i.avatar : avatar} alt="" title={i?.login} />
        </div>
        <div className="content-chat" title={i?.name}>
          
          <p style={{color: `${i.role.color}`}}>
            {i?.name} 
          </p>
                
          
            {i?.status ? <div className="status"></div> : <div className="status-red"></div>}
            {isRole && <div className='role-list'>
              {roles.map((i)=>(
                <>
                <p>{i.name} <div className="status" style={{backgroundColor: `${i.color}`}}></div></p>
                
               </>
              ))}
           
              </div>}
        </div>
    </div>))}
    </div>
  )
}


export default ServerUsersList