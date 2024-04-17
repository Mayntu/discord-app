import  { FC } from 'react'
import { IUserChat } from '../models/IUserChat'
import avatar from "../assets/sonic.jpg"
import { Link, NavLink } from 'react-router-dom'
import { useAppDispatch } from '../hooks/redux-hoock'
import { fetchGetUserChats } from '../store/acthion'


interface ChatListItemProps{
    chat : IUserChat
}





const ChatListItem: FC<ChatListItemProps>=({chat})=> {

  const dispatch = useAppDispatch()
    
  return (
    <>
     <NavLink to={`/${chat.id}`}
    //    className={({ isActive, isPending, isTransitioning }) =>
    //     [
    //     //   isPending ? "pending" : "pending-link",
    //       isActive ? "active" : "active-link",
    //       isTransitioning ? "transitioning" : "",
    //     ].join(" ")

    //   }
      className={({ isActive, isPending }) =>
        isPending ? "pending-link" : isActive ? "active" : "active-link"
      }
     >
    <div className='chat-container' onClick={()=>{dispatch(fetchGetUserChats())}}>
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
    </NavLink>
    </>
  )
}


export default ChatListItem