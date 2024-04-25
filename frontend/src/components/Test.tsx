import React, { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks/redux-hoock'
import { fetchMedia, fetchTest } from '../store/acthion'
// import avatar from "C:\Users\1\Desktop\homework\diplom\discord-app\media\images\a7ebd92f-4355-4164-b180-49e9a7e244a4.png"
// const module = import.meta.glob("./media/images/a7ebd92f-4355-4164-b180-49e9a7e244a4.png")

const Test=()=> {
  // console.log(module)
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
      formData.append("file",file[0])
      dispatch(fetchMedia(formData))
    }
    //media\images\a7ebd92f-4355-4164-b180-49e9a7e244a4.png
    //C:\Users\1\Desktop\homework\diplom\discord-app\media\images\a7ebd92f-4355-4164-b180-49e9a7e244a4.png
  return (
    <div className='test'>
        Test
        
        {/* <img src={avatar} alt="" /> */}
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