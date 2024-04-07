import  { FC, useState } from 'react'
import { useAppDispatch } from '../hooks/redux-hoock'
import { fetchLogin, fetchRegistration } from '../store/acthion'

const LoginForm:FC=()=> {

    const [email,setEmail] =useState<string>("")
    const [password,setPassword] = useState<string>("")
    const [login,setLogin] = useState<string>("")
    const [isLog, setIsLog] = useState<boolean>(false)
    const dispatch = useAppDispatch()

  return (

    <div>
        <p>для смены логин регистрация жми по слову </p>
        <h3 onClick={()=>setIsLog((prev)=>!prev)}>{isLog ? "login"  : "Registrathion"}</h3> 
        {isLog ?  
         <form className='form'> 
            <label htmlFor="">Email</label>
            <input type="text" placeholder='email' value={email} onChange={(e)=>setEmail(e.target.value)}/>
            <label htmlFor="">Password</label>
            <input type="text" placeholder='password' value={password} onChange={(e)=>setPassword(e.target.value)}/>
            <button onClick={()=>dispatch(fetchLogin({email,password}))}>LOGIN</button>
        </form>
         : 
        <form className='form'>
            <label htmlFor="">Email</label>
            <input type="text" placeholder='email' value={email} onChange={(e)=>setEmail(e.target.value)}/>
            <label htmlFor="">Login</label>
            <input type="text" placeholder='email' value={login} onChange={(e)=>setLogin(e.target.value)}/>
            <label htmlFor="">Password</label>
            <input type="text" placeholder='password' value={password} onChange={(e)=>setPassword(e.target.value)}/>
            <label htmlFor="">REPassword</label>
            <input type="text" placeholder='password' value={password} onChange={(e)=>setPassword(e.target.value)}/>
            <button onClick={()=>dispatch(fetchRegistration({email,password}))}>REGISTRATHION</button>
        </form>
        }
      
        
    </div>
  )
}


export default LoginForm