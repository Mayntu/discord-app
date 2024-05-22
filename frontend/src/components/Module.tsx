import "../css/module.css"
import { FC, ReactNode } from 'react'
import { useAppSelector } from "../hooks/redux-hoock"

interface ModuleProps{
    newFile? : ()=>{}
    children?: ReactNode
}


const Module:FC<ModuleProps>=({newFile,children})=> {
  // const {children,newFile} = useAppSelector(state=>state.module)


  return (
    <div className="module">
        <div className="module block">
            {children}
            <button onClick={newFile}>Сохранить</button>
        </div>
       
    </div>
  )
}


export default Module