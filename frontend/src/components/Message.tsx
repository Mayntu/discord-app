import  { FC, ReactNode, useEffect, useState } from 'react'
import avatar from "../assets/sonic.jpg"
import { useAppSelector } from '../hooks/redux-hoock'
import axios from 'axios'

interface MessageProps{
    children : ReactNode
    classUser : string,
    time: string,
    media : string 

}



const  Message: FC<MessageProps>=({classUser,children,time,media})=> {
  const me = useAppSelector(state=>state.auth.user)
  const [file,setFile] = useState<any>("")
  
  const getImage=async()=>{
    console.log(media)
    // setTimeout(()=>{
    //   setFile(media)
    // },2000)

    // const res = await axios.get(media)
    // const reader = new FileReader();
    // reader.readAsDataURL(res.data)
    // reader.onload = ()=>{
    //   setFile(reader.result)
    // }
 
    // return (
    //   <>
    //   {media && 
    //   (<div className='image-message'>
    //     <img src={media} alt="" />
    //   </div>) }
    //  </>
    // )
  }
   

  useEffect(()=>{
    getImage()
  },[])

  return (
    <>
    <div className={classUser == me.uuid || me.uuid == "" || undefined ? 'message my-message'  : 'message'}>
      <div className={classUser == me.uuid || me.uuid == "" || undefined ? 'chat-message my-message'  : 'chat-message'}>
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