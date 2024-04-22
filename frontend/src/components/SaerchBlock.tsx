import { AnyListenerPredicate } from '@reduxjs/toolkit'
import React, {FC} from 'react'
import { useAppDispatch } from '../hooks/redux-hoock'
import { fetchCreateChat } from '../store/acthion'

interface SaerchBlockUserProps{
  user : any
}


const SaerchBlockUser:FC<SaerchBlockUserProps>=({user})=> {
  const dispatch =useAppDispatch()

  return (
    <div className="find-container-user" onClick={()=>{
      console.log(user)
      dispatch(fetchCreateChat(user.uuid))
      }}>
          <img src={user.avatar} alt="" />
          <p>{user.login}</p>
      </div>
  )
}


export default SaerchBlockUser