import { NavLink } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../hooks/redux-hoock'
import { useEffect,  useRef, useState } from 'react'
import { fetchCreateServer, fetchGetServer} from '../store/actionServer'
import iconCamera from "../assets/camera.png"
import chatIcon from "../assets/chat-group.png"
import addServer from "../assets/addServer.png"
import icon from "../assets/menu.png"

import "../css/server.css"

import ModuleTest from './Module'

const ServerContainer=()=> {
    const dispatch = useAppDispatch()
    const [isCreateServerM, setIsCreateSreverM] = useState<boolean>(false)
    const {serversUser} = useAppSelector(state=>state.server)
    const [file,setFile] = useState<File | undefined>(undefined)
    const refImage = useRef<HTMLInputElement>(null) 
    const [newServerTitle, setNewServerTitle] = useState<string>("")

    const newServer=async()=>{
      console.log(file)
      const formData = new FormData()
      if(file)
      formData.append("file",file)
      formData.append("title",newServerTitle)
      await dispatch(fetchCreateServer(formData)).then(()=>{dispatch(fetchGetServer())})
      setIsCreateSreverM(false)
    }
    useEffect(()=>{
      dispatch(fetchGetServer())
    },[])
      const handleImage=()=>{
        if(refImage.current){
          refImage.current.click()
        }
        setIsCreateSreverM(true)
      }
  return (
    <>
    <div className="container-server">
    <NavLink to={"/set"}
    className={({ isActive, isPending }) =>
      isPending ? "pending-link block-server-link" : isActive ? "active block-server-link" : "active-link block-server-link"
  }
    >
      <div className="block-server">
      <img src={icon} alt="" className='set-Icon-small'  onClick={()=>{}}/>
      </div>
    </NavLink>
    <NavLink to={"/chat"}   className={({ isActive, isPending }) =>
        isPending ? "pending-link block-server-link" : isActive ? "active block-server-link" : "active-link block-server-link"
    }>
      <div className="block-server">
        <img src={chatIcon} alt="" className='set-Icon' />
      </div>
    </NavLink>
    <div className=" addblockserver" onClick={()=>{setIsCreateSreverM(true)}}>
      <img src={addServer} alt=""  />
     
    </div>
    {serversUser.length !== 0 && serversUser.map(i=>(
    <NavLink to={`/server/${i.uuid}`}  key={i.uuid} 
      className={({ isActive, isPending }) =>
        isPending ? "pending-link block-server-link" : isActive ? "active block-server-link" : "active-link block-server-link"
    }
    >
      <div className="block-server">
        {i.avatar ? <img src={"http://localhost:5173/public/"+i.avatar}/> : <p>{i.title.length>6 ? i.title.substring(0,7) : i.title}</p> }
      </div>
    </NavLink>))}
  </div>
   {isCreateServerM && 
   <ModuleTest isModule={setIsCreateSreverM}>
      <>
        <div className="icon-block-module">
          <img src={iconCamera} alt="" className='imput-setting' onClick={handleImage}/>
        </div>
      <input ref={refImage} type="file" accept='image/*,.png,.web,.jpg,.gif' onChange={(e)=>{if(e.target.files) setFile(e.target.files[0])}} className='none'/>
      <input type="text" placeholder='title server' onChange={(e)=>setNewServerTitle(e.target.value)} value={newServerTitle} />
      <button onClick={newServer}>Сохранить</button>
      </>
    </ModuleTest>}
   </>
  )
}

export default ServerContainer