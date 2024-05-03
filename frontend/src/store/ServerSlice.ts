import {  ActionReducerMapBuilder, PayloadAction, createSlice } from "@reduxjs/toolkit";
import { fetchGetServer, fetchGetServerChatRoomMessages, fetchGetServerChatRooms } from "./actionServer";



type TChats = {
        serversUser : any[],
        serverChatSRooms: any[],
        serverChatMessages: any[],
}

const initialState: TChats= {
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
        builder.addCase(fetchGetServer.fulfilled,(state,{payload}: PayloadAction<any>)=>{
            state.serversUser = payload
        }).addCase(fetchGetServerChatRooms.fulfilled,(state,{payload}: PayloadAction<any>)=>{
            state.serverChatSRooms = payload
        }).addCase(fetchGetServerChatRoomMessages.fulfilled,((state,{payload}: PayloadAction<any>)=>{
            state.serverChatMessages = payload
        }))
    }
})


export const {} =  serverSlice.actions

export default  serverSlice.reducer