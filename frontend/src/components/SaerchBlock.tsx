
import {FC, useEffect} from 'react'
import { useAppDispatch, useAppSelector } from '../hooks/redux-hoock'
import {  } from '../store/acthion'
import avatar from "../assets/noUser.png"
import { fetchCreateChat, fetchGetUserChats } from '../store/acthionChat'
import { useNavigate } from 'react-router-dom'
import { addUsersConnect, addUsersConnectState, stateNull } from '../store/ChatsSlice'
import {  IUserChatTSearch } from '../models/IUserChat'
import { socket } from '../socket'
import $api from '../http'
interface SaerchBlockUserProps{
  user : IUserChatTSearch
}


const SaerchBlockUser:FC<SaerchBlockUserProps>=({user})=> {
  const dispatch =useAppDispatch()
  const {newChatid} = useAppSelector(state=>state.chats)
  const navigate = useNavigate()
  const {usersConnect} = useAppSelector(state=>state.chats)

  
  useEffect(()=>{
   newChatid && navigate(`/chat/${newChatid}`)
  },[newChatid])
 
  const connect=async()=>{
    const userM = await $api.get<any>("api/v1/getUsersInfo")
    socket.emit("user_connected",{token:userM.data.user_data.uuid})
    socket.on("connected", async (data:any)=>{
      if(data.data.includes(userM.data.user_data.uuid)){
        data.data.splice(data.data.indexOf(userM.data.user_data.uuid),1)
      }
      if(data.data.length){
        console.log(data,"connected")
        dispatch(addUsersConnectState(data.data))
      }
     
     
    }) 
  }
  return (
    <div className="find-container-user" onClick={()=>{
      console.log(user)
      dispatch(fetchCreateChat(user.uuid))
      .then(()=>{dispatch(fetchGetUserChats())
      .then(()=>{connect()})
      .then(()=>{ dispatch(addUsersConnect(usersConnect))})
      .then(()=>{ dispatch(stateNull([]))})})

      }}>
          <img src={user.avatar ?  "http://localhost:5173/public/"+user.avatar : "http://localhost:5173/"+avatar} alt="" />
          {/* {user.is_online ? <div className="status"></div> : <div className="status-red"></div>} */}
          <p>{user.login}</p>
      </div>
  )
}


export default SaerchBlockUser