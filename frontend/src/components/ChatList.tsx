import  { FC, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks/redux-hoock'
import ChatListItem from './ChatListItem'

import SaerchBlockUser from './SaerchBlock'
import { Outlet, useSearchParams } from 'react-router-dom'
import { fetchFindChat, fetchGetUserChats } from '../store/acthionChat'
import { stateNull } from '../store/ChatsSlice'








const ChatList:FC=()=> {
  const findUsers = useAppSelector(state=>state.chats.searcChat)
  const dispatch = useAppDispatch()
  const {socketChat} = useAppSelector(state=>state.chats)
  const [findUserInChats,setfindUserInChats] = useState<any[]>([])
  const {user} = useAppSelector(state=>state.auth)
  
  const seacrhChat = (e:string)=>{
    if(e== ""){
      dispatch(stateNull([]))
    }else{
      dispatch(fetchFindChat(e))
      dispatch(fetchGetUserChats())
    }
    setfindUserInChats([])
    if(socketChat.find(i=>i.users.find(i=>i.login.includes(e)))){
      console.log("find")
      socketChat.map(i=>{
        i.users.map((s)=>{
          if(s.login.includes(e)){
            if(s.login !== user.login)
            setfindUserInChats((prev)=>[...prev,s])
          }
        })
      })

    }
     
  }



  return ( 
    <>
   
      <div className='chat-list-container'>
        <div className="search">
          <input type="search" placeholder='serch' onChange={(e)=>{seacrhChat(e.target.value)}}/>
       </div>
            {/* блок поиск по условию */}
        {findUsers?.length !== 0  && findUsers ? 
        <>
        <div className="find-container-inUser">
            {findUserInChats.map(user=>(user.login && <SaerchBlockUser user={user} key={user.uuid}/>))}
        </div>
          <div className="find-container">
            {findUsers.map(user=>(user.login && <SaerchBlockUser user={user} key={user.uuid}/>))}
          </div>
          
        </>
        : null}
        <p className='title-chat'>ЧАТЫ</p>
        { socketChat.map(i=>(<ChatListItem key={i.uuid}  chatId={i.uuid} chatsUser={i.users}/>))}
      </div>
      <Outlet></Outlet>
      {/* <MessageContainer/> */}
    </>
  )
}

export default ChatList
