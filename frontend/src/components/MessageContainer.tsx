

import  { FC } from 'react'
import { useParams } from 'react-router-dom'

const  MessageContainer : FC=()=> {
  const {chatid} = useParams()
  return (
    <div className='message-container'>

        MessageContainer {chatid}</div>
  )
}


export default MessageContainer
