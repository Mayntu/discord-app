import  { FC, ReactNode } from 'react'
import { useAppDispatch } from '../hooks/redux-hoock'
import { isModule } from '../store/ModuleSlice'


interface ModuleProps{
   
    children?: ReactNode,
   
}


const ModuleTest:FC<ModuleProps>=({children})=> {
    const dispatch = useAppDispatch()
    
  return (
    <div className="module" onClick={(e)=>{
        e.stopPropagation()
        dispatch(isModule(false))
        }}>
          <div className="module-block" onClick={e=>e.stopPropagation()}>
  
              {children}
              
          </div>
         
      </div>
  )
}


export default ModuleTest