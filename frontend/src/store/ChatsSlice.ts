import { ActionReducerMapBuilder, PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IMessage, IUserChat, IUserChatT } from "../models/IUserChat";
import { fetchFindChat, fetchGetChatMessage, fetchGetUserChats, fetchMedia, fetchTest } from "./acthion";





type TChats = {
    socketChat : IUserChat[],
    users : IUserChatT[],
    getMessage : IMessage[],
    searcChat : IUserChatT[],
    test : any,
    isLoading : boolean
}

const initialState: TChats= {
    socketChat : [],
    users : [],
    getMessage: [],
    searcChat: [],
    test : [],
    isLoading : false
}


const chatsSlice = createSlice({
    name : "chats",
    initialState,
    reducers:{
        addUsersChat(state,{payload}: PayloadAction<any>){
            console.log(payload,"pay")
            state.users = payload
            // state.getMessage =  state.getMessage.map(mes=>{
            //     return ({...mes, avatar: payload.find(userm=>userm.uuid == mes.from_user_id).avatar})
            //    }
            // )
            console.log(state.getMessage,"getMessage")
        },
    },
    extraReducers: (builder:  ActionReducerMapBuilder<TChats>)=>{
        // получение чатов 
        builder.addCase(fetchGetUserChats.fulfilled,(state :TChats,{payload} : PayloadAction<any>)=>{
            state.socketChat = payload.data.data
            state.isLoading = true
        })
        // сообщения
        .addCase(fetchGetChatMessage.fulfilled,(state :TChats,{payload}: PayloadAction<any>)=>{
            console.log(payload,"payMessage")
            state.getMessage = payload.messages
            // поиск чатов
        })
        .addCase(fetchFindChat.fulfilled,(state,{payload}:PayloadAction<any>)=>{
            state.searcChat = payload.users_results
            // для теста
        })
        .addCase(fetchTest.fulfilled,(state,{payload}:PayloadAction<any>)=>{
            state.test = JSON.stringify(payload)
        })
        .addCase(fetchMedia.fulfilled,()=>{
            
        })
    }
})

export const {addUsersChat} = chatsSlice.actions

export default chatsSlice.reducer