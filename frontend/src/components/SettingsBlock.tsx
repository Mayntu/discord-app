import { FC } from 'react'
import { useAppSelector } from '../hooks/redux-hoock'
import icon from "../assets/s.png"


interface SettingsBlockProps{
    // isView : string
    setIsSettings:  React.Dispatch<React.SetStateAction<any>>
}


const  SettingsBlock:FC=({setIsSettings})=> {

  const user = useAppSelector(state=>state.auth.user)


  return (
    <div className='settings-container'>
      <img src={icon} alt=""  onClick={()=>(setIsSettings(true))}/>
        <div>SettingsBlock</div>
        <div className="UserBlock">
          <div className="avatar">
            {user.avatar == "." ? <img src="" alt=""/>  :  <img src={user.avatar} alt="" />}
           
          </div>
          <p>{user.login}</p>

        </div>
    </div>
    
  )
}

export default SettingsBlock