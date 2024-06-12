


import  { FC, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks/redux-hoock'
import { fetchGetAllPermissions, fetchPostAddUserRole, fetchPostCreateRole, fetchPostDeleteRole, fetchPostinsertModerator, fetchgetServersRoles } from '../store/acthionServerUser'
import "../css/serverRole.css"
import { useParams } from 'react-router-dom'
const ServerRolePanel:FC=()=> {
    const {serverid}= useParams()
    const dispatch = useAppDispatch()
    const {permession}= useAppSelector((state)=>state.server)
    const {ServersRoles}= useAppSelector((state)=>state.server)
    const [changePermession,setChangePermession]= useState<string[]>([])
    // const {serversUser}= useAppSelector((state)=>{state.server})

    useEffect(()=>{
      if(serverid){
        dispatch(fetchGetAllPermissions())
      
        console.log(permession)
      }
      

      
       
    },[])
    
    useEffect(()=>{
        console.log(permession)
    },[permession])
  return (
    <div className='server-role-panel'>
      <div className="setting-block-panel">
        <div className="btn-server-psnel">
          <p>Переименовать сервер</p>
        </div>
        <div className="btn-server-psnel">
          <p>Сменить аватарку</p>
        </div>
        <div className="btn-server-psnel red">
          <p>Удалить сервер</p>
        </div>
        <div className="btn-server-psnel invite">
          <p>Пригласить новых пользователей</p>
        </div>
      </div>
      
      <div className="setting-block-panel-role">
          <p className='tit'>Создание роли</p>
          <input type="text" placeholder='Наименование для роли' />
          <div className="color-role">
            <input type="color" />
            <p>Цвет роли</p>
          </div>


          <p className='tit2'>Список возмжностей сервера</p>

          <div className="block-panel-role">
           
              {permession.map(i=>(
               <div className="role-block" key={i.key}>
              <p>
                {i.description}
              </p>
              <div className="container">
              <input type="checkbox" id="toggle-button" className="toggle-button"/>
              <label htmlFor="toggle-button" className="text"></label>
            </div>
              </div>
              ))}
           
             
          </div>
          <div className="btn-server-psnel">
          <p>создать роль</p>
        </div>
      </div>
        {/* {permesion.map} */}
        {/* <input type="checkbox"></input>
        <input type="radio"></input>
        <button onClick={()=>{dispatch(fetchPostinsertModerator({server_uuid:serverid,user_uuid:"031961a8-223b-47c0-86f1-5e1ae2b63acb"}))}}>Создать модератора</button>
        <button onClick={()=>{serverid && dispatch(fetchPostCreateRole({server_uuid:serverid,role_color:"blue",role_name:"sonic",permissions:["DELETE_MSGS"]}))}}></button>
        {permession.map((i)=><p key={i.key}>{i.key}</p>)}
        {ServersRoles.map((i)=><p key={i.uuid}>{i.name} 
        <button onClick={()=>{dispatch(fetchPostDeleteRole({server_uuid:serverid,role_uuid:i.uuid}))}}>удалить
        </button> */}
        {/* 45e20e79-50d3-4252-81b3-8f49af9a8b50 */}
      {/* user_uuid
 */}
        {/* <button onClick={()=>{dispatch(fetchPostAddUserRole({user_uuid_to_add:"031961a8-223b-47c0-86f1-5e1ae2b63acb",role_uuid:i.uuid,server_uuid:serverid}))}}> дать роль</button></p>)} */}



    </div>
  )
}


export default ServerRolePanel