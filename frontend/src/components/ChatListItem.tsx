import  { FC } from 'react'
import {  IUserChat, IUserChatT } from '../models/IUserChat'
import avatar from "../assets/sonic.jpg"
import {  NavLink } from 'react-router-dom'
import { useAppDispatch } from '../hooks/redux-hoock'
import { fetchGetUserChats } from '../store/acthion'
import { socket } from '../socket'
import { addUsersChat } from '../store/ChatsSlice'


interface ChatListItemProps{
    chatId : string
    chat : IUserChatT,
    chatsUser :  IUserChatT[]
}





const ChatListItem: FC<ChatListItemProps>=({chat,chatId,chatsUser})=> {
  const dispatch = useAppDispatch()
 
  // const joinRoom = (room:any) => {
  //   socket.emit("join", {"username" : "12345", "chat_id" : room});
  //   console.log("new user joined the room");
  // };    
  


  return (
    <>
     <NavLink to={`/${chatId}`}
      className={({ isActive, isPending }) =>
        isPending ? "pending-link" : isActive ? "active" : "active-link"
      }
      onClick={()=>{
        dispatch(addUsersChat(chatsUser))
      }}
     >
    <div className='chat-container' onClick={()=>{
      }}>
        <div className="avatar">
            <img src={avatar} alt="" />
        </div>
        <div className="content-chat">
            <div className="row-content-chat">
                {chat.login} {chat.status}
            </div>
            <div className="row-content-chat">
                {chat.text}
            </div>
        </div>
    </div>
    </NavLink>
    </>
  )
}


export default ChatListItem


// стили на потом
  //    className={({ isActive, isPending, isTransitioning }) =>
    //     [
    //     //   isPending ? "pending" : "pending-link",
    //       isActive ? "active" : "active-link",
    //       isTransitioning ? "transitioning" : "",
    //     ].join(" ")

    //   }