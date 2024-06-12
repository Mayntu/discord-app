
import avatar from "../assets/sonic.jpg"

import  { FC, useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks/redux-hoock'
import { fetchPostCreateRole } from '../store/acthionServerUser'
import "../css/serverRole.css"
import { useNavigate, useParams } from 'react-router-dom'
import { fetchDeleteServer, fetchGetServer, fetchpostChangeServersTitle, fetchpostInvitationLink ,fetchСhangeServersAvatar} from '../store/actionServer'
import ModuleTest from './Module'

const ServerRolePanel:FC=()=> {
    const {serverid}= useParams()
    const dispatch = useAppDispatch()
    const {permession}= useAppSelector((state)=>state.server)
    const {userPerm}= useAppSelector((state)=>state.server)
    // const {ServersRoles}= useAppSelector((state)=>state.server)
    const [isModule,setIsModule] = useState<boolean>(false)
    const [changePermession,setChangePermession]= useState<string[]>([])
    const [color,setColor]= useState<string>("#D9D9D9")
    const [roleName,setRoleName] = useState<string>("")
    const navigate = useNavigate()
    // const {serversUser}= useAppSelector((state)=>{state.server})
    const [isModuleInvite,setIsModuleInvite] = useState<boolean>(false)
    const [link,setLink] = useState<string>("")
    const [file,setFile] = useState<File | undefined>(undefined)
    const [isModuleAvatar,setIsModuleAvatar] = useState<boolean>(false)
    const [serverTitle,setServerTitle] = useState<string>("")
    const refImage = useRef<HTMLInputElement>(null) 
    useEffect(()=>{
   
        
    },[])
    
    useEffect(()=>{
        console.log(permession,"per")
    },[permession])

    const cretePer=(e,role)=>{
      console.log(e.target.checked)
      if(e.target.checked){
        setChangePermession([...changePermession,role])
      }else{
        let per = changePermession
        per = per.filter(i=>i !== role)
        setChangePermession([...per])
      }
      
    }
    useEffect(()=>{
      console.log( changePermession)
    },[changePermession])

    const createRole=()=>{
      // console.log("createRole")
      serverid && dispatch(fetchPostCreateRole({server_uuid:serverid,role_color:color,role_name:roleName,permissions:changePermession}))
    }

    const deleteServer=()=>{
      serverid && dispatch(fetchDeleteServer(serverid))
                .then(()=>{navigate("/chat")})
                .then(()=>{dispatch(fetchGetServer())})
    }

    const inviteServer=()=>{
      serverid && dispatch(fetchpostInvitationLink(serverid)).then((res)=>{setLink(res.payload.link)})
      setIsModuleInvite(true)
    }

    const newAvatar=()=>{
      console.log(file)
      const formData = new FormData()
      if(file && serverid){
        formData.append("file",file)
        formData.append("title",serverid)
        dispatch(fetchСhangeServersAvatar(formData)).then(()=>{dispatch(fetchGetServer())})
        setIsModuleAvatar(false)
      }
      
    }

    const newTitleServer=()=>{
      dispatch(fetchpostChangeServersTitle({server_uuid : serverid,title: serverTitle})).then(()=>{dispatch(fetchGetServer())})
      setIsModule(false)
      console.log("wojdiw")
    }
  return (
    <div className='server-role-panel'>
      <div className="setting-block-panel">
        <div className={userPerm["RENAME"] ? "btn-server-psnel" : "none"}  onClick={()=>setIsModule(true)}>
          <p>Переименовать сервер</p>
        </div>
        <div className={userPerm["REAVTR"] ? "btn-server-psnel" : "none"} onClick={()=>{setIsModuleAvatar(true)}}>
          <p>Сменить аватарку</p>
        </div>
        <div className={userPerm["DELETE"] ? "btn-server-psnel red" : "none"}
              onClick={deleteServer}><p>Удалить сервер</p>
        </div>
        <div className={userPerm["INVITE_USER"] ? "btn-server-psnel invite" : "none"}
        onClick={inviteServer}>
          <p>Пригласить новых пользователей</p>
        </div>
      </div>
      {userPerm["CREATE_ROLE"] ? 
      
      <div className="setting-block-panel-role">
      <p className='tit'>Создание роли</p>
      <input type="text" placeholder='Наименование для роли' value={roleName} onChange={(e)=>{setRoleName(e.target.value)}} />
      <div className="color-role">
        <input type="color" value={color} onChange={(e)=>{setColor(e.target.value)}}/>
        <p>Цвет роли</p>
      </div>


      <p className='tit2'>Список возмжностей сервера</p>

      <div className="block-panel-role">
       
          {permession.map((i:any)=>(
           <div className="role-block" key={i.key}>
          <p>
            {i.description}
          </p>
          <div className="container">
          <input type="checkbox" id="toggle-button" className="toggle-button" onChange={(e)=>cretePer(e,i.key)}/>
          <label htmlFor="toggle-button" className="text"></label>
        </div>
          </div>
          ))}
       
         
      </div>
      <div className="btn-server-psnel">
      <p onClick={createRole}>создать роль</p>
    </div>
  </div> 
      :
       ""}
     
        {/* {permesion.map} */}
        {/* <input type="checkbox"></input>
        <input type="radio"></input>
        <button onClick={()=>{dispatch(fetchPostinsertModerator({server_uuid:serverid,user_uuid:"031961a8-223b-47c0-86f1-5e1ae2b63acb"}))}}>Создать модератора</button>
        <button onClick={()=>{serverid && dispatch(fetchPostCreateRole({server_uuid:serverid,role_color:"blue",role_name:"sonic",permissions:["DELETE_MSGS"]}))}}></button>
        {permession.map((i)=><p key={i.key}>{i.key}</p>)}
        {ServersRoles.map((i)=><p key={i.uuid}>{i.name} 
        <button onClick={()=>{dispatch(fetchPostDeleteRole({server_uuid:serverid,role_uuid:i.uuid}))}}>удалить
        </button> */}
        {/* <button onClick={()=>{dispatch(fetchPostAddUserRole({user_uuid_to_add:"031961a8-223b-47c0-86f1-5e1ae2b63acb",role_uuid:i.uuid,server_uuid:serverid}))}}> дать роль</button></p>)} */}

        {isModuleInvite && <ModuleTest isModule={setIsModuleInvite}>
        <h1>Скопируйте ссылку</h1>
        <button onClick={()=>{
          navigator.clipboard.writeText("localhost:5173/"+link).then(()=>{console.log(true)})
          setIsModuleInvite(false)
        }}>copy</button>
        <p>localhost:5173/{link}</p>
        </ModuleTest>}
        {isModuleAvatar && <ModuleTest isModule={setIsModuleAvatar}>
        <input ref={refImage} type="file" accept='image/*,.png,.web,.jpg,.gif' onChange={(e)=>{if(e.target.files) setFile(e.target.files[0])}} className='none'/>
           {file ? <img src={window.URL.createObjectURL(file)} alt="" className='server-setting-avatar'/> : <img src={"http://localhost:5173/"+avatar} alt="" className='server-setting-avatar'/>}
           <button onClick={()=>{
               if(refImage.current){
                refImage.current.click()
              }
           }}>иыбрать</button>
            <button onClick={newAvatar}>Сохранить</button>
        </ModuleTest>}

        {isModule && 
        <ModuleTest isModule={setIsModule}>
          <input type="text" onChange={e=>setServerTitle(e.target.value)} value={serverTitle}/>
          <button onClick={newTitleServer}>Сохранить</button>
        </ModuleTest>}

    </div>
  )
}


export default ServerRolePanel