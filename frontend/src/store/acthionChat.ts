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
    async ({chat_id,count}:any, thunkAPI) => {
      try {
        const response = await ChatService.getChatMessage(chat_id,count)
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
    'chats/fetchCreateChat',
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

  export const fetchDeleteChatMessage = createAsyncThunk(
    'chats/fetchDeleteChatMessage',
    async (payload:string, thunkAPI) => {
      try {
        const response = await ChatService.postDeleteChatMessage(payload)
        console.log(response.data,"delete")
        return response.data
      } catch (error: any) {
        return thunkAPI.rejectWithValue(error?.message)
      }
    },
  )


  export const fetchRecognizeAudio = createAsyncThunk(
    'chats/fetchRecognizeAudio ',
    async (payload:string, thunkAPI) => {
      try {
        const response = await ChatService.postRecognizeAudio(payload)
        console.log(response.data,"RecognizeAudio")
        return response.data
      } catch (error: any) {
        return thunkAPI.rejectWithValue(error?.message)
      }
    },
  )


  export const fetchChangeChatMessage = createAsyncThunk(
    'chats/fetchChangeChatMessage',
    async (payload:any, thunkAPI) => {
      try {
        const response = await ChatService.postChangeChatMessage(payload.message_uuid,payload.new_content)
        console.log(response.data,"fetchChangeChatMessage")
        return response.data
      } catch (error: any) {
        return thunkAPI.rejectWithValue(error?.message)
      }
    },
  )

  export const fetchReadMessage = createAsyncThunk(
    'chats/fetchReadMessage',
    async (payload:string, thunkAPI) => {
      try {
        const response = await ChatService.postReadMessage(payload)
        console.log(response.data,"fetchReadMessage")
        return response.data
      } catch (error: any) {
        return thunkAPI.rejectWithValue(error?.message)
      }
    },
  )