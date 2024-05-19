

import React, { FC, useEffect } from 'react'
import { useAppDispatch } from '../hooks/redux-hoock'
import { fetchgetUsersServerChat } from '../store/actionServer'
import { useParams } from 'react-router-dom'

const ServerUsersList:FC=()=> {
  const dispatch = useAppDispatch()
  const {chatid,chatserverid,serverid} = useParams()
  useEffect(()=>{
   serverid &&  dispatch(fetchgetUsersServerChat(serverid))
  },[])
  return (
    <div className="message-container-server-user">
      <p>klsckmsckmksmcomskcm</p>
    </div>
  )
}


export default ServerUsersList