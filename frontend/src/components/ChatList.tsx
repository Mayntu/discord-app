import React, { FC } from 'react'
import { useAppSelector } from '../hooks/redux-hoock'
import ChatListItem from './ChatListItem'
import icon from "../assets/icons8.png"
const ChatList:FC=()=> {
    const chats = useAppSelector(state=>state.chat.chats)

  return (

    <div className='chat-list-container'>
      <div className="search">
        <img src={icon} alt=""  className='icon' />
        <input type="search" placeholder='serch'/>
      </div>
        {chats.map(chat=><ChatListItem chat={chat} key={chat.name}/>)}
    </div>
  )
}

export default ChatList
