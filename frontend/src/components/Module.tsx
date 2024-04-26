import "../css/module.css"
import { FC } from 'react'

interface ModuleProps{
    newFile : ()=>{}
}


const Module:FC<ModuleProps>=({newFile})=> {
  return (
    <div className="module">
        <div className="module block">
            <button onClick={newFile}>Сохранить</button>
        </div>
       
    </div>
  )
}


export default Module