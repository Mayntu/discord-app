


import  { FC, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks/redux-hoock'
import { useNavigate } from 'react-router-dom'
import { fetchReadMessage } from '../store/acthionChat'
import { addMessage } from '../store/ChatsSlice'
import ModuleTest from './Module'
import $api from '../http'
import { fetchGetServer } from '../store/actionServer'
import AudioMy from './Audio'

interface MessageProps{
    content : string
    classUser : string,
    time: string,
    media : string 
    uuid: string
    hasRead: boolean
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
   
    const fetchMessage=async(str:string)=>{
      const res = await $api.get(str)
      if(res.data.result){
        dispatch(fetchGetServer()).then(()=>{navigate(`/server/${res.data.server_id}`)})
      }
    }
    const isMeduleSet=()=>{
        if(messageUser.uuid){
          dispatch(addMessage(""))
        }else{
          dispatch(addMessage({uuid,content,blockId}))
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
      console.log("true")
      sethasReadState(hasRead)
    }
  },[hasRead])
  
  useEffect(()=>{
    // console.log(media.split(".").splice(-1,1)[0])
    if(media.split(".").splice(-1,1)[0] == "mp3" || media.split(".").splice(-1,1)[0] == "wav" ){
      // dispatch(fetchRecognizeAudio(uuid))
      setAudio(true)
    }
    // if(media.split(".").splice(-1,1)[0] == "п" || media.split(".").splice(-1,1)[0] == "wav" ){
    //   // dispatch(fetchRecognizeAudio(uuid))
    //   setAudio(true)
    // }
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
                      ( <p>{content} 
                              
                      </p>)}
                      <span className='date'>   {` ${new Date(time).getHours()>10 ? new Date(time).getHours() : "0"+new Date(time).getHours()}
                        : ${new Date(time).getMinutes()>10 ? new Date(time).getMinutes() : "0"+new Date(time).getMinutes()}`} {classUser == me.uuid && (<div className={hasReadState ? "true-status" : "false-status"}></div>)}  </span>
                  </div>
                  
                  }
                      
                </div>
                {!audio && 
                ( <div className='image-message' onClick={()=>setIsModule(true)}>
                    {gif && (<img src={gif} alt="" />)}
                    {media && <img src={"http://localhost:5173/public/"+media} alt="" />}
                  </div>)}
               
              {isModule && <ModuleTest isModule={setIsModule}>
        {gif && (<img src={gif} alt="" />)}
        <img src={"http://localhost:5173/public/"+media} alt="" />
          </ModuleTest>}
    </>
  )
}


export default NewMessage