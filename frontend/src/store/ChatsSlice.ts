import { ActionReducerMapBuilder, PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IMessage, IUserChat, IUserChatT, IUserChatTSearch } from "../models/IUserChat";
import {  fetchMedia, fetchTest } from "./acthion";
import { fetchCreateChat, fetchFindChat, fetchGetChatMessage, fetchGetUserChats } from "./acthionChat";





type TChats = {
    socketChat : IUserChat[],
    users : IUserChatT,
    getMessage : IMessage[],
    searcChat : IUserChatTSearch[],
    test : any,
    isLoading : boolean,
    usersConnect : any[]
    newChatid: string,
    message : IMessage,
    message_count: number
}

const initialState: TChats= {
    socketChat : [],
    users : {} as IUserChatT,
    getMessage: [],
    searcChat: [],
    test : [],
    isLoading : false,
    usersConnect:[],
    newChatid: "",
    message: {} as IMessage,
    message_count : 0
}


const chatsSlice = createSlice({
    name : "chats",
    initialState,
    reducers:{
        addUsersChat(state,{payload}: PayloadAction<any>){
            // console.log(payload,"pay")
            state.users = payload
            // state.getMessage =  state.getMessage.map(mes=>{
            //     return ({...mes, avatar: payload.find(userm=>userm.uuid == mes.from_user_id).avatar})
            //    }
            // )
        },
        addUsersConnect(state,{payload}:PayloadAction<any[]>){
            const n = state.socketChat.map(user=>user.users)
            for(let i=0;i<n.length+1;i++){
                for(let s=0;i<payload.length;i++){
                    const r = n[i].findIndex(user=>{
                        return user.uuid == payload[s]
                    })
                    if(r !== -1){
                        state.socketChat[i].users[r].status =  false
                    }
                }
            }
            // console.log(state.usersConnect)
        },
        stateNull(state,{payload}:PayloadAction<any[]>){
            state.searcChat = payload
        },
        addMessage(state,{payload}:PayloadAction<string>){
            state.message.uuid = payload
        }
    },
    extraReducers: (builder:  ActionReducerMapBuilder<TChats>)=>{
        // получение чатов 
        builder.addCase(fetchGetUserChats.fulfilled,(state :TChats,{payload} : PayloadAction<any>)=>{
            state.socketChat = payload.data
            state.isLoading = true
        })
        // сообщения
        .addCase(fetchGetChatMessage.fulfilled,(state :TChats,{payload}: PayloadAction<any>)=>{
            // console.log(payload,"payMessage")
            state.getMessage = payload.messages
            state.message_count = payload.messages_count

        }) // поиск чатов
        .addCase(fetchFindChat.fulfilled,(state,{payload}:PayloadAction<any>)=>{
            state.searcChat = payload.users_results
            
        })// для теста
        .addCase(fetchTest.fulfilled,(state,{payload}:PayloadAction<any>)=>{
            state.test = JSON.stringify(payload)
        })
        .addCase(fetchCreateChat.fulfilled,(state,{payload}:PayloadAction<any>)=>{
            state.newChatid = payload.chat_id
        })
       
    }
})

export const {addUsersChat, addUsersConnect,stateNull, addMessage} = chatsSlice.actions

export default chatsSlice.reducer