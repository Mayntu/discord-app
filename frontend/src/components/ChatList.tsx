import  { FC, useRef, useState } from 'react'
import { useAppSelector } from '../hooks/redux-hoock'
import ChatListItem from './ChatListItem'
import icon from "../assets/icons8.png"
import SettingsBlock from './SettingsBlock'
import { CSSTransition } from 'react-transition-group'




const ChatList:FC=()=> {
    const chats = useAppSelector(state=>state.chat.chats)
    const [isSettings,setIsSettings] = useState<boolean>(true)
    const [isCss,setIsCss] = useState<boolean>(false)
    const nodRef = useRef(null)
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
      {chats.map(chat=><ChatListItem chat={chat} key={chat.name}/>)}
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
