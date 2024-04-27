import { ActionReducerMapBuilder, PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IUserChat, IUserChatT } from "../models/IUserChat";
import { fetchFindChat, fetchGetChatMessage, fetchGetUserChats, fetchMedia, fetchTest } from "./acthion";





type TChats = {
    socketChat : IUserChat[],
    users : IUserChatT[],
    getMessage : any,
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
        addUsersChat(state,acthion: PayloadAction<IUserChatT[]>){
            let userIAm = acthion.payload
            // console.log(userIAm,"noFetch")
            state.users = userIAm
        },
        addUserInChat(state,acthion: PayloadAction<string>){
            // console.log(state.socketChat)
            let userIAm = state.socketChat.find(chat=>chat.uuid == acthion.payload)
            // console.log(userIAm,acthion.payload,state.socketChat, "userIem")
        }
    },
    extraReducers: (builder:  ActionReducerMapBuilder<TChats>)=>{
        // получение чатов 
        builder.addCase(fetchGetUserChats.fulfilled,(state :TChats,{payload} : PayloadAction<any>)=>{
            state.socketChat = payload.data.data
            if(payload.users){
               state.users = state.socketChat.find(chat=>chat.uuid == payload.users).users
            }
            console.log(state.users)
            state.isLoading = true
        })
        // сообщения
        .addCase(fetchGetChatMessage.fulfilled,(state :TChats,{payload}: PayloadAction<any>)=>{
            state.getMessage = payload.messages
        }).addCase(fetchFindChat.fulfilled,(state,{payload}:PayloadAction<any>)=>{
            // console.log(payload.users_results,"pay")
            state.searcChat = payload.users_results
        }).addCase(fetchTest.fulfilled,(state,{payload}:PayloadAction<any>)=>{
            // console.log(payload.users_results,"pay")
            state.test = JSON.stringify(payload)
        }).addCase(fetchMedia.fulfilled,()=>{
            
        })
    }
})

export const {addUsersChat,addUserInChat} = chatsSlice.actions

export default chatsSlice.reducer