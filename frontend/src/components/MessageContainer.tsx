import  { FC } from 'react'
import { useParams } from 'react-router-dom'
import backImage from "../assets/Rectangle 59.png"
const  MessageContainer : FC=()=> {
  const {chatid} = useParams()

  
  return (
    <div className='message-container' style={{backgroundImage : `url(${backImage})`}}>

        MessageContainer {chatid}</div>
  )
}


export default MessageContainer
