import { useAppDispatch } from '../hooks/redux-hoock'
import { usePostCreateServerMutation } from '../store/RTQServer'
import { fetchCreateServer, fetchCreateServerChat, fetchGetServerChatRooms } from '../store/acthion'
import { createActionCreatorInvariantMiddleware } from '@reduxjs/toolkit'

const ServerContainer=()=> {
    const [result,{data,isLoading}] = usePostCreateServerMutation()
    const dispatch = useAppDispatch()

    const server=async()=>{
        //  await result({title: "satana",avatar:""}).reset()
         dispatch(fetchCreateServer({title: "satana",avatar:""}))
          // console.log(data,"data")
      }
      
  return (
    <div className="container-server">
    <div className="block-server-chat">
      просто чаты
    </div>
    <div className="block-server" onClick={()=>{
      dispatch(fetchCreateServerChat({title: "satana",uuid_server : "747adb0b-8452-4cbe-a622-5bfb9912f3e4"}))
    }}>
      создать чат
      {//2302f077-f01f-4767-ad51-b031bbb60b5c id-servera
      //2302f077-f01f-4767-ad51-b031bbb60b5c
      }
    </div>
    <div className="block-server" onClick={()=>{
      dispatch(fetchGetServerChatRooms("2302f077-f01f-4767-ad51-b031bbb60b5c"))
    }}>
      получить чаты
    </div>
    <div className="block-server" onClick={()=>{server()}}>
      создать сервер
    </div>
  </div>
  )
}

export default ServerContainer