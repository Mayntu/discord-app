
import { useEffect } from 'react'
import ChatList from './components/ChatList'
import { useAppDispatch, useAppSelector } from './hooks/redux-hoock'
import { setIsAuth } from './store/AuthSlice'
import { Outlet,  useNavigate } from 'react-router-dom'
import { fetchCreateServer, fetchUser } from './store/acthion'
import { socket } from './socket'
import { usePostCreateServerMutation } from './store/RTQServer'
import { createActionCreatorInvariantMiddleware } from '@reduxjs/toolkit'
import axios from 'axios'
import $api from './http'
import { addUsersConnect } from './store/ChatsSlice'


function App() {
  const {isAuth,error} = useAppSelector(state=> state.auth)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [result,{data,isLoading}] = usePostCreateServerMutation()

  useEffect(()=>{
    dispatch(fetchUser())
  },[])

  const server=async()=>{
    //  await result({title: "satana",avatar:""}).reset()
     dispatch(fetchCreateServer({title: "satana",avatar:""}))
      // console.log(data,"data")
  }

  const connect=async()=>{
    const userM = await $api.get<any>("api/v1/getUsersInfo")
    socket.emit("user_connected",{token:userM.data.user_data.uuid})
  }


  useEffect(()=>{
    connect()
    socket.on("connected", async (data:any)=>{
      console.log(data,"connect")
      dispatch(addUsersConnect(data.data))
    })
  },[])


  
  useEffect(()=>{
   
    if(localStorage.getItem("token")){
      dispatch(setIsAuth(true))
    }else{
      navigate("/login")
    }
  })



  return (
    <>
    
  
    {isLoading && <>...Loading</>}
    {error && <h1 style={{color: "red"}}>{error}</h1>}
    <main>
      <section className='container-chat'>
          <div className="container-server">
            <div className="block-server-chat">
            </div>
            <div className="block-server">
              {//2302f077-f01f-4767-ad51-b031bbb60b5c id-servera
              }
            </div>
            <div className="block-server" onClick={()=>{server()}}>

            </div>
          </div>
          {isAuth && <ChatList/>}
          {isAuth && <Outlet></Outlet>}
      </section>
   
    
    </main>
    
     
    </>
  )
}

export default App
