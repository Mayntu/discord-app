


import  { FC, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks/redux-hoock'
import { useNavigate } from 'react-router-dom'
import { fetchReadMessage } from '../store/acthionChat'
import { addMessage } from '../store/ChatsSlice'
import ModuleTest from './Module'

interface MessageProps{
    content : string
    classUser : string,
    time: string,
    media : string 
    uuid: string
    hasRead?: boolean
    
}
const NewMessage:FC<MessageProps>=({media,content,hasRead,classUser,uuid,time})=> {
    const me = useAppSelector(state=>state.auth.user)
    const NoMe = useAppSelector(state=>state.chats.users)
    const [isModule,setIsModule] = useState<boolean>(false)
    const dispatch = useAppDispatch()
    const messageUser = useAppSelector(state=>state.chats.message)
    const [isUrl,setIsURL] = useState<boolean>(false)
    const [URLdomen,setURLdomen] = useState<string>("")
    const [gif,setGif] = useState<string>("")
    const navigate = useNavigate()
    const [audio,setAudio] = useState<boolean>(false)
    const [hasReadState,sethasReadState]  = useState<boolean>(hasRead || false)
    const isMeduleSet=()=>{
        if(messageUser.uuid){
          dispatch(addMessage(""))
        }else{
          dispatch(addMessage({uuid,content}))
        }
      }
    function isURL(str:string) {
        try {
          new URL(str);
          setIsURL(true)
          if(str.includes("http://127.0.0.1:8000/invite/")){
              setURLdomen(str)
          }else if(str.includes("https://media.tenor.com/")){
            setGif(str)
          }
        } catch {
    
        }
      }

    useEffect(()=>{
    isURL(content)
    if(!hasRead && classUser !== me.uuid){
      dispatch(fetchReadMessage(uuid)).then((res)=>{
        if(res.payload.result){
          sethasReadState(true)
        }
      })
    }
  },[])
  return (
    <>
       <div className="row" key={uuid} onClick={isMeduleSet}>
                  <div className="row-con">
                   
                      {isUrl ? URLdomen ? 
                      <a >{content}</a> 
                      : 
                      gif ? null: (<a href={content}>{content}</a>) 
                      : 
                      ( <p>{content} 
                              
                      </p>)}
                      <span className='date'>   {` ${new Date(time).getHours()>10 ? new Date(time).getHours() : "0"+new Date(time).getHours()}
                        : ${new Date(time).getMinutes()>10 ? new Date(time).getMinutes() : "0"+new Date(time).getMinutes()}`}   <div className={hasReadState ? "true-status" : "false-status"}></div></span>
                  </div>
                  {/* <p className='date'>{` ${new Date(time).getHours()>10 ? new Date(time).getHours() : "0"+new Date(time).getHours()}
                        : ${new Date(time).getMinutes()>10 ? new Date(time).getMinutes() : "0"+new Date(time).getMinutes()}`}</p> */}
                 
                </div>
                <div className='image-message' onClick={()=>setIsModule(true)}>
                {gif && (<img src={gif} alt="" />)}
                {media && <img src={"http://localhost:5173/public/"+media} alt="" />}
              </div>
              {isModule && <ModuleTest isModule={setIsModule}>
        {gif && (<img src={gif} alt="" />)}
        <img src={"http://localhost:5173/public/"+media} alt="" />
          </ModuleTest>}
    </>
  )
}


export default NewMessage