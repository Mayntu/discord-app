
import { useEffect } from 'react'
// import './App.css'
import ChatList from './components/ChatList'
import LoginForm from './components/LoginForm'
import { useAppDispatch, useAppSelector } from './hooks/redux-hoock'
import { setIsAuth } from './store/AuthSlice'
import MessageContainer from './components/MessageContainer'
import { Outlet, redirect, useNavigate } from 'react-router-dom'

function App() {
  
  const {isAuth,isLoading,error} = useAppSelector(state=> state.auth)
  const navigate = useNavigate()
 
 ///api/v1/getchats
  const dispatch = useAppDispatch()
  useEffect(()=>{
    if(localStorage.getItem("token")){
      dispatch(setIsAuth(true))
    }else{
      navigate("/login")
    }
  },)

//  const getchats = async ()=>{
//   const res = await fetch("http://127.0.0.1:8000/api/v1/getchats",{
//     method: "GET",
//     headers: {
//       "Authorization" : JSON.stringify(localStorage.getItem("token")),
//       "Content-Type": "application/json"
//     }
//   }).then(res=>res.json())
//   console.log(res)
// }

  return (
    <>
    {/* <button onClick={()=>getchats()}>LOGIN</button> */}
    {isLoading && <>...Loading</>}
    {error && <h1 style={{color: "red"}}>{error}</h1>}
    <main>
      <section className='container-chat'>
          {isAuth && <ChatList/>}
          <Outlet></Outlet>
          {/* <MessageContainer/> */}
      </section>
   
    
    </main>
    
     
    </>
  )
}

export default App
