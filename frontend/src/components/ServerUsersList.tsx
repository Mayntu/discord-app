

import React, { FC, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks/redux-hoock'
import { fetchgetServersUsers } from '../store/actionServer'
import { useParams } from 'react-router-dom'

const ServerUsersList:FC=()=> {
  const dispatch = useAppDispatch()
  const {chatid,chatserverid,serverid} = useParams()
  const usersServer = useAppSelector(state=>state.server.UserInServer)
  useEffect(()=>{
   serverid &&  dispatch(fetchgetServersUsers(serverid))
  },[])
  return (
    <div className="message-container-server-user">
      <p>klsckmsckmksmcomskcm</p>
    </div>
  )
}


export default ServerUsersList