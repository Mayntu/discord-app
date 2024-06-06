import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from './hooks/redux-hoock'
import { setIsAuth } from './store/AuthSlice'
import { Outlet,  useLocation,  useNavigate } from 'react-router-dom'
import {  fetchUser } from './store/acthion'
import ServerContainer from './components/ServerContainer'
import "./css/module.css"
import { socket } from './socket'
import $api from './http'
import { addUsersConnect, addUsersConnectState, userOffline, userOnline } from './store/ChatsSlice'
import { fetchGetUserChats } from './store/acthionChat'

function App() {
  const {isAuth,error,isLoading} = useAppSelector(state=> state.auth)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const {pathname} = useLocation()
  const {usersConnect} = useAppSelector(state=>state.chats)
  const {socketChat} = useAppSelector(state=>state.chats)
  useEffect(()=>{
    dispatch(fetchUser())
  },[])

  const connect=async()=>{
    const userM = await $api.get<any>("api/v1/getUsersInfo")
    socket.emit("user_connected",{token:userM.data.user_data.uuid})
    socket.on("connected", async (data:any)=>{
      if(data.data.includes(userM.data.user_data.uuid)){
        // console.log(data,"connected111111111")
        data.data.splice(data.data.indexOf(userM.data.user_data.uuid),1)
      }
      if(data.data.length){
        // console.log(usersConnect.length)
        console.log(data,"connected")
        dispatch(addUsersConnectState(data.data))
      }
     
     
    }) 
  }


  useEffect(()=>{
    if(socketChat.length !==0 && usersConnect.length === 0){
      connect()
    }else if(socketChat.length ===0){
      dispatch(fetchGetUserChats())
    }
     
  },[socketChat])

  useEffect(()=>{
     dispatch(addUsersConnect(usersConnect))
},[usersConnect])

 
  useEffect(()=>{
    socket.on("user_online",(data)=>{
      // console.log(data.user_uuid,"user_online")
      if(!usersConnect.includes(data.user_uuid)){
        // console.log(data.user_uuid,"user_onlinePPPPP")
        dispatch(userOnline(data.user_uuid))
      }
    })
  },[socket])
  
  useEffect(()=>{
    socket.on("user_offline",(data)=>{
      // console.log(data.user_uuid,"user_offline")
        dispatch(userOffline(data.user_uuid))
      
     
    })
  },[socket])

  


  useEffect(()=>{
    if(localStorage.getItem("token")){
      dispatch(setIsAuth(true))
      if(pathname == "/"){
          navigate("/chat") 
      }
    }else{
      navigate("/login")
    }
  },[])



  return (
    <>
    
  
    {isLoading && <>...Loading</>}
    {error && <h1 style={{color: "red"}}>{error}</h1>}
    <main>
      <section className='container-chat'>
          {isAuth && <ServerContainer/>}
          <section className='container-chat-message'>
            {isAuth && <Outlet></Outlet>}
          </section>
          <div id='modals'></div>
     
      </section>
   
    
    </main>
    
     
    </>
  )
}

export default App
