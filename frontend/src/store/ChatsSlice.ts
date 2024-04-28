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
        addUsersChat(state,{payload}: PayloadAction<IUserChatT[]>){
            let userIAm = payload
            // console.log(userIAm,"noFetch")
            state.users = userIAm
        },
        addUserInChat(state,{payload}: PayloadAction<string>){
            // console.log(state.socketChat)
            let userIAm = state.socketChat.find(chat=>chat.uuid == payload)
            // console.log(userIAm,acthion.payload,state.socketChat, "userIem")
        },
        addMessage(state,{payload}: PayloadAction<any>){
          state.getMessage =  state.getMessage.map(mes=>{
                    const user = payload.find(userm=>userm.uuid == mes.from_user_id)
                    console.log(user,"userM")
                    console.log({...mes, avatar: user.avatar})
                    return ({...mes, avatar: user.avatar})
                   }
            )
            console.log(state.getMessage,"getMessage")
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

export const {addUsersChat,addUserInChat,addMessage} = chatsSlice.actions

export default chatsSlice.reducer