import  { FC, ReactNode, useEffect, useState,  } from 'react'
import avatar from "../assets/sonic.jpg"
import { useAppDispatch, useAppSelector } from '../hooks/redux-hoock'
import { isModule, isModuleSet } from '../store/ModuleSlice'
import { addMessage } from '../store/ChatsSlice'
import $api from '../http'
import { fetchGetServer } from '../store/actionServer'


interface MessageProps{
    children : string
    classUser : string,
    time: string,
    media : string 
    uuid: string
}



const  Message: FC<MessageProps>=({classUser,children,time,media,uuid})=> {
  const me = useAppSelector(state=>state.auth.user)
  const NoMe = useAppSelector(state=>state.chats.users)
  const dispatch = useAppDispatch()
  const messageUser = useAppSelector(state=>state.chats.message)
  const [isUrl,setIsURL] = useState<boolean>(false)
  const [URLdomen,setURLdomen] = useState<string>("")
  const [gif,setGif] = useState<string>("")
 
  const isMeduleSet=()=>{
    if(messageUser.uuid){
      dispatch(addMessage(""))
    }else{
      dispatch(addMessage(uuid))
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
  },[])
  const fetchMessage=async(str:string)=>{
    const res = await $api.get(str)
    console.log(res.data)
    if(res.data.result){
      dispatch(fetchGetServer())
      dispatch(isModuleSet({isViewModuleSetting:true,children:(<><h1>Вы приняты</h1></>)}))
    }
  }
  return (
    <>
    <div className={classUser == me.uuid || me.uuid == "" || undefined ? 'message my-message'  : 'message'} onClick={isMeduleSet}>
      <div className={classUser == me.uuid || me.uuid == "" || undefined ? 'chat-message'  : 'chat-message'}>
        <div className="avatar avatar-message">
          {
          classUser == me.uuid  ? 
            me.avatar == "" ? (<img src={"http://localhost:5173"+avatar} alt="" />) :   (<img src={"http://localhost:5173/"+me.avatar} alt="" />) 
            :  
            NoMe.avatar == "" ? (<img src={"http://localhost:5173"+avatar} alt="" />) :   (<img src={"http://localhost:5173/"+NoMe.avatar} alt="" />)
          }
        </div>
          <div className="row">
            {isUrl ? 
            URLdomen ? <a onClick={()=>{fetchMessage(URLdomen)}}>{children}</a> : 
                                      gif ? null: (<a href={children}>{children}</a>) 
            : 
            ( <p>{children}</p>)}
           
          {/* <p>{`
          ${new Date(time).getHours()>10 ? new Date(time).getHours() : "0"+new Date(time).getHours()}
          : ${new Date(time).getMinutes()>10 ? new Date(time).getMinutes() : "0"+new Date(time).getMinutes()}
          : ${new Date(time).getSeconds()>10 ? new Date(time).getSeconds() : "0"+new Date(time).getSeconds() }`}</p> */}
          </div>
      </div>
     
          
      <>
      <div className='image-message' 
      // один вариант
      // onClick={()=>{dispatch(isModule({isViewModule: true,imageSrc:"http://localhost:5173/public/"+media }))}}
      

      // второй вариант
      onClick={()=>{dispatch(isModuleSet({isViewModuleSetting:true,children:( <img src={"http://localhost:5173/public/"+media} alt="" />)}))}}
      >
        {gif && (<img src={gif} alt="" />)}
        <img src={"http://localhost:5173/public/"+media} alt="" />
      </div>
      
      {media && ( <audio src={"http://localhost:5173/public/"+media} controls></audio>)} 
      {URLdomen && (<p>ssalk domen</p>)}
     </>
     <p>{` ${new Date(time).getHours()>10 ? new Date(time).getHours() : "0"+new Date(time).getHours()}
          : ${new Date(time).getMinutes()>10 ? new Date(time).getMinutes() : "0"+new Date(time).getMinutes()}
          : ${new Date(time).getSeconds()>10 ? new Date(time).getSeconds() : "0"+new Date(time).getSeconds() }`}</p>
    </div>
  
    </>
  )
}




export default Message