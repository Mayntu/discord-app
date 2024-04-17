import  { FC, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks/redux-hoock'
import { fetchLogin, fetchRegistration } from '../store/acthion'

const LoginForm:FC=()=> {

    const [email,setEmail] =useState<string>("")
    const [password,setPassword] = useState<string>("")
    const [login,setLogin] = useState<string>("")
    const [isLog, setIsLog] = useState<boolean>(false)
    const dispatch = useAppDispatch()
    const {isAuth} = useAppSelector(state=>state.auth)

    useEffect(()=>{
      if(isAuth){

      }
    },[])
   
   
  return (

    <div className='container-form'>
        <div className={isLog ? "block-form  " : "block-form "} >
          <div className="block-form-name">
            <p className={isLog ? "active ": ""} onClick={()=>setIsLog(true)}>login</p>
            <p className={isLog ? "" : "active"} onClick={()=>setIsLog(false)}>Registrathion</p>
          </div>
        {isLog ?  
         <> 
         <div className="form">
            <label htmlFor="">Login</label>
            <input type="text" placeholder='login' value={login} onChange={(e)=>setLogin(e.target.value)}/>
            <label htmlFor="">Password</label>
            <input type="text" placeholder='password' value={password} onChange={(e)=>setPassword(e.target.value)}/>
            <button onClick={()=>dispatch(fetchLogin({login,password}))}>LOGIN</button>
        </div>
        </>
         : 
        <>
        <div className="form">
            <label htmlFor="">Email</label>
            <input type="text" placeholder='email' value={email} onChange={(e)=>setEmail(e.target.value)}/>
            <label htmlFor="">Login</label>
            <input type="text" placeholder='email' value={login} onChange={(e)=>setLogin(e.target.value)}/>
            <label htmlFor="">Password</label>
            <input type="text" placeholder='password' value={password} onChange={(e)=>setPassword(e.target.value)}/>
            <label htmlFor="">REPassword</label>
            <input type="text" placeholder='password' value={password} onChange={(e)=>setPassword(e.target.value)}/>
            <button onClick={()=>{dispatch(fetchRegistration({login,email,password}))
          console.log(localStorage.getItem("token"))
          }}>REGISTRATHION</button>
          </div>
        </>
        }
      </div>
        
    </div>
  )
}


export default LoginForm