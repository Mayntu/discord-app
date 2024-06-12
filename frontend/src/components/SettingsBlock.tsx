import { FC, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks/redux-hoock'
import icon from "../assets/s.png"
import iconEdit from "../assets/pencil.png"
import iconCamera from "../assets/camera.png"
import { Outlet, useNavigate } from 'react-router-dom'
import { setIsAuth } from '../store/AuthSlice'
import {fetchUser,fetchMedia, fetchChangeUsersLogin } from '../store/acthion'
import avatar from "../assets/sonic.png"
import ModuleTest from './Module'

// interface SettingsBlockProps{
//     setIsSettings:  React.Dispatch<React.SetStateAction<boolean>>
// }


const  SettingsBlock:FC=()=> {
  const navigate = useNavigate()
  const user = useAppSelector(state=>state.auth.user)
  const dispatch = useAppDispatch()
  const [isEditUser,setIsEditUser] = useState<boolean>(true)
  const [isModule,setIsModule] = useState<boolean>(false)
  const [login,setlogin] = useState<string>("")
  const [file,setFile] = useState<File>()
  const refImage = useRef<HTMLInputElement>(null) 
 
  const newFile=async()=>{
    console.log(file)
    if(!file){
      setIsModule(false)
      return
    }
    const formData = new FormData()
    formData.append("file",file)
    await dispatch(fetchMedia(formData))
    dispatch(fetchUser())
    setIsModule(false)
  }


  const exitUser =()=>{
    dispatch(setIsAuth(false))
    localStorage.removeItem("token")
    if(!localStorage.getItem("token")){
      navigate("/login")
    }
  }

  const handleImage=()=>{
    if(refImage.current){
      refImage.current.click()
    }
    setIsModule(true)

  }

  const ChanageUserLogin=async()=>{
    await dispatch(fetchChangeUsersLogin(login))
    dispatch(fetchUser())
  }


 


  return (
    <>
    <div className='settings-container'>
      {isEditUser ?
       <>
      <div className="settting-icon">
        
        <p>Настройки</p>
        <img src={iconEdit} alt="" onClick={()=>{setIsEditUser(!isEditUser)}}/>
      </div>
        <div className="UserBlock">
          <div className="avatar-setting">
            {user.avatar == "" ? <img src={"http://localhost:5173/"+avatar} alt=""/>  :  <img src={"http://localhost:5173/public/"+user.avatar} alt="" />}
          </div>
          <p>{user.login}</p>
        </div>
        <div className="settingBlock">
          <p onClick={()=>{exitUser()}}>Выход</p>
        </div>
      </> : <>
      <div className="settting-icon">
        <img src={icon} alt=""  onClick={()=>(setIsEditUser(!isEditUser))}/>
        <p>Настройки Профиля</p>
      </div>
      <div className="UserBlock editBlock">
            <div className="avatar-setting ">
            <img src={iconCamera} alt="" className='imput-setting' onClick={handleImage}/>
            {user.avatar == "" ? <img src={"http://localhost:5173/"+avatar} alt=""/>  :  <img src={"http://localhost:5173/public/"+user.avatar} alt="" />}
            <input ref={refImage} type="file" accept='image/*,.png,.web,.jpg,.gif' onChange={(e)=>{e.target.files &&  setFile(e.target.files[0])}} className='none'/>
          </div>
          <div className="settingBlock">
            <input type="text" placeholder='new login' onChange={(e)=>setlogin(e.target.value)} value={login}  />
            <button onClick={()=>{ChanageUserLogin()}}>Принять</button>
          </div>
        </div>
      </>}
        
        {isModule && 
        <ModuleTest isModule={setIsModule}>
          {file ? <img src={window.URL.createObjectURL(file)} alt="" className='setting-image-avatar'/> : <img src={"http://localhost:5173/"+avatar} alt="" className='setting-image-avatar'/>}
          <button onClick={newFile}>Сохранить</button>
        </ModuleTest>
        // <Module newFile={newFile} isModule={setIsModule}/>
        }
    </div>
    <Outlet></Outlet>
  </>
  )
}

export default SettingsBlock