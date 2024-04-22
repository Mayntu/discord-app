import  { FC, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks/redux-hoock'
import ChatListItem from './ChatListItem'
import icon from "../assets/icons8.png"
import SettingsBlock from './SettingsBlock'
import { CSSTransition } from 'react-transition-group'
import { fetchFindChat, fetchGetUserChats } from '../store/acthion'
import { useParams } from 'react-router-dom'
import SaerchBlockUser from './SaerchBlock'





const ChatList:FC=()=> {
  const {chatid} = useParams()
  const findUsers = useAppSelector(state=>state.chat.searcChat)
  useEffect(()=>{
   dispatch(fetchGetUserChats(chatid))
  },[chatid])
  const [isSettings,setIsSettings] = useState<boolean>(true)
  // const [isCss,setIsCss] = useState<boolean>(false)
  const dispatch = useAppDispatch()
  const chats2 = useAppSelector(state=>state.chat.socketChat)

  
  const seacrhChat = (e:any)=>{
    // if(e.target.value){
      dispatch(fetchFindChat(e.target.value))
    // }
    
  }

  

  return (
    <>
    
      {isSettings &&
      <div className='chat-list-container'>
        <div className="search">
          <img src={icon} alt=""  className='icon' onClick={()=>{
            setIsSettings(false)
            // setIsCss(true)
            }}/>
          <input type="search" placeholder='serch' onChange={(e)=>{seacrhChat(e)}}/>
       </div>
       {/* {findUsers.length} */}
       {findUsers?.length !== 0  && findUsers ? 
        <div className="find-container">
        {findUsers.map(user=>(<SaerchBlockUser user={user}/>))}
        </div>
   
        
        : null}
        
        
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
