import { ActionReducerMapBuilder, PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IUserChat, IUserChatT } from "../models/IUserChat";
import { fetchFindChat, fetchGetChatMessage, fetchGetUserChats } from "./acthion";
import { getChats } from "../hooks/getChat";


type TChats = {
    socketChat : IUserChat[],
    users : any,
    getMessage : any,
    searcChat : any,
}

const initialState: TChats= {
    socketChat : [],
    users : "",
    getMessage: [],
    searcChat: []
}


const chatsSlice = createSlice({
    name : "chats",
    initialState,
    reducers:{
        addUsersChat(state,acthion: PayloadAction<IUserChatT[]>){
            let userIAm = acthion.payload.find(user => user.is_current == true) 
            console.log(userIAm,"noFetch")
            state.users = userIAm
        },
        // addUserInChat(state,acthion: PayloadAction<string>){
        //     console.log(state.socketChat)
        //     let userIAm = state.socketChat.find(chat=>chat.id == acthion.payload)
        //     console.log(userIAm,acthion.payload,state.socketChat, "userIem")
        // }
    },
    extraReducers: (builder:  ActionReducerMapBuilder<TChats>)=>{
        builder.addCase(fetchGetUserChats.fulfilled,(state :TChats,{payload} : PayloadAction<any>)=>{
            let s = getChats(payload.data.data)
            state.socketChat = s
            if(payload.users){
                state.users = state.socketChat.find(chat=>chat.id == payload.users)?.users.find(user => user.is_current == true)
            }
        }).addCase(fetchGetChatMessage.fulfilled,(state :TChats,{payload}: PayloadAction<any>)=>{
            // console.log(payload.messages,"pay,mas")
            state.getMessage = payload.messages
        }).addCase(fetchFindChat.fulfilled,(state,{payload}:PayloadAction<any>)=>{
            console.log(payload.users_results,"pay")
            state.searcChat = payload.users_results
        })
    }
})

export const {addUsersChat} = chatsSlice.actions

export default chatsSlice.reducer