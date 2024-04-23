
import {FC} from 'react'
import { useAppDispatch } from '../hooks/redux-hoock'
import { fetchCreateChat, fetchGetUserChats } from '../store/acthion'
import avatar from "../assets/noUser.png"
interface SaerchBlockUserProps{
  user : any
}


const SaerchBlockUser:FC<SaerchBlockUserProps>=({user})=> {
  const dispatch =useAppDispatch()

  return (
    <div className="find-container-user" onClick={()=>{
      console.log(user)
      dispatch(fetchCreateChat(user.uuid))
      dispatch(fetchGetUserChats(""))
      }}>
          <img src={avatar} alt="" />
          <p>{user.login}</p>
      </div>
  )
}


export default SaerchBlockUser