import "../css/module.css"
import { FC, ReactNode } from 'react'

interface ModuleProps{
    newFile : ()=>{}
    children?: ReactNode
}


const Module:FC<ModuleProps>=({newFile,children})=> {
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