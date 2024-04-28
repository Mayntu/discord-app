import  { FC, ReactNode, useEffect, useState } from 'react'
import avatar from "../assets/sonic.jpg"
import { useAppSelector } from '../hooks/redux-hoock'
import axios from 'axios'

interface MessageProps{
    children : ReactNode
    classUser : string,
    time: string,
    media : string 
    users : any
}



const  Message: FC<MessageProps>=({classUser,children,time,media,users})=> {
  const me = useAppSelector(state=>state.auth.user)
  const [user,setUser] = useState("")
  useEffect(()=>{
    //  console.log(users,"users")
    //  setUser(users.find(i => i.uuid == classUser))
    //   console.log(user)
  },[users])

  return (
    <>
    <div className={classUser == me.uuid || me.uuid == "" || undefined ? 'message my-message'  : 'message'}>
      <div className={classUser == me.uuid || me.uuid == "" || undefined ? 'chat-message my-message'  : 'chat-message'}>
        <div className="avatar avatar-message">
          {user?.avatar == "" ?  (<img src={avatar} alt="" />) :   (<img src={me.avatar} alt="" />)}
        </div>
          <div className="column">
          {children}
          <p>{`
          ${new Date(time).getHours()>10 ? new Date(time).getHours() : "0"+new Date(time).getHours()}
          : ${new Date(time).getMinutes()>10 ? new Date(time).getMinutes() : "0"+new Date(time).getMinutes()}
          : ${new Date(time).getSeconds()>10 ? new Date(time).getSeconds() : "0"+new Date(time).getSeconds() }`}</p>
          </div>
      </div>
      <>
      <div className='image-message'>
        <img src={media} alt="" />
      </div> 
     </>
    </div>
  
    </>
  )
}




export default Message