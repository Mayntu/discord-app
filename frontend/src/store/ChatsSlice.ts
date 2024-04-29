import { ActionReducerMapBuilder, PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IMessage, IUserChat, IUserChatT } from "../models/IUserChat";
import { fetchFindChat, fetchGetChatMessage, fetchGetUserChats, fetchMedia, fetchTest } from "./acthion";





type TChats = {
    socketChat : IUserChat[],
    users : IUserChatT[],
    getMessage : IMessage[],
    searcChat : IUserChatT[],
    test : any,
    isLoading : boolean,
    usersConnect : any[]
}

const initialState: TChats= {
    socketChat : [],
    users : [],
    getMessage: [],
    searcChat: [],
    test : [],
    isLoading : false,
    usersConnect:[]
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
            // {uuid: '086e6487-4f01-41ff-99a2-f2adf26178df', users: Array(2)} 
            // console.log(state.usersConnect,"connectSlice")
            // const n = state.socketChat.map(user=>user.users)
            // // 
            // for(let i=0;i<n.length;i++){
            //     console.log(2)
            //     for(let s=0;i<payload.length;i++){
            //         const r = n[i].find(user=>user.uuid == payload[s])
            //         if(r){
            //             r.status = !r.status
            //             console.log(r)
            //         }
            //     }
            // }
                
            // state.socketChat[0].users[1].login = "wwwwwwwwww"
            // // state.usersConnect = n
            // console.log(state.usersConnect)
        }
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

export const {addUsersChat, addUsersConnect} = chatsSlice.actions

export default chatsSlice.reducer