import { ActionReducerMapBuilder, PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IUserChat, IUserChatT } from "../models/IUserChat";
import { fetchFindChat, fetchGetChatMessage, fetchGetUserChats, fetchTest } from "./acthion";
import { getChats } from "../hooks/getChat";


type TChats = {
    socketChat : IUserChat[],
    users : IUserChatT,
    getMessage : any,
    searcChat : IUserChatT[],
    test : any
}

const initialState: TChats= {
    socketChat : [],
    users : {} as IUserChatT,
    getMessage: [],
    searcChat: [],
    test : []
}


const chatsSlice = createSlice({
    name : "chats",
    initialState,
    reducers:{
        addUsersChat(state,acthion: PayloadAction<IUserChatT[]>){
            // let userIAm = acthion.payload.find(user => user.is_current == true) 
            // // console.log(userIAm,"noFetch")
            // state.users = userIAm
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
            console.log(payload.data)
            // let s = getChats(payload.data.data)
            state.socketChat = payload.data.data
            // console.log(s)
            if(payload.users){
                state.users = state.socketChat.find(chat=>chat.uuid == payload.users)?.users
            }
            console.log(state.users)
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
        })
    }
})

export const {addUsersChat,addUserInChat} = chatsSlice.actions

export default chatsSlice.reducer