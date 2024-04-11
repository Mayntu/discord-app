import { ActionReducerMapBuilder, PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IUserChat } from "../models/IUserChat";
import { fetchGetUserChats } from "./acthion";

type TChats = {
    chats : IUserChat[]
}

const initialState: TChats= {
    chats: [{
        id:1,
        avatar : "src\assets\sonic.jpg",
        name: "Sonic",
        status : false,
        text : "Hello world",
        messagecount : 0
    },
    {
        id:2,
        avatar : "src\assets\sonic.jpg",
        name: "Amy",
        status : false,
        text : "Hello world",
        messagecount : 0
    },
    {
        id:3,
        avatar : "src\assets\sonic.jpg",
        name: "Blaze",
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