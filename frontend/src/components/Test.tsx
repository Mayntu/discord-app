import React, { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks/redux-hoock'
import { fetchTest } from '../store/acthion'

const Test=()=> {
    const [nValue,setInValue] = useState("")
    const dispatch =useAppDispatch()
    let data = useAppSelector(state=>state.chat.test)

  return (
    <div className='test'>
        Test
        <input type="text" value={nValue} onChange={(e)=>{setInValue(e.target.value)}} />
                                                    {/* если ничего не надо очисти */}
        <button onClick={()=>{dispatch(fetchTest(nValue))}}>запрос</button>
        <p>ОТВЕТ : {data}</p>
    </div>
  )
}



export default Test