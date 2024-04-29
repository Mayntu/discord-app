
import { useEffect } from 'react'
import ChatList from './components/ChatList'
import { useAppDispatch, useAppSelector } from './hooks/redux-hoock'
import { setIsAuth } from './store/AuthSlice'
import { Outlet,  useNavigate } from 'react-router-dom'
import { fetchCreateServer, fetchUser } from './store/acthion'
import { socket } from './socket'
import { usePostCreateServerMutation } from './store/RTQServer'
import { createActionCreatorInvariantMiddleware } from '@reduxjs/toolkit'


function App() {
  const {isAuth,error,user} = useAppSelector(state=> state.auth)
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

  // useEffect(()=>{
  //   // console.log(user,"userconnet")
  //   // socket.emit("user_connected",{token:"53a2d47e-2a94-4ea3-9f1d-8d78e34d8147" })
  //   // socket.on("connected",(data:any)=>{
  //   //   console.log(data,"connect")
  //   // })
  // //  socket.emit("disconnect",{token: localStorage.getItem("token")})
  // },[socket])


  
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
