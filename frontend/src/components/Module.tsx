import  { FC, ReactNode } from 'react'
import { createPortal } from 'react-dom'


interface ModuleProps{
   
    children?: ReactNode,
    isModule: React.Dispatch<React.SetStateAction<boolean>>
}


const ModuleTest:FC<ModuleProps>=({children,isModule})=> {
  
    
  const modal= (
    <div className="module" onClick={(e)=>{
        e.stopPropagation()
        isModule(false)
        }}>
          <div className="module-block" onClick={e=>e.stopPropagation()}>
              {children}
          </div>
         
      </div>
  )
  return  createPortal(modal,document.getElementById("modals")!)
}


export default ModuleTest