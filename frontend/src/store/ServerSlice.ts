import {  ActionReducerMapBuilder, PayloadAction, createSlice } from "@reduxjs/toolkit";
import { fetchGetServer, fetchGetServerChatRoomMessages, fetchGetServerChatRooms, fetchgetServersUsers } from "./actionServer";



type TServerSlice = {
    serversUser : IServer[],
    serverChatSRooms: IServerChatRoom[],
    serverChatMessages: IServerChatNessage[],
    UserInServer : any[]
}

const initialState: TServerSlice= {
    UserInServer: [],
    serversUser : [],
    serverChatSRooms: [],
    serverChatMessages: [],
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
        })).addCase(fetchgetServersUsers.fulfilled,(state,{payload}: PayloadAction<any>)=>{
            state.UserInServer = payload.users
        })
    }
})


export const {} =  serverSlice.actions

export default  serverSlice.reducer