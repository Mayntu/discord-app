import "../css/module.css"
import { FC} from 'react'
import { useAppDispatch, useAppSelector } from "../hooks/redux-hoock"
import { isModule } from "../store/ModuleSlice"




const ModuleImage:FC=()=> {
  const {imageSrc} = useAppSelector(state=>state.module)
  const dispatch = useAppDispatch()

  return (
    <div className="module" onClick={()=>{dispatch(isModule({isViewModule:false,imageSrc:""}))}}>
        <div className="module block">
            <img src={imageSrc}></img>
        </div>
       
    </div>
  )
}


export default ModuleImage