import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from './hooks/redux-hoock'
import { setIsAuth } from './store/AuthSlice'
import { Outlet,  useLocation,  useNavigate } from 'react-router-dom'
import {  fetchUser } from './store/acthion'
import { socket } from './socket'
import $api from './http'
import { addUsersConnect } from './store/ChatsSlice'
import ServerContainer from './components/ServerContainer'
import ModuleImage from './components/ModuleImage'
import Module from './components/Module'
import ModuleTest from './components/ModuleTest'


function App() {
  const {isAuth,error,isLoading} = useAppSelector(state=> state.auth)
  const {isViewModule,isViewModuleSetting,isModule,children} = useAppSelector(state=> state.module)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const {pathname} = useLocation()

  useEffect(()=>{
    dispatch(fetchUser())
  },[])



  // const connect=async()=>{
  //   const userM = await $api.get<any>("api/v1/getUsersInfo")
  //   console.log("con")
  //   socket.emit("user_connected",{token:userM.data.user_data.uuid})
  // }


  // useEffect(()=>{
   
  //     connect()
  //     socket.on("connected", async (data:any)=>{
  //       console.log(data,"connect")
  //       dispatch(addUsersConnect(data.data))
  //     }) 
    
  // },[socket])

  


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
        {isViewModule && <ModuleImage/>}
        {isViewModuleSetting && <ModuleTest>{children}</ModuleTest>}
      </section>
   
    
    </main>
    
     
    </>
  )
}

export default App
