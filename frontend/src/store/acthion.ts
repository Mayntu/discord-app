import { createAsyncThunk } from "@reduxjs/toolkit"
import { IAuthLogin, IAuthRegistration } from "../models/request/AuthRequest"
import { AuthService } from "../services/AuhService"
import { ChatService } from "../services/ChatService"


 export const fetchLogin = createAsyncThunk(
    'users/fetchlogin',
    async (payload: IAuthLogin, thunkAPI) => {
      try {
        const response = await AuthService.login(payload.login,payload.password)
        console.log(response.data,"login")
        localStorage.setItem('token',response.data.token)
        return response.data
      } catch (error: any) {
        return thunkAPI.rejectWithValue(error?.message)
      }
    },
  )

  export const fetchRegistration = createAsyncThunk(
    'users/fetchRegistration',
    async (payload: IAuthRegistration, thunkAPI) => {
      try {
        const response = await AuthService.registration(payload.email,payload.login,payload.password)
        console.log(response.data,"fetchRegistration")
        localStorage.setItem('token',response.data.token)
        return response.data
      } catch (error: any) {
        return thunkAPI.rejectWithValue(error?.message)
      }
    },
  )


  export const fetchGetUserChats = createAsyncThunk(
    'users/fetchGetUserChats',
    async (payload: string, thunkAPI) => {
      try {
        const response = await ChatService.getChatsUsers()
        console.log(response.data,"fetchGetUserChats")
        if(payload){
          return {data: response.data,users : payload }
        }else{
          return {data:response.data}
        }
      
      } catch (error: any) {
        return thunkAPI.rejectWithValue(error?.message)
      }
    },
  )

  
  export const fetchGetChatMessage = createAsyncThunk(
    'users/fetchGetChatMessage',
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
    'users/fetchFindChat',
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
    'users/fetchFindChat',
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


