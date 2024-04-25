
import { useEffect } from 'react'
// import './App.css'
import ChatList from './components/ChatList'
import LoginForm from './components/LoginForm'
import { useAppDispatch, useAppSelector } from './hooks/redux-hoock'
import { setIsAuth } from './store/AuthSlice'
import MessageContainer from './components/MessageContainer'
import { Outlet, redirect, useNavigate } from 'react-router-dom'
import { fetcUser } from './store/acthion'


function App() {
  
  const {isAuth,isLoading,error} = useAppSelector(state=> state.auth)
  const navigate = useNavigate()
 


  useEffect(()=>{
    dispatch(fetcUser())
  },[])



  const dispatch = useAppDispatch()
  useEffect(()=>{
    // localStorage.setItem("token","eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1dWlkIjoiODk0MWZjZTMtY2Q2Yy00ZjdlLThlMWEtNjg3YTliM2JiYWE3IiwibG9naW4iOiJ3b3dvdyIsInBhc3N3b3JkIjoiMTIzNDUifQ.2FiXrLQeYEZMJCVZyD31gFL_mmkaptEOoXPOzvgWNHs")
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
