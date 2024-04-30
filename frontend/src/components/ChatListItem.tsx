import  { FC, useEffect, useState} from 'react'
import { IUserChatT } from '../models/IUserChat'
import avatar from "../assets/sonic.jpg"
import {  NavLink, useParams } from 'react-router-dom'
import { socket } from '../socket'
interface ChatListItemProps{
    chatId : string,
    chatsUser :  IUserChatT[]
}





const ChatListItem: FC<ChatListItemProps>=({chatId,chatsUser})=> {
  const [noMe,setNoME] = useState<IUserChatT>()
  const {chatid} = useParams()


  const findNoMe=()=>{
    setNoME(chatsUser.find(user=>user.is_current !== true))
  }

  useEffect(()=>{
    findNoMe()
  },[])

  return (
    <>
     <NavLink to={`/chat/${chatId}`}
     className='chat-container'
     onClick={()=>{
      if(chatId){
        socket.emit("leave",{"chat_id" : chatid})
      }
     }}
      // className={({ isActive, isPending }) =>
      //   isPending ? "pending-link" : isActive ? "active" : "active-link"
      // }
     >
        <div className="avatar">
            <img src={avatar} alt="" title={noMe?.login} />
        </div>
        <div className="content-chat" title={noMe?.login}>
          {noMe?.status && <div className="status"></div>}
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