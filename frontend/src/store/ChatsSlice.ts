import { ActionReducerMapBuilder, PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IMessage, IUserChat, IUserChatT, IUserChatTSearch } from "../models/IUserChat";
import { fetchCreateChat, fetchFindChat, fetchGetChatMessage, fetchGetUserChats } from "./acthionChat";





type TChats = {
    socketChat : IUserChat[],
    users : IUserChatT,
    getMessage : IMessage[],
    searcChat : IUserChatTSearch[],
    test : any,
    isLoading : boolean,
    usersConnect : string[]
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
            state.users = payload
        },
        addUsersConnect(state,{payload}:PayloadAction<string[]>){
            for(let i=0;i<state.socketChat.length;i++){
                    state.socketChat[i].users.map(user=>{
                        if(payload.includes(user.uuid)){
                            // console.log(true)
                            user.status = true
                        }else{
                            user.status = false
                        }
                        
             })
                
            }
        },
        stateNull(state,{payload}:PayloadAction<any[]>){
            state.searcChat = payload
        },
        addMessage(state,{payload}:PayloadAction<any>){
            state.message.uuid = payload.uuid
            state.message.content = payload.content
        },
        addUsersConnectState(state,{payload}:PayloadAction<string | string[]>){
         if(state.usersConnect.length === 0){
                state.usersConnect.push(...payload)
            } 
        },
        userOnline(state,{payload}:PayloadAction<string>){
            if( !Array.isArray(payload)  && !state.usersConnect.includes(payload)){
                // console.log("online")
                state.usersConnect.push(payload)
            }
        },
        userOffline(state,{payload}:PayloadAction<string>){
            if( state.usersConnect.includes(payload)){
                // console.log("offline")
                // console.log( state.usersConnect.splice(state.usersConnect.indexOf(payload),1))
                state.usersConnect.splice(state.usersConnect.indexOf(payload),1)
            }
        },
       
    },
    extraReducers: (builder:  ActionReducerMapBuilder<TChats>)=>{
        // получение чатов 
        builder.addCase(fetchGetUserChats.fulfilled,(state :TChats,{payload} : PayloadAction<any>)=>{
            // console.log("socketChat",payload.data)
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
            
        })
        .addCase(fetchCreateChat.fulfilled,(state,{payload}:PayloadAction<any>)=>{
            state.newChatid = payload.chat_id
        })
       
    }
})

export const {addUsersChat, addUsersConnect,stateNull, addMessage,addUsersConnectState,userOnline, userOffline} = chatsSlice.actions

export default chatsSlice.reducer