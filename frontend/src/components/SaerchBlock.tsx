
import {FC, useEffect} from 'react'
import { useAppDispatch, useAppSelector } from '../hooks/redux-hoock'
import {  } from '../store/acthion'
import avatar from "../assets/noUser.png"
import { fetchCreateChat, fetchGetUserChats } from '../store/acthionChat'
import { useNavigate } from 'react-router-dom'
import { stateNull } from '../store/ChatsSlice'
import {  IUserChatTSearch } from '../models/IUserChat'
interface SaerchBlockUserProps{
  user : IUserChatTSearch
}


const SaerchBlockUser:FC<SaerchBlockUserProps>=({user})=> {
  const dispatch =useAppDispatch()
  const {newChatid} = useAppSelector(state=>state.chats)
  const navigate = useNavigate()

  useEffect(()=>{
   newChatid && navigate(`/chat/${newChatid}`)
  },[newChatid])
 
  return (
    <div className="find-container-user" onClick={()=>{
      console.log(user)
      dispatch(fetchCreateChat(user.uuid))
      .then(()=>{dispatch(fetchGetUserChats())
      .then(()=>{ dispatch(stateNull([]))})})

      }}>
          <img src={user.avatar ?  "http://localhost:5173/public/"+user.avatar : "http://localhost:5173/"+avatar} alt="" />
          {user.is_online ? <div className="status"></div> : <div className="status-red"></div>}
          <p>{user.login}</p>
      </div>
  )
}


export default SaerchBlockUser