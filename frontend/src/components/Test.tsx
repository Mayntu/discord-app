import React, { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks/redux-hoock'
import { fetchMedia, fetchTest } from '../store/acthion'

const Test=()=> {
    const [nValue,setInValue] = useState("")
    const [file,setFile] = useState()
    const dispatch =useAppDispatch()
    let data = useAppSelector(state=>state.chat.test)

    const newFile=()=>{
      console.log(file)
      if(!file){
        alert("please")
        return
      }
      const formData = new FormData()
      formData.append("file",file)
      dispatch(fetchMedia(formData))
    }
  return (
    <div className='test'>
        Test
        <input type="file" accept='image/*,.png,.web,.jpg,.gif' onChange={(e)=>{
          setFile(e.target.files)
       
          }}/>
           <button onClick={()=>{newFile()}}>запрос</button>
        <input type="text" value={nValue} onChange={(e)=>{setInValue(e.target.value)}} />
                                                    {/* если ничего не надо очисти */}
        <button onClick={()=>{dispatch(fetchTest(nValue))}}>запрос</button>
        <p>ОТВЕТ : {data}</p>
    </div>
  )
}



export default Test