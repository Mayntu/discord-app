import  { FC, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks/redux-hoock'
import ChatListItem from './ChatListItem'
import icon from "../assets/icons8.png"
import SettingsBlock from './SettingsBlock'
import SaerchBlockUser from './SaerchBlock'
import { Outlet } from 'react-router-dom'
import { fetchFindChat, fetchGetUserChats } from '../store/acthionChat'
import $api from '../http'
import { socket } from '../socket'
import { addUsersConnect } from '../store/ChatsSlice'
import { fetchpostInvitationLinkUser } from '../store/actionServer'





const ChatList:FC=()=> {
  const findUsers = useAppSelector(state=>state.chats.searcChat)
  useEffect(()=>{
    dispatch(fetchGetUserChats()).then(()=>{
      connect()
      socket.on("connected", async (data:any)=>{
        console.log(data,"connect")
        dispatch(addUsersConnect(data.data))
      }) 
    })
  },[])

  const [isSettings,setIsSettings] = useState<boolean>(true)
  const dispatch = useAppDispatch()
  const {socketChat} = useAppSelector(state=>state.chats)


  const connect=async()=>{
    const userM = await $api.get<any>("api/v1/getUsersInfo")
    console.log("con")
    socket.emit("user_connected",{token:userM.data.user_data.uuid})
  }
  
  const seacrhChat = (e:string)=>{
      dispatch(fetchFindChat(e))
      dispatch(fetchGetUserChats())
  }



  return ( 
    <>
      {isSettings &&
      <div className='chat-list-container'>
        <div className="search">
          <img src={icon} alt=""  className='icon' onClick={()=>{
            // блок для настроик не доделан
            setIsSettings(false)
            }}/>
          <input type="search" placeholder='serch' onChange={(e)=>{seacrhChat(e.target.value)}}/>
       </div>
            {/* блок поиск по условию */}
        {findUsers?.length !== 0  && findUsers ? 
          <div className="find-container">
            {findUsers.map(user=>(<SaerchBlockUser user={user} key={user.uuid}/>))}
          </div>
        : null}
        {/* отображение item чатов */}
        { socketChat.map(i=>(<ChatListItem key={i.uuid}  chatId={i.uuid} chatsUser={i.users}/>))}
        <button onClick={()=>{dispatch(fetchpostInvitationLinkUser("hFXKA8FPoIBfSXpZhYdyuGVQIm0X4vS3nXXpcG8XGnb9CocJun5ItFhk5bjHb"))}}>пригласить юзера</button>
      </div>}
      {!isSettings && <SettingsBlock setIsSettings={setIsSettings}/>}
      <Outlet></Outlet>
      {/* <MessageContainer/> */}
    </>
  )
}

export default ChatList
