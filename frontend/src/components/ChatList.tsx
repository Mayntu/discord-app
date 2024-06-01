import  { FC, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks/redux-hoock'
import ChatListItem from './ChatListItem'
import icon from "../assets/icons8.png"
import SettingsBlock from './SettingsBlock'
import SaerchBlockUser from './SaerchBlock'
import { Outlet } from 'react-router-dom'
import { fetchFindChat, fetchGetUserChats } from '../store/acthionChat'
import $api from '../http'
import { socket } from '../socket'
import { addUsersConnect, addUsersConnectState } from '../store/ChatsSlice'






const ChatList:FC=()=> {
  const findUsers = useAppSelector(state=>state.chats.searcChat)
  const connectUsers = useAppSelector(state=>state.chats.usersConnect)

  //    сокетты
  useEffect(()=>{
    dispatch(fetchGetUserChats()).then(()=>{
      connect()
   
    }
  )
    
   
  
  },[])

useEffect(()=>{
  
    // console.log(connectUsers,"adadadada") 
    dispatch(addUsersConnect(connectUsers))
  
},[connectUsers])

  const connect=async()=>{
    const userM = await $api.get<any>("api/v1/getUsersInfo")
    socket.emit("user_connected",{token:userM.data.user_data.uuid})
    socket.on("connected", async (data:any)=>{
      if(data.data.includes(userM.data.user_data.uuid)){
        data.data.splice(data.data.indexOf(userM.data.user_data.uuid),1)
      }
      if(data.data.length){
        console.log(data,"connected")
        dispatch(addUsersConnectState(data.data))
      }
     
     
    }) 
  }
  useEffect(()=>{
    socket.on("user_online",(data)=>{
      console.log(data.user_uuid,"user_online")
      dispatch(addUsersConnectState(data.user_uuid))
    })
  },[])
  
  useEffect(()=>{
    socket.on("user_offline",(data)=>{
      console.log(data,"user_offline")
      dispatch(addUsersConnectState(data.user_uuid))
    })
  },[])

  //    сокетты

  const [isSettings,setIsSettings] = useState<boolean>(true)
  const dispatch = useAppDispatch()
  const {socketChat} = useAppSelector(state=>state.chats)



  
  const seacrhChat = (e:string)=>{
      dispatch(fetchFindChat(e))
      dispatch(fetchGetUserChats())
  }



  return ( 
    <>
      {isSettings &&
      <div className='chat-list-container'>
        <div className="search">
          <img src={icon} alt=""  className='icon' onClick={()=>{
            setIsSettings(false)
            }}/>
          <input type="search" placeholder='serch' onChange={(e)=>{seacrhChat(e.target.value)}}/>
       </div>
            {/* блок поиск по условию */}
        {findUsers?.length !== 0  && findUsers ? 
          <div className="find-container">
            {findUsers.map(user=>(<SaerchBlockUser user={user} key={user.uuid}/>))}
          </div>
        : null}
        {/* отображение item чатов */}
        <p>ЛИЧНЫЕ СООБЩЕНИЯ</p>
        { socketChat.map(i=>(<ChatListItem key={i.uuid}  chatId={i.uuid} chatsUser={i.users}/>))}
      </div>}
      {!isSettings && <SettingsBlock setIsSettings={setIsSettings}/>}
      <Outlet></Outlet>
      {/* <MessageContainer/> */}
    </>
  )
}

export default ChatList
