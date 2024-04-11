import { ActionReducerMapBuilder, PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IUserChat } from "../models/IUserChat";
import { fetchGetUserChats } from "./acthion";

type TChats = {
    chats : IUserChat[]
}

const initialState: TChats= {
    chats: [{
        avatar : "src\assets\sonic.jpg",
        name: "Sonic",
        status : false,
        text : "Hello world",
        messagecount : 0
    }]
}


const chatsSlice = createSlice({
    name : "chats",
    initialState,
    reducers:{

    },
    extraReducers: (builder:  ActionReducerMapBuilder<TChats>)=>{
        builder.addCase(fetchGetUserChats.fulfilled,(state : TChats,action : PayloadAction<any>)=>{

        })
    }
})



export default chatsSlice.reducer