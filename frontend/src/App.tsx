
import { useEffect } from 'react'
// import './App.css'
import ChatList from './components/ChatList'
import LoginForm from './components/LoginForm'
import { useAppDispatch, useAppSelector } from './hooks/redux-hoock'
import { setIsAuth } from './store/AuthSlice'
import MessageContainer from './components/MessageContainer'
import { Outlet, redirect, useNavigate } from 'react-router-dom'
import { fetcUser } from './store/acthion'
import { socket } from './socket'


function App() {
  const {isAuth,isLoading,error} = useAppSelector(state=> state.auth)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
 

  useEffect(()=>{
    dispatch(fetcUser())
   
  },[])

  socket.emit("user_connected",{token: localStorage.getItem("token")})
  socket.on("connected",(data:any)=>{
    console.log(data,"connect")
  })

  
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
          {isAuth && <ChatList/>}
          <Outlet></Outlet>
      </section>
   
    
    </main>
    
     
    </>
  )
}

export default App
