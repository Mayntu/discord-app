import  { FC,  useEffect, useState,  } from 'react'
import avatar from "../assets/sonic.jpg"
import { useAppDispatch, useAppSelector } from '../hooks/redux-hoock'
import { addMessage } from '../store/ChatsSlice'
import $api from '../http'
import { fetchGetServer } from '../store/actionServer'
import { useNavigate } from 'react-router-dom'
import ModuleTest from './Module'
import { fetchReadMessage, fetchRecognizeAudio } from '../store/acthionChat'


interface MessageProps{
    children : string
    classUser : string,
    time: string,
    media : string 
    uuid: string
    hasRead?: boolean
}



const  Message: FC<MessageProps>=({classUser,children,time,media,uuid,hasRead})=> {
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
      dispatch(addMessage({uuid,content:children}))
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
    isURL(children)
    if(!hasRead && classUser !== me.uuid){
      dispatch(fetchReadMessage(uuid)).then((res)=>{
        if(res.payload.result){
          sethasReadState(true)
        }
      })
    }
  },[])

  useEffect(()=>{
    if(hasRead ==true){
      console.log("true")
      sethasReadState(hasRead)
    }
  },[hasRead])

  const fetchMessage=async(str:string)=>{
    const res = await $api.get(str)
    if(res.data.result){
      dispatch(fetchGetServer()).then(()=>{navigate(`/server/${res.data.server_id}`)})
    }
  }

  useEffect(()=>{
    // console.log(media.split(".").splice(-1,1)[0])
    if(media.split(".").splice(-1,1)[0] == "mp3" || media.split(".").splice(-1,1)[0] == "wav" ){
      // dispatch(fetchRecognizeAudio(uuid))
      setAudio(true)
    }
  },[])
  return (
    <>
    <div className={classUser == me.uuid || me.uuid == "" || undefined ? 'message my-message'  : 'message'} onClick={isMeduleSet}>
      <div className={classUser == me.uuid || me.uuid == "" || undefined ? 'chat-message'  : 'chat-message'}>
        {audio ?  media && ( <audio src={"http://localhost:5173/public/"+media} controls></audio>) : 
        <>
        <div className="avatar avatar-message">
        {
        classUser == me.uuid  ? 
          me.avatar == "" ? (<img src={"http://localhost:5173/"+avatar} alt="" />) :   (<img src={"http://localhost:5173/public/"+me.avatar} alt="" />) 
          :  
          NoMe.avatar == "" ? (<img src={"http://localhost:5173/"+avatar} alt="" />) :   (<img src={"http://localhost:5173/public/"+NoMe.avatar} alt="" />)
        }
      </div>
        <div className="row">
          {isUrl ? URLdomen ? 
          <a onClick={()=>{fetchMessage(URLdomen)}}>{children}</a> 
          : 
          gif ? null: (<a href={children}>{children}</a>) 
          : 
          ( <p>{children}</p>)}
         
        </div>
        </>
        }
    
      </div>
      <>
      <div className='image-message' onClick={()=>setIsModule(true)}>
        {gif && (<img src={gif} alt="" />)}
        {media && <img src={"http://localhost:5173/public/"+media} alt="" />}
      </div>
     </>
     <p>{` ${new Date(time).getHours()>10 ? new Date(time).getHours() : "0"+new Date(time).getHours()}
          : ${new Date(time).getMinutes()>10 ? new Date(time).getMinutes() : "0"+new Date(time).getMinutes()}
          : ${new Date(time).getSeconds()>10 ? new Date(time).getSeconds() : "0"+new Date(time).getSeconds() }`}</p>
           {hasReadState ? <p>true</p> : <p>false</p> }
    </div>
        {isModule && <ModuleTest isModule={setIsModule}>
        {gif && (<img src={gif} alt="" />)}
        <img src={"http://localhost:5173/public/"+media} alt="" />
          </ModuleTest>}

    </>
  )
}




export default Message