import { FC } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks/redux-hoock'
import icon from "../assets/s.png"
import { useNavigate } from 'react-router-dom'
import { setIsAuth } from '../store/AuthSlice'


interface SettingsBlockProps{
    // isView : string
    setIsSettings:  React.Dispatch<React.SetStateAction<any>>
}


const  SettingsBlock:FC<SettingsBlockProps>=({setIsSettings})=> {
  const navigate = useNavigate()
  const user = useAppSelector(state=>state.auth.user)
  const dispatch = useAppDispatch()

  return (
    <div className='settings-container'>
      <div className="settting-icon">
        <img src={icon} alt=""  onClick={()=>(setIsSettings(true))}/>
      </div>
        <div className="UserBlock">
          <div className="avatar-setting">
            {user.avatar == "." ? <img src="" alt=""/>  :  <img src={user.avatar} alt="" />}
          </div>
          <p>{user.login}</p>
        </div>
        <div className="settingBlock">
          <p onClick={()=>{
            dispatch(setIsAuth(false))
            localStorage.removeItem("token")
            if(!localStorage.getItem("token")){
              navigate("/login")
            }
          }
            
            }>Выход</p>
        </div>
    </div>
    
  )
}

export default SettingsBlock