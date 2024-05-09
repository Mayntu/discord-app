import  { FC, ReactNode, } from 'react'
import avatar from "../assets/sonic.jpg"
import { useAppDispatch, useAppSelector } from '../hooks/redux-hoock'
import { fetchDeleteServersMessage } from '../store/actionServer'


interface MessageProps{
    children : ReactNode
    classUser : string,
    time: string,
    media : string 
   uuid: string
}



const  Message: FC<MessageProps>=({classUser,children,time,media,uuid})=> {
  const me = useAppSelector(state=>state.auth.user)
  const dispatch = useAppDispatch()
  return (
    <>
    <div className={classUser == me.uuid || me.uuid == "" || undefined ? 'message my-message'  : 'message'}>
      <div className={classUser == me.uuid || me.uuid == "" || undefined ? 'chat-message'  : 'chat-message'}>
        <div className="avatar avatar-message">
          {me.avatar == "" ?  (<img src={"http://localhost:5173/"+avatar} alt="" />) :   (<img src={"http://localhost:5173/"+me.avatar} alt="" />)}
        </div>
          <div className="column">
            <p>{children}</p>
         
          <p>{`
          ${new Date(time).getHours()>10 ? new Date(time).getHours() : "0"+new Date(time).getHours()}
          : ${new Date(time).getMinutes()>10 ? new Date(time).getMinutes() : "0"+new Date(time).getMinutes()}
          : ${new Date(time).getSeconds()>10 ? new Date(time).getSeconds() : "0"+new Date(time).getSeconds() }`}</p>
          </div>
      </div>
      <>
      <button onClick={()=>{dispatch(fetchDeleteServersMessage(uuid))}}>удалить</button>
      <div className='image-message'>
        <img src={"http://localhost:5173/public/"+media} alt="" />
      </div>
      {media && ( <audio src={"http://localhost:5173/public/"+media} controls></audio>)} 
     </>
    </div>
  
    </>
  )
}




export default Message