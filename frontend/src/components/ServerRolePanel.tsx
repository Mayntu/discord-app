


import  { FC, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks/redux-hoock'
import { fetchGetAllPermissions } from '../store/acthionServerUser'

const ServerRolePanel:FC=()=> {

    const dispatch = useAppDispatch()
    const permesion = useAppSelector((state)=>{state.server.permession})

    useEffect(()=>{
        dispatch(fetchGetAllPermissions())
        console.log(permesion)
    },[])
    useEffect(()=>{
        console.log(permesion)
    },[permesion])
  return (
    <div className='server-role-panel'>
        {/* {permesion.map} */}
    </div>
  )
}


export default ServerRolePanel