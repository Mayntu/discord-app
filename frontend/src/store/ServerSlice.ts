import {  ActionReducerMapBuilder, PayloadAction, createSlice } from "@reduxjs/toolkit";
import { fetchCheckServerUser, fetchGetServer, fetchGetServerChatRoomMessages, fetchGetServerChatRooms, fetchGetServersUsers, fetchgetServerAudioChatRooms } from "./actionServer";
import { fetchGetAllPermissions, fetchPostGetServersMembers, fetchgetServerMembersRolePermissions, fetchgetServersRoles } from "./acthionServerUser";



type TServerSlice = {
    serversUser : IServer[],
    serverChatSRooms: IServerChatRoom[],
    serverChatMessages: IServerChatNessage[],
    UserInServer : TGetServersUsers[]
    serverChatSRoomsVoice : any[],
    permession : any,
    ServersRoles : any[],
    userPerm : any,
    userRole: any,
    serverName :string
    chatName : string
}

const initialState: TServerSlice= {
    UserInServer: [],
    serversUser : [],
    serverChatSRooms: [],
    serverChatMessages: [],
    serverChatSRoomsVoice:[],
    permession: [],
    ServersRoles: [],
    userPerm: {},
    userRole: {},
    serverName : "",
    chatName : ""
    
}




const serverSlice = createSlice({
    name: "serverSlice",
    initialState,
    reducers:{
        online(state,{payload}:PayloadAction<string[]>){
            console.log(payload,"server")
            state.UserInServer.map(i=>{
                if(payload.find(s=>s == i.user_uuid)){
                    console.log("sssssssssss")
                    i.status = true
                }else{
                    i.status = false
                }
            })
        }
    },
    extraReducers: (builder:  ActionReducerMapBuilder<any>)=>{
        builder.addCase(fetchGetServer.fulfilled,(state,{payload}: PayloadAction<IServer[]>)=>{
            state.serversUser = payload
        }).addCase(fetchGetServerChatRooms.fulfilled,(state,{payload}: PayloadAction<IServerChatRoom[]>)=>{
            state.serverChatSRooms = payload
        }).addCase(fetchGetServerChatRoomMessages.fulfilled,((state,{payload}: PayloadAction<IServerChatNessage[]>)=>{
            state.serverChatMessages = payload
        })).addCase(fetchGetServersUsers.fulfilled,(state,{payload}: PayloadAction<TfetchGetServersUsers>)=>{
            console.log(payload.users,"payload.users")
            state.UserInServer = payload.users
        }).addCase(fetchgetServerAudioChatRooms.fulfilled,(state,{payload}: PayloadAction<any>)=>{
            state.serverChatSRoomsVoice = payload
        }).addCase(fetchGetAllPermissions.fulfilled,(state,{payload}: PayloadAction<any>)=>{
         
            state.permession = payload.permissions
        }).addCase(fetchgetServersRoles.fulfilled,(state,{payload}: PayloadAction<any>)=>{
         
            state.ServersRoles = payload.server_roles

        }).addCase(fetchgetServerMembersRolePermissions.fulfilled,(state,{payload}: PayloadAction<TfetchgetServerMembersRolePermissions>)=>{
            if(payload.permissions.length !== 0){
                 let sr:TServeMembersRolePermissions = {} as TServeMembersRolePermissions
                 for(let i=0;i<payload.permissions.length;i++){
                    sr[payload.permissions[i].key] = payload.permissions[i].is_available
                 }
                 state.userPerm = sr
            }
          
  

        })
        .addCase(fetchCheckServerUser.fulfilled,(state,{payload}: PayloadAction<any>)=>{
            state.ServersRoles = payload.server_roles

        })
        .addCase(fetchPostGetServersMembers.fulfilled,(state,{payload}: PayloadAction<TfetchGetServersUsers>)=>{
            console.log(payload.users,"payload.users")
            state.UserInServer = payload.users
        

        })
    }
})


export const {online} =  serverSlice.actions

export default  serverSlice.reducer