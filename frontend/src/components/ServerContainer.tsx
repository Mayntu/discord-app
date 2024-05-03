import { NavLink } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../hooks/redux-hoock'
import { usePostCreateServerMutation } from '../store/RTQServer'
import { useEffect,  useRef, useState } from 'react'
import { fetchCreateServer, fetchGetServer } from '../store/actionServer'
import Module from './Module'

const ServerContainer=()=> {
    // const [result,{data,isLoading}] = usePostCreateServerMutation()
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
      await dispatch(fetchCreateServer({title: "satana123",avatar:"a"}))
      dispatch(fetchGetServer())
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
    <div className="container-server">
    <NavLink to={"/chat"}>
      <div className="block-server-chat">
        просто чаты
      </div>
    </NavLink>
    <div className="block-server" onClick={()=>{dispatch(fetchpostChangeServersTitle())}}>
        изменить имя
      </div>
    <div className="block-server" onClick={handleImage}>
      создать сервер
      <input ref={refImage} type="file" accept='image/*,.png,.web,.jpg,.gif' onChange={(e)=>{setFile(e.target.files[0])}} className='none'/>
    </div>
    {isCreateServerM && <Module newFile={newFile}></Module>}
    {serversUser.length && serversUser.map(i=>(<NavLink to={`/server/${i.uuid}`}  key={i.uuid} ><div className="block-server">{i.title}</div></NavLink>))}
  </div>
  )
}

export default ServerContainer