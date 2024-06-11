


import  { FC, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks/redux-hoock'
import { fetchGetAllPermissions } from '../store/acthionServerUser'

const ServerRolePanel:FC=()=> {

    const dispatch = useAppDispatch()
    const {permession}= useAppSelector((state)=>state.server)
    // const {serversUser}= useAppSelector((state)=>{state.server})

    useEffect(()=>{
        dispatch(fetchGetAllPermissions())
        console.log(permession)
    },[])
    useEffect(()=>{
        console.log(permession)
    },[permession])
  return (
    <div className='server-role-panel'>
        {/* {permesion.map} */}
        {permession.map((i)=><p>{i}</p>)}
    </div>
  )
}


export default ServerRolePanel