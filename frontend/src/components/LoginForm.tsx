import  { FC, useState } from 'react'
import { useAppDispatch } from '../hooks/redux-hoock'
import { fetchLogin, fetchRegistration } from '../store/acthion'
import axios from 'axios'
import { json } from 'react-router-dom'

const LoginForm:FC=()=> {

    const [email,setEmail] =useState<string>("")
    const [password,setPassword] = useState<string>("")
    const [login,setLogin] = useState<string>("")
    const [isLog, setIsLog] = useState<boolean>(false)
    const dispatch = useAppDispatch()
    
    ///api/v1/getchats

    const getchats = async ()=>{
      const res = await fetch("http://127.0.0.1:8000/api/v1/getchats",{
        method: "GET",
        headers: {
          "Authorization" : JSON.stringify(localStorage.getItem("token")),
          "Content-Type": "application/json"
        }
      }).then(res=>res.json())
      console.log(res)
    }

   
  return (

    <div>
        <button onClick={()=>getchats()}>LOGIN</button>
        <p>для смены логин регистрация жми по слову </p>
        <h3 onClick={()=>setIsLog((prev)=>!prev)}>{isLog ? "login"  : "Registrathion"}</h3> 
        {isLog ?  
         <> 
            <label htmlFor="">Login</label>
            <input type="text" placeholder='login' value={login} onChange={(e)=>setLogin(e.target.value)}/>
            <label htmlFor="">Password</label>
            <input type="text" placeholder='password' value={password} onChange={(e)=>setPassword(e.target.value)}/>
            <button onClick={()=>dispatch(fetchLogin({login,password}))}>LOGIN</button>
        </>
         : 
        <>
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
        </>
        }
      
        
    </div>
  )
}


export default LoginForm