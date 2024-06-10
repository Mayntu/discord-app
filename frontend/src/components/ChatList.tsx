import  { FC, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks/redux-hoock'
import ChatListItem from './ChatListItem'
import icon from "../assets/icons8.png"
import SettingsBlock from './SettingsBlock'
import SaerchBlockUser from './SaerchBlock'
import { Outlet } from 'react-router-dom'
import { fetchFindChat, fetchGetUserChats } from '../store/acthionChat'
import { addUsersConnect } from '../store/ChatsSlice'







const ChatList:FC=()=> {
  const findUsers = useAppSelector(state=>state.chats.searcChat)
  const [isSettings,setIsSettings] = useState<boolean>(true)
  const dispatch = useAppDispatch()
  const {socketChat} = useAppSelector(state=>state.chats)

  //    сокетты
  // useEffect(()=>{
  //   dispatch(fetchGetUserChats()).then(()=>{
  //     dispatch( dispatch(addUsersConnect(connectUsers)))
  //   })
  // },[])
  
  const seacrhChat = (e:string)=>{
      dispatch(fetchFindChat(e))
      dispatch(fetchGetUserChats())
  }



  return ( 
    <>
      {isSettings &&
      <div className='chat-list-container'>
        <div className="search">
          <input type="search" placeholder='serch' onChange={(e)=>{seacrhChat(e.target.value)}}/>
       </div>
            {/* блок поиск по условию */}
        {findUsers?.length !== 0  && findUsers ? 
          <div className="find-container">
            {findUsers.map(user=>(<SaerchBlockUser user={user} key={user.uuid}/>))}
          </div>
        : null}
        {/* отображение item чатов */}
        {/* <p className='title-chat'>ЛИЧНЫЕ СООБЩЕНИЯ</p> */}
        <p className='title-chat'>ЧАТЫ</p>
        { socketChat.map(i=>(<ChatListItem key={i.uuid}  chatId={i.uuid} chatsUser={i.users}/>))}
      </div>}
      {!isSettings && <SettingsBlock setIsSettings={setIsSettings}/>}
      <Outlet></Outlet>
      {/* <MessageContainer/> */}
    </>
  )
}

export default ChatList
