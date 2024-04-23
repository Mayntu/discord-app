import  { FC, useEffect, useState} from 'react'
import { IUserChatT } from '../models/IUserChat'
import avatar from "../assets/sonic.jpg"
import {  NavLink } from 'react-router-dom'
import { useAppDispatch} from '../hooks/redux-hoock'
import { addUsersChat } from '../store/ChatsSlice'


interface ChatListItemProps{
    chatId : string,
    chatsUser :  IUserChatT[]
}





const ChatListItem: FC<ChatListItemProps>=({chatId,chatsUser})=> {
  const dispatch = useAppDispatch()

  
  const [noMe,setNoME] = useState<IUserChatT>()
    
  const findNoMe=()=>{
    setNoME(chatsUser.find(user=>user.is_current !== true))
  }


  useEffect(()=>{
    findNoMe()
  },[])

  return (
    <>
     <NavLink to={`/${chatId}`}
     className='chat-container'
      // className={({ isActive, isPending }) =>
      //   isPending ? "pending-link" : isActive ? "active" : "active-link"
      // }
      onClick={()=>{
        dispatch(addUsersChat(chatsUser))
      }}
     >
        <div className="avatar">
            <img src={avatar} alt="" />
        </div>
        <div className="content-chat">
            <div className="row-content-chat">
                {noMe?.login} {noMe?.status}
            </div>
            <div className="row-content-chat">
                {noMe?.text}
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