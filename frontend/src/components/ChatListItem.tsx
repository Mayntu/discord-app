import  { FC, useEffect, useState} from 'react'
import { IUserChatT } from '../models/IUserChat'
import avatar from "../assets/sonic.png"
import {  NavLink } from 'react-router-dom'

import "../css/chat_meassage.css"


interface ChatListItemProps{
    chatId : string,
    chatsUser :  IUserChatT[]
}





const ChatListItem: FC<ChatListItemProps>=({chatId,chatsUser})=> {
  const [noMe,setNoME] = useState<IUserChatT>()



  const findNoMe=()=>{
    setNoME(chatsUser.find(user=>user.is_current !== true))
  }

  useEffect(()=>{
    findNoMe()
  },[chatsUser])



  return (
    <>
     <NavLink to={`/chat/${chatId}`}
    //  className='chat-container'
     onClick={()=>{
      if(chatId){
        console.log(chatId)
        // socket.emit("leave",{"chat_id" : chatid})
      }
     }}
      className={({ isActive, isPending }) =>
        isPending ? "pending-link chat-container" : isActive ? "active chat-container" : "active-link chat-container"
      }
     >
        
        <div className="content-chat" title={noMe?.login}>
        <div className="avatar">
            <img src={noMe?.avatar ? "http://localhost:5173/public/"+ noMe.avatar : avatar} alt="" title={noMe?.login} />
        </div>
        <div className="content">
          {noMe?.login}
        </div>
       
          {noMe?.status ? <div className="status"></div> : <div className="status-red"></div>}
           
               
            
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