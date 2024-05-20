import  { FC, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks/redux-hoock'
import ChatListItem from './ChatListItem'
import icon from "../assets/icons8.png"
import SettingsBlock from './SettingsBlock'
import SaerchBlockUser from './SaerchBlock'
import { Outlet } from 'react-router-dom'
import { fetchFindChat, fetchGetUserChats } from '../store/acthionChat'





const ChatList:FC=()=> {
  const findUsers = useAppSelector(state=>state.chats.searcChat)
  useEffect(()=>{
    dispatch(fetchGetUserChats())
  },[])
  const [isSettings,setIsSettings] = useState<boolean>(true)
  const dispatch = useAppDispatch()
  const {socketChat} = useAppSelector(state=>state.chats)
  const usersConnect = useAppSelector(state=>state.chats.usersConnect)
  
  const seacrhChat = (e:string)=>{
      dispatch(fetchFindChat(e))
      dispatch(fetchGetUserChats())
  }

  //  useEffect(()=>{
  //   console.log(socketChat,"socketChatinChatList")
  //   // console.log(usersConnect,"con")
  //   // const n = chats2.filter(user=>{
  //   //   console.log(user.users)
  //   //   return user.users})
  //   // console.log(n,"con2")
  // },[socketChat])

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
        {socketChat.map(i=>(<ChatListItem key={i.uuid}  chatId={i.uuid} chatsUser={i.users}/>))}
      </div>}
      {!isSettings && <SettingsBlock setIsSettings={setIsSettings}/>}
      <Outlet></Outlet>
      {/* <MessageContainer/> */}
    </>
  )
}

export default ChatList
