import { createAsyncThunk } from "@reduxjs/toolkit"
import { ChatService } from "../services/ChatService"


export const fetchGetUserChats = createAsyncThunk(
    'chats/fetchGetUserChats',
    async (_, thunkAPI) => {
      try {
        const response = await ChatService.getChatsUsers()
        console.log(response.data.data,"fetchGetUserChats")
        return  response.data
      } catch (error: any) {
        return thunkAPI.rejectWithValue(error?.message)
      }
    },
  )


  export const fetchGetChatMessage = createAsyncThunk(
    'chats/fetchGetChatMessage',
    async (payload:string, thunkAPI) => {
      try {
        const response = await ChatService.getChatMessage(payload)
        console.log(response.data,"chatMessage")
        return response.data
      } catch (error: any) {
        return thunkAPI.rejectWithValue(error?.message)
      }
    },
  )

  export const fetchFindChat = createAsyncThunk(
    'chats/fetchFindChat',
    async (payload:string, thunkAPI) => {
      try {
        const response = await ChatService.postFindChat(payload)
        console.log(response.data,"findChat")
        return response.data
      } catch (error: any) {
        return thunkAPI.rejectWithValue(error?.message)
      }
    },
  )


  export const fetchCreateChat = createAsyncThunk(
    'chats/fetchFindChat',
    async (payload:string, thunkAPI) => {
      try {
        const response = await ChatService.postCreateChat(payload)
        console.log(response.data,"create")
        return response.data
      } catch (error: any) {
        return thunkAPI.rejectWithValue(error?.message)
      }
    },
  )