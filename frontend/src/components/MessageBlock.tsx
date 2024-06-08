import  { FC  } from 'react'
import avatar from "../assets/sonic.jpg"
import { useAppSelector } from '../hooks/redux-hoock'

import "../css/message_container.css"
import NewMessage from './NewMessage'

interface MessageProps{
    children? : React.ReactNode
    // classUser : string,
    // time: string,
    // media : string 
    // uuid: string
    // hasRead?: boolean
    messageBlock: any[][]
}



const  MessageBlock: FC<MessageProps>=({messageBlock})=> {
  const me = useAppSelector(state=>state.auth.user)
  const NoMe = useAppSelector(state=>state.chats.users)
 







// useEffect(()=>{
//     console.log(messageBlock,"block")
// },[])
  return (
    <>
     <div className={messageBlock[0].from_user_id == me.uuid || me.uuid == "" || undefined ? 'message my-message'  : 'message'}>
      <div className={messageBlock[0].from_user_id == me.uuid || me.uuid == "" || undefined ? 'chat-message-new'  : 'chat-message-new'}>
      <div className="avatar avatar-message">
        {
        messageBlock[0].from_user_id == me.uuid  ? 
          me.avatar == "" ? (<img src={"http://localhost:5173/"+avatar} alt="" />) :   (<img src={"http://localhost:5173/public/"+me.avatar} alt="" />) 
          :  
          NoMe.avatar == "" ? (<img src={"http://localhost:5173/"+avatar} alt="" />) :   (<img src={"http://localhost:5173/public/"+NoMe.avatar} alt="" />)
        }
           { 
                     messageBlock[0].from_user_id == me.uuid  ? 
                    <p className='title'>{me.login}</p>
                      :  
                    <p className='title'>{NoMe.login}</p>
                    }
      </div>

                 

      {/* ///////////// */}


                  
      {messageBlock.map(message=>( <NewMessage uuid={message.uuid} key={message.uuid} content={message.content} media={message.media} classUser={message.from_user_id} time={message.timestamp}  hasRead={message.has_read}></NewMessage>
        ))}





      
      </div>
      </div>
      
    </>
  )
}




export default MessageBlock