import  { FC, useState } from 'react'
import { useAppDispatch } from '../hooks/redux-hoock'
import { fetchLogin, fetchRegistration } from '../store/acthion'
import { reg } from '../store/AuthSlice'
import axios from 'axios'

const LoginForm:FC=()=> {

    const [email,setEmail] =useState<string>("")
    const [password,setPassword] = useState<string>("")
    const [login,setLogin] = useState<string>("")
    const [isLog, setIsLog] = useState<boolean>(false)
    const dispatch = useAppDispatch()


    const fetchall= async()=>{
      let res = await axios.post("http://127.0.0.1:8000/api/v1/registration/",{
        email,password,login
      })
      console.log(res)
    }

  return (

    <div>
        <p>для смены логин регистрация жми по слову </p>
        {/* <h3 onClick={()=>setIsLog((prev)=>!prev)}>{isLog ? "login"  : "Registrathion"}</h3>  */}
        {isLog ?  
         <> 
            <label htmlFor="">Login</label>
            <input type="text" placeholder='login' value={login} onChange={(e)=>setLogin(e.target.value)}/>
            <label htmlFor="">Password</label>
            <input type="text" placeholder='password' value={password} onChange={(e)=>setPassword(e.target.value)}/>
            <button onClick={()=>dispatch(fetchLogin({email,password}))}>LOGIN</button>
        </form>
         : 
<<<<<<< Updated upstream
        <>
=======
       <>
>>>>>>> Stashed changes
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