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
    if(chatid){
      dispatch(fetchGetUserChats(chatid))
    }else{
      dispatch(fetchGetUserChats(""))
    }
  },[chatid])
  const [isSettings,setIsSettings] = useState<boolean>(true)
  const dispatch = useAppDispatch()
  const chats2 = useAppSelector(state=>state.chat.socketChat)

  
  const seacrhChat = (e:string)=>{
      dispatch(fetchFindChat(e))
  }

  console.log(chats2)
  

  return (
    <>
    
      {isSettings &&
      <div className='chat-list-container'>
        <div className="search">
          <img src={icon} alt=""  className='icon' onClick={()=>{
            // блок для настроик не доделан
            setIsSettings(false)
            }}/>
          <input type="search" placeholder='serch' onChange={(e)=>{seacrhChat(e.target.value)}}/>
       </div>
            {/* блок поиск по условию */}
        {findUsers?.length !== 0  && findUsers ? 
          <div className="find-container">
            {findUsers.map(user=>(<SaerchBlockUser user={user}/>))}
          </div>
        : null}
        {/* отображение item чатов */}
        {chats2.map(i=>(<ChatListItem key={i.uuid}  chatId={i.uuid} chatsUser={i.users}/>))}
      </div>}
      {!isSettings && <SettingsBlock setIsSettings={setIsSettings}/>}
      
        


      {/* <CSSTransition in={!isSettings}   timeout={3000} classNames="alert"  unmountOnExit> */}
       
      {/* </CSSTransition> */}
      {/* <CSSTransition in={!isSettings}   timeout={3000} classNames="alert"  unmountOnExit>
      <button>okoefkoe</button>
      </CSSTransition> */}
    
    </>
  )
}

export default ChatList
