import  { FC, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks/redux-hoock'
import ChatListItem from './ChatListItem'
import icon from "../assets/icons8.png"
import SettingsBlock from './SettingsBlock'
import { CSSTransition } from 'react-transition-group'
import { fetchGetUserChats } from '../store/acthion'




const ChatList:FC=()=> {
  useEffect(()=>{
    dispatch(fetchGetUserChats())
  },[])
  const [isSettings,setIsSettings] = useState<boolean>(true)
  const [isCss,setIsCss] = useState<boolean>(false)
  const dispatch = useAppDispatch()
  const chats2 = useAppSelector(state=>state.chat.socketChat)



  return (
    <>
    
      {isSettings &&
      <div className='chat-list-container'>
        <div className="search">
          <img src={icon} alt=""  className='icon' onClick={()=>{
            setIsSettings(false)
            setIsCss(true)
            }}/>
          <input type="search" placeholder='serch'/>
       </div>
        {chats2.map(i=>(<ChatListItem key={i.id} chat={i.users[0]} chatId={i.id} chatsUser={i.users}/>))}
      </div>}
            
      <CSSTransition in={!isSettings}   timeout={3000} classNames="alert"  unmountOnExit>
        <SettingsBlock/>
      </CSSTransition>
      <CSSTransition in={!isSettings}   timeout={3000} classNames="alert"  unmountOnExit>
      <button>okoefkoe</button>
      </CSSTransition>
    
    </>
  )
}

export default ChatList
