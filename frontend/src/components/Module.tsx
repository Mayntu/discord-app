import "../css/module.css"
import { FC, ReactNode } from 'react'
import { useAppSelector } from "../hooks/redux-hoock"

interface ModuleProps{
    newFile? : ()=>{}
    children?: ReactNode,
    isModule: React.Dispatch<React.SetStateAction<boolean>>
}


const Module:FC<ModuleProps>=({newFile,children,isModule})=> {
  // const {children,newFile} = useAppSelector(state=>state.module)


  return (
    <div className="module" onClick={(e)=>{
      e.stopPropagation()
      isModule(false)
      }}>
        <div className="module-block" onClick={e=>e.stopPropagation()}>

            {children}
            <button onClick={newFile}>Сохранить</button>
        </div>
       
    </div>
  )
}


export default Module