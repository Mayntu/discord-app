import {  ActionReducerMapBuilder, createSlice } from "@reduxjs/toolkit";
import { fetchGetServer, fetchGetServerChatRoomMessages, fetchGetServerChatRooms } from "./acthion";






const serverSlice = createSlice({
    name: "serverSlice",
    initialState:{
        serversUser : [],
        serverChatSRooms: [],
        serverChatMessages: [],
    },
    reducers:{
        
    },
    extraReducers: (builder:  ActionReducerMapBuilder<any>)=>{
        builder.addCase(fetchGetServer.fulfilled,(state,{payload})=>{
            state.serversUser = payload
        }).addCase(fetchGetServerChatRooms.fulfilled,(state,{payload})=>{
            state.serverChatSRooms = payload
        }).addCase(fetchGetServerChatRoomMessages.fulfilled,((state,{payload})=>{
            state.serverChatMessages = payload
        }))
    }
})


export const {} =  serverSlice.actions

export default  serverSlice.reducer