import  { FC, ReactNode } from 'react'
import avatar from "../assets/sonic.jpg"
interface MessageProps{
    children : ReactNode
}



const  Message: FC<MessageProps>=({children})=> {
  return (
    <div className='message'>
        <div className="avatar avatar-message">
            <img src={avatar} alt="" />
        </div>
        {children}
    </div>
  )
}


export default Message