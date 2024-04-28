
import { useEffect } from 'react'
import ChatList from './components/ChatList'
import { useAppDispatch, useAppSelector } from './hooks/redux-hoock'
import { setIsAuth } from './store/AuthSlice'
import { Outlet,  useNavigate } from 'react-router-dom'
import { fetcUser } from './store/acthion'
import { socket } from './socket'


function App() {
  const {isAuth,isLoading,error,user} = useAppSelector(state=> state.auth)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
 

  useEffect(()=>{
    dispatch(fetcUser())
   
  },[])
  useEffect(()=>{
    socket.emit("user_connected",{uuid: user.uuid})
    socket.on("connected",(data:any)=>{
      console.log(data,"connect")
    })
  //  socket.emit("disconnect",{token: localStorage.getItem("token")})
  },[socket])


  
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
