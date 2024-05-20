import { NavLink } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../hooks/redux-hoock'
import { useEffect,  useRef, useState } from 'react'
import { fetchCreateServer, fetchGetServer, fetchpostChangeServersTitle } from '../store/actionServer'
import Module from './Module'
import iconCamera from "../assets/camera.png"
const ServerContainer=()=> {
    const dispatch = useAppDispatch()
    const [isCreateServerM, setIsCreateSreverM] = useState<boolean>(false)
    const {serversUser} = useAppSelector(state=>state.server)
    const [file,setFile] = useState<File>()
    const refImage = useRef<HTMLInputElement>(null) 
    
    const newFile=async()=>{
      console.log(file)
      if(!file){
        alert("please")
        return
      }
      const formData = new FormData()
      formData.append("file",file)
      formData.append("title","somicHerous")
      console.log(formData,"formdata")
      await dispatch(fetchCreateServer(formData)).then(()=>{dispatch(fetchGetServer())})
      setIsCreateSreverM(false)
    }
    useEffect(()=>{
      dispatch(fetchGetServer())
    },[])
   
    const server=async()=>{
         dispatch(fetchCreateServer({title: "satana123",avatar:""}))
      }
      
      const handleImage=()=>{
        if(refImage.current){
          refImage.current.click()
        }
        setIsCreateSreverM(true)
    
      }
  return (
    <>
    <div className="container-server">
    <NavLink to={"/chat"}>
      <div className="block-server-chat">
        просто чаты
      </div>
    </NavLink>
    <div className="block-server" 
    onClick={()=>{dispatch(fetchpostChangeServersTitle({server_uuid : "277bc986-dfbe-43f6-b6e4-034c460ef58a",title: "sonic"}))}}
    >
        изменить имя
      </div>
    <div className="block-server" onClick={()=> setIsCreateSreverM(true)}>
      создать сервер
      
    </div>
 
   {/* invite/4McBNSuX6N1kTX1Rb71Yr6MQq9BQtn7cxTi7qNObqTcWN913K4ZFUVKZP9Tjf */}
   {/* http://127.0.0.1:8000/invite/id */}
    {serversUser.length && serversUser.map(i=>(<NavLink to={`/server/${i.uuid}`}  key={i.uuid} ><div className="block-server">{i.title}</div></NavLink>))}
  </div>
   {isCreateServerM && 
   <Module newFile={newFile}>
      <div>
        <div className="avatar-setting ">
          <img src={iconCamera} alt="" className='imput-setting' onClick={handleImage}/>
        </div>
      <input ref={refImage} type="file" accept='image/*,.png,.web,.jpg,.gif' onChange={(e)=>{if(e.target.files) setFile(e.target.files[0])}} className='none'/>
      </div>
    </Module>}
   </>
  )
}

export default ServerContainer