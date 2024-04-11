import  { FC } from 'react'
import { IUserChat } from '../models/IUserChat'
import avatar from "../assets/sonic.jpg"


interface ChatListItemProps{
    chat : IUserChat
}



const ChatListItem: FC<ChatListItemProps>=({chat})=> {
  return (
    <div className='chat-container'>
        <div className="avatar">
            <img src={avatar} alt="" />
        </div>
        <div className="content-chat">
            <div className="row-content-chat">
                {chat.name} {chat.status}
            </div>
            <div className="row-content-chat">
                {chat.text}
            </div>
        </div>
    </div>
  )
}


export default ChatListItem