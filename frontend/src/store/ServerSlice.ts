import {  ActionReducerMapBuilder, PayloadAction, createSlice } from "@reduxjs/toolkit";
import { fetchGetServer, fetchGetServerChatRoomMessages, fetchGetServerChatRooms, fetchGetServersUsers, fetchgetServerAudioChatRooms } from "./actionServer";
import { fetchGetAllPermissions } from "./acthionServerUser";



type TServerSlice = {
    serversUser : IServer[],
    serverChatSRooms: IServerChatRoom[],
    serverChatMessages: IServerChatNessage[],
    UserInServer : any[]
    serverChatSRoomsVoice : any[],
    permession : string[]
}

const initialState: TServerSlice= {
    UserInServer: [],
    serversUser : [],
    serverChatSRooms: [],
    serverChatMessages: [],
    serverChatSRoomsVoice:[],
    permession: []
    
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
            state.permession= payload
        })
    }
})


export const {} =  serverSlice.actions

export default  serverSlice.reducer