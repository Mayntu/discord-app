import React, { FC } from 'react'
import { useAppSelector } from '../hooks/redux-hoock'
import ChatListItem from './ChatListItem'

const ChatList:FC=()=> {
    const chats = useAppSelector(state=>state.chats.chats)

  return (

    <div>
        ChatList
        <input type="search" placeholder='serch'/>
        {chats.map(chat=><ChatListItem chat={chat}/>)}
    </div>
  )
}

export default ChatList
