import { ActionReducerMapBuilder, PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IMessage, IUserChat, IUserChatT, IUserChatTSearch } from "../models/IUserChat";
import { fetchCreateChat, fetchFindChat, fetchGetChatMessage, fetchGetUserChats } from "./acthionChat";
import { TmessageBlocks } from "../hooks/useCreateMessageBlock";





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
    message_count: number,
    newMessage: { [key: string]: IMessage[]},
    BlockMessage: TmessageBlocks[]
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
    message_count : 0,
    newMessage: {},
    BlockMessage: []
}


const chatsSlice = createSlice({
    name : "chats",
    initialState,
    reducers:{
        addUsersChat(state,{payload}: PayloadAction<any>){
            state.users = payload
        },addUsersConnect(state,{payload}:PayloadAction<string[]>){
            for(let i=0;i<state.socketChat.length;i++){
                    state.socketChat[i].users.map(user=>{
                        if(payload.includes(user.uuid)){
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
            state.message.from_user_id = payload.blockId
            state.message.media = payload.media
        },
        addUsersConnectState(state,{payload}:PayloadAction<string | string[]>){
         if(state.usersConnect.length === 0){
                state.usersConnect.push(...payload)
            } 
        },userOnline(state,{payload}:PayloadAction<string>){
            if( !Array.isArray(payload)  && !state.usersConnect.includes(payload)){
                state.usersConnect.push(payload)
            }
        },
        userOffline(state,{payload}:PayloadAction<string>){
            if( state.usersConnect.includes(payload)){
                state.usersConnect.splice(state.usersConnect.indexOf(payload),1)
            }
        },addNewMessage(state,{payload}:PayloadAction<any>){
            if(state.newMessage[payload.id]){
                state.newMessage[payload.id].push(payload.ms)
            }else{
                state.newMessage[payload.id] = [payload.ms]
            }
         
        },addNewMessageStatus(state,{payload}:PayloadAction<any>){
                state.newMessage[payload.id].map((item)=>{
                                if(item.has_read == false){
                                    console.log(item.has_read)
                                    item.has_read = true
                                }  
                            })

        },addNewMessagNull(state){
          state.newMessage = {}
        },addNewBlockMessage(state,{payload}:PayloadAction<any>){
            if(payload.array){
                state.BlockMessage = payload.array
            }else{
                state.BlockMessage.push({idBlock:payload.id,userBlock: payload.user})
            }
        },ChangeNewMessage(state,{payload}:PayloadAction<any>){


                state.newMessage[payload.id].map((item)=>{
                    if(item.uuid == payload.uuid){
                        console.log("findm")
                        item.content = payload.content
                    }
                })
               // if(res.payload.result){
              //  const str = messageArray[messageUser.from_user_id].map((item)=>{
              //    if(item.uuid == messageUser.uuid){
              //     console.log("findm")
              //      return {...item,content :newContent}
              //    }
              //    return item
              //    } )          
              //    console.log(str)
              //    messageArray[messageUser.from_user_id] = str
              //    setMessageArray(messageArray)
              //    dispatch(addMessage(""))
              //   }
        }
       
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

export const {addUsersChat, addUsersConnect,stateNull,
                addMessage,addUsersConnectState,userOnline,
                 userOffline,addNewMessage,addNewMessageStatus,
                 addNewMessagNull,addNewBlockMessage,ChangeNewMessage} = chatsSlice.actions

export default chatsSlice.reducer