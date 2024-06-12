import {  ActionReducerMapBuilder, PayloadAction, createSlice } from "@reduxjs/toolkit";
import { fetchCheckServerUser, fetchGetServer, fetchGetServerChatRoomMessages, fetchGetServerChatRooms, fetchGetServersUsers, fetchgetServerAudioChatRooms } from "./actionServer";
import { fetchGetAllPermissions, fetchPostGetServersMembers, fetchgetServerMembersRolePermissions, fetchgetServersRoles } from "./acthionServerUser";



type TServerSlice = {
    serversUser : IServer[],
    serverChatSRooms: IServerChatRoom[],
    serverChatMessages: IServerChatNessage[],
    UserInServer : any[]
    serverChatSRoomsVoice : any[],
    permession : any,
    ServersRoles : any[],
    userPerm : any,
    userRole: any
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
    userRole: {}
    
}




const serverSlice = createSlice({
    name: "serverSlice",
    initialState,
    reducers:{
        
    },
    extraReducers: (builder:  ActionReducerMapBuilder<any>)=>{
        builder.addCase(fetchGetServer.fulfilled,(state,{payload}: PayloadAction<IServer[]>)=>{
            state.serversUser = payload
        }).addCase(fetchGetServerChatRooms.fulfilled,(state,{payload}: PayloadAction<IServerChatRoom[]>)=>{
            state.serverChatSRooms = payload
        }).addCase(fetchGetServerChatRoomMessages.fulfilled,((state,{payload}: PayloadAction<IServerChatNessage[]>)=>{
            state.serverChatMessages = payload
        })).addCase(fetchGetServersUsers.fulfilled,(state,{payload}: PayloadAction<any>)=>{
            state.UserInServer = payload.users
        }).addCase(fetchgetServerAudioChatRooms.fulfilled,(state,{payload}: PayloadAction<any>)=>{
            state.serverChatSRoomsVoice = payload
        }).addCase(fetchGetAllPermissions.fulfilled,(state,{payload}: PayloadAction<any>)=>{
            console.log(payload.permissions)
            state.permession = payload.permissions
        }).addCase(fetchgetServersRoles.fulfilled,(state,{payload}: PayloadAction<any>)=>{
            console.log(payload,"role")
            state.ServersRoles = payload.server_roles

        }).addCase(fetchgetServerMembersRolePermissions.fulfilled,(state,{payload}: PayloadAction<any>)=>{
            
            if(payload.permissions.length !== 0){
                 let sr = {}
                 for(let i=0;i<payload.permissions.length;i++){
                    sr[payload.permissions[i].key] = payload.permissions[i].is_available
                 }
                 console.log(sr,"sr")
                 state.userPerm = sr
            }
          
            // state.ServersRoles = payload.server_roles

        })
        .addCase(fetchCheckServerUser.fulfilled,(state,{payload}: PayloadAction<any>)=>{
            console.log(payload)
            state.ServersRoles = payload.server_roles

        })
        .addCase(fetchPostGetServersMembers.fulfilled,(state,{payload}: PayloadAction<any>)=>{
            console.log(payload)
            state.UserInServer = payload.users
            // state.ServersRoles = payload.server_roles

        })
    }
})


export const {} =  serverSlice.actions

export default  serverSlice.reducer