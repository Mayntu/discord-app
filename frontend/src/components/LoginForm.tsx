import  { FC, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks/redux-hoock'
import { fetchLogin, fetchRegistration } from '../store/acthion'
import { useNavigate } from 'react-router-dom'
import { useInput } from '../hooks/useInput'

const LoginForm:FC=()=> {

    const email = useInput("",{isEmpty:true,minlength:5,maxlength:64})
    const password = useInput("",{isEmpty:true,minlength:8,maxlength:32})
    const [rePassword,setRePassword] = useState<string>("")
    const login = useInput("",{isEmpty:true,minlength:5,maxlength:20})
    const [error,setError] = useState<string>("")
    const [isLog, setIsLog] = useState<boolean>(true)
    const dispatch = useAppDispatch()
    const {isAuth} = useAppSelector(state=>state.auth)
    const navigate = useNavigate()


    useEffect(()=>{
      console.log(localStorage.getItem("token"),"token",1)
      if(isAuth && localStorage.getItem("token") && localStorage.getItem("token")!== null && localStorage.getItem("token")!==undefined){
        console.log(localStorage.getItem("token"),"token",2)
        navigate("/chat")
      }
   
    },[isAuth])

    // useEffect(()=>{
    //   if(localStorage.getItem("token")){
    //     console.log(localStorage.getItem("token"),"token")
    //     navigate("/chat")
    //   }
   
    // },[])
   useEffect(()=>{
      login.notValid()
      email.notValid()
      password.notValid()
   },[isLog])

   

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
         {login.isDirty && login.minlengthError && !login.isEmpty&& <p style={{color: "red"}}>{login.ErrorNameminlength}</p>}
              {login.isDirty && login.isEmpty && <p style={{color: "red"}}>{login.ErrorNameisEmpty}</p>}
              {login.isDirty && login.maxlengthError && <p style={{color: "red"}}>{login.ErrorNamemaxlength}</p>}
            <label htmlFor="">Login</label>
            <input type="text" onBlur={login.onBlur} placeholder='login' value={login.value} onChange={login.onChange}/>
            {password.isDirty && password.minlengthError && !password.isEmpty && <p style={{color: "red"}}>{password.ErrorNameminlength}</p>}
              {password.isDirty && password.isEmpty && <p style={{color: "red"}}>{password.ErrorNameisEmpty}</p>}
              {password.isDirty && password.maxlengthError && <p style={{color: "red"}}>{password.ErrorNamemaxlength}</p>}
            <label htmlFor="">Password</label>
            <input type="text" onBlur={password.onBlur} placeholder='password' value={password.value} onChange={password.onChange}/>
            <button disabled={!password.valid || !login.valid} onClick={()=>dispatch(fetchLogin({login:login.value,password:password.value}))}>LOGIN</button>
        </div>
        </>
         : 
        <>
        <div className="form">
             {email.isDirty && email.isEmpty && <p style={{color: "red"}}>{email.ErrorNameisEmpty}</p>}
             {email.isDirty && email.minlengthError && !email.isEmpty && <p style={{color: "red"}}>{email.ErrorNameminlength}</p>}
             {email.isDirty && email.maxlengthError  && <p style={{color: "red"}}>{email.ErrorNamemaxlength}</p>}
            <label htmlFor="">Email</label>
            <input type="text" onBlur={email.onBlur} placeholder='email' value={email.value} onChange={email.onChange}/>
              {login.isDirty && login.minlengthError && !login.isEmpty&& <p style={{color: "red"}}>{login.ErrorNameminlength}</p>}
              {login.isDirty && login.isEmpty && <p style={{color: "red"}}>{login.ErrorNameisEmpty}</p>}
              {login.isDirty && login.maxlengthError && <p style={{color: "red"}}>{login.ErrorNamemaxlength}</p>}
            <label htmlFor="">Login</label>
            <input type="text" onBlur={login.onBlur} placeholder='login' value={login.value} onChange={login.onChange}/>
            <label htmlFor="">Password</label>
              {password.isDirty && password.minlengthError && !password.isEmpty && <p style={{color: "red"}}>{password.ErrorNameminlength}</p>}
              {password.isDirty && password.isEmpty && <p style={{color: "red"}}>{password.ErrorNameisEmpty}</p>}
              {password.isDirty && password.maxlengthError && <p style={{color: "red"}}>{password.ErrorNamemaxlength}</p>}
            <input type="password" onBlur={password.onBlur} placeholder='password' value={password.value} onChange={password.onChange}/>
            <label htmlFor="">REPassword</label>
            <input type="password"  placeholder='password' value={rePassword} onChange={(e)=>setRePassword(e.target.value)}/>
            <button disabled={!password.valid || !email.valid || !login.valid} onClick={()=>{
              if(password.value == rePassword){
                dispatch(fetchRegistration({login:login.value,email:email.value,password:password.value}))
              }else{
                setError("Некорректно написан пароль")
              }
          }}>REGISTRATHION</button>
          {error && <p style={{color: "red"}}>{error}</p>}
          </div>
        </>
        }
      </div>
        
    </div>
  )
}


export default LoginForm