import  { FC, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks/redux-hoock'
import { useNavigate, useParams } from 'react-router-dom'
import { addMessage } from '../store/ChatsSlice'
import ModuleTest from './Module'
import $api from '../http'
import { fetchGetServer } from '../store/actionServer'
import AudioMy from './Audio'
import { fetchRecognizeAudio } from '../store/acthionChat'

interface MessageProps{
    content : string
    classUser : string,
    time: string,
    media : string 
    uuid: string
    hasRead?: boolean
    blockId: string;
}
const NewMessage:FC<MessageProps>=({media,content,hasRead,classUser,uuid,time,blockId})=> {
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
    const {chatid,chatserverid} = useParams()
    const fetchMessage=async(str:string)=>{
      const res = await $api.get(str)
      if(res.data.result){
        dispatch(fetchGetServer()).then(()=>{navigate(`/server/${res.data.server_id}`)})
      }
    }
    const isMeduleSet=()=>{
      if(chatserverid){
        if(messageUser.uuid){
          dispatch(addMessage(""))
        }else if(gif){
          dispatch(addMessage({uuid,content,blockId,media:gif}))
        }else{
          
          dispatch(addMessage({uuid,content,blockId,media}))
        }
      }else{
        if(NoMe.uuid ==classUser ){
          console.log(NoMe)
        }else{
          if(messageUser.uuid){
            dispatch(addMessage(""))
          }else if(gif){
            dispatch(addMessage({uuid,content,blockId,media:gif}))
          }else{
            
            dispatch(addMessage({uuid,content,blockId,media}))
          }
        }
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
          else if(str.includes("localhost:5173/invite/")){
            console.log(str.substring(15,str.length))
            setURLdomen(`http://127.0.0.1:8000/${str.substring(15,str.length)}`)
          }
        } catch {
    
        }
      }

    useEffect(()=>{
    isURL(content)
  },[])


  useEffect(()=>{
    if(hasRead ==true){
      sethasReadState(hasRead)
    }
  },[hasRead])
  
  useEffect(()=>{

    if(media.split(".").splice(-1,1)[0] == "mp3" || media.split(".").splice(-1,1)[0] == "wav" ){
      setAudio(true)
       dispatch(fetchRecognizeAudio(uuid))
    }
  },[])
  return (
    <>
       <div className="row" key={uuid} onClick={isMeduleSet}>
                  {audio ?  media && (
                  <> 
                  
                  <AudioMy link={"http://localhost:5173/public/"+media} time={time} status={hasReadState} me={classUser == me.uuid}></AudioMy>
                  </>
                ) :
                  <div className="row-con">
                  
                      {isUrl ? URLdomen ? 
                     <a onClick={()=>{fetchMessage(URLdomen)}}>{content}</a> 
                      : 
                      gif ? null: (<a href={content}>{content}</a>) 
                      : 

                      (
                        <>
                        <p>{content}</p>
                    
                      <span className='date'>   {` ${new Date(time).getHours()>10 ? new Date(time).getHours() : "0"+new Date(time).getHours()}
                      : ${new Date(time).getMinutes()>10 ? new Date(time).getMinutes() : "0"+new Date(time).getMinutes()}`} {classUser == me.uuid && chatid  && (<div className={hasReadState ? "true-status" : "false-status"}></div>)}  </span>
                    </>
                    )
                      
                      }
                      {/* { media == "" &&  */}
                      
                  </div>
                  
                  }
                      
                </div>
                {media !== "" && !audio && <div className='image-message' onClick={isMeduleSet}>
                    {media && <img src={"http://localhost:5173/public/"+media} alt=""  onClick={
                      (e)=>{setIsModule(true)
                      e.stopPropagation()
                      }
                    }/>}
                    <span className='date' >   {` ${new Date(time).getHours()>10 ? new Date(time).getHours() : "0"+new Date(time).getHours()}
                      : ${new Date(time).getMinutes()>10 ? new Date(time).getMinutes() : "0"+new Date(time).getMinutes()}`} {classUser == me.uuid && chatid  && (<div className={hasReadState ? "true-status" : "false-status"}></div>)}  </span>
                    
                  </div>} 
                  {gif && <div className='image-message' onClick={isMeduleSet}>
                    {gif && (<img src={gif} alt=""   onClick={
                      (e)=>{setIsModule(true)
                      e.stopPropagation()
                      }
                    }/>)}
                    <span className='date' >   {` ${new Date(time).getHours()>10 ? new Date(time).getHours() : "0"+new Date(time).getHours()}
                      : ${new Date(time).getMinutes()>10 ? new Date(time).getMinutes() : "0"+new Date(time).getMinutes()}`} {classUser == me.uuid && chatid  && (<div className={hasReadState ? "true-status" : "false-status"}></div>)}  </span>
                    
                  </div>} 
                 
              {isModule && <ModuleTest isModule={setIsModule}>
                {gif && (<img src={gif} alt="" />)}
                <img src={"http://localhost:5173/public/"+media} alt="" />
          </ModuleTest>}
    </>
  )
}


export default NewMessage