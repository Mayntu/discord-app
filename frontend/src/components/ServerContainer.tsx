import { NavLink } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../hooks/redux-hoock'
import { usePostCreateServerMutation } from '../store/RTQServer'
import { fetchCreateServer, fetchCreateServerChat, fetchGetServer, fetchGetServerChatRooms } from '../store/acthion'
import { useEffect } from 'react'

const ServerContainer=()=> {
    // const [result,{data,isLoading}] = usePostCreateServerMutation()
    const dispatch = useAppDispatch()
    const {serversUser} = useAppSelector(state=>state.server)

    useEffect(()=>{
      dispatch(fetchGetServer())
    },[])
    const server=async()=>{
        //  await result({title: "satana",avatar:""}).reset()
         dispatch(fetchCreateServer({title: "satana",avatar:""}))
          // console.log(data,"data")
      }
      
  return (
    <div className="container-server">
    <NavLink to={"/chat"}>
      <div className="block-server-chat">
        просто чаты
      </div>
    </NavLink>
    {/* <div className="block-server" onClick={()=>{
      dispatch(fetchCreateServerChat({title: "satana",uuid_server : "b8e373e4-c43c-4484-bc32-aa628a6a38ce"}))
    }}>
      создать чат
      {//2302f077-f01f-4767-ad51-b031bbb60b5c id-servera
      //2302f077-f01f-4767-ad51-b031bbb60b5c
      }
    </div> */}
    {/* <div className="block-server" onClick={()=>{
      dispatch(fetchGetServerChatRooms("2302f077-f01f-4767-ad51-b031bbb60b5c"))
    }}>
      получить чаты
    </div> */}
    {/* <div className="block-server" onClick={()=>{
      dispatch(fetchGetServer())
    }}>
      получить серевера
    </div> */}
    {/* <NavLink to={"/server/fjowfwoj"}>
    <div className="block-server">
      перейти на сервера
    </div>
    </NavLink> */}
    
    <div className="block-server" onClick={()=>{server()}}>
      создать сервер
    </div>
    {serversUser.length && serversUser.map(i=>(<NavLink to={`/server/${i.uuid}`}  key={i.uuid}><div className="block-server">{i.title}</div></NavLink>))}
  </div>
  )
}

export default ServerContainer