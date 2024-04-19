import { ActionReducerMapBuilder, PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IUserChat, IUserChatT } from "../models/IUserChat";
import { fetchGetChatMessage, fetchGetUserChats } from "./acthion";
import { getChats } from "../hooks/getChat";

type TChats = {
    socketChat : IUserChat[],
    chatMessages : any,
    users : any,
    getMessage : any
}

const initialState: TChats= {
    socketChat : [],
    chatMessages : [],
    users : [],
    getMessage: []
}


const chatsSlice = createSlice({
    name : "chats",
    initialState,
    reducers:{
        addUsersChat(state,acthion: PayloadAction<IUserChatT[]>){
            let userIAm = acthion.payload.find(user => user.is_current == true) 
            state.users = userIAm
            
        }
    },
    extraReducers: (builder:  ActionReducerMapBuilder<TChats>)=>{
        builder.addCase(fetchGetUserChats.fulfilled,(state : TChats,{payload} : PayloadAction<any>)=>{
            let s = getChats(payload.data)
            state.socketChat = s
            console.log(s)
        }).addCase(fetchGetChatMessage.fulfilled,(state,{payload}: PayloadAction<any>)=>{
            console.log(payload.messages,"pay,mas")
            state.getMessage = payload.messages
        })
    }
})

export const {addUsersChat} = chatsSlice.actions

export default chatsSlice.reducer