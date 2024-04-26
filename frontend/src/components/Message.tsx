import  { FC, ReactNode, useEffect, useState } from 'react'
import avatar from "../assets/sonic.jpg"
import { useAppSelector } from '../hooks/redux-hoock'

interface MessageProps{
    children : ReactNode
    classUser : string,
    time: string,
    

}



const  Message: FC<MessageProps>=({classUser,children,time})=> {
  const me = useAppSelector(state=>state.auth.user)
 


  return (
    <div className={classUser == me.uuid || me.uuid == "" || undefined ? 'message my-message'  : 'message'}>
        <div className="avatar avatar-message">
          {me.avatar == "." ?  (<img src={avatar} alt="" />) :   (<img src={me.avatar} alt="" />)}
         
        </div>
        <div className="column">
        {children}
        <p>{`
        ${new Date(time).getHours()>10 ? new Date(time).getHours() : "0"+new Date(time).getHours()}
        : ${new Date(time).getMinutes()>10 ? new Date(time).getMinutes() : "0"+new Date(time).getMinutes()}
        : ${new Date(time).getSeconds()>10 ? new Date(time).getSeconds() : "0"+new Date(time).getSeconds() }`}</p>
        </div>
    </div>
  )
}




export default Message