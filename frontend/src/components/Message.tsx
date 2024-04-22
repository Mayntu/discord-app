import  { FC, ReactNode } from 'react'
import avatar from "../assets/sonic.jpg"
import { useAppDispatch, useAppSelector } from '../hooks/redux-hoock'
import { addUserInChat, addUsersChat } from '../store/ChatsSlice'
import { useParams } from 'react-router-dom'
interface MessageProps{
    children : ReactNode
    classUser : string
}



const  Message: FC<MessageProps>=({classUser,children})=> {
  const {chatId}  = useParams()
  const me = useAppSelector(state=>state.chat.users)
  // const dispatch = useAppDispatch()
  // dispatch(addUserInChat(chatId))
  // console.log(children)
  // console.log(me,"me")
  // console.log(classUser)
  return (
    <div className={classUser == me.uuid || me.uuid == "" || undefined ? 'message my-message'  : 'message'}>
        <div className="avatar avatar-message">
            <img src={avatar} alt="" />
        </div>
        {children}
    </div>
  )
}
// 8941fce3-cd6c-4f7e-8e1a-687a9b3bbaa7

export default Message