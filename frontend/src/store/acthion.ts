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
        console.log(response.data)
        localStorage.setItem('token',response.data.token)
        return response.data
      } catch (error: any) {
        return thunkAPI.rejectWithValue(error?.message)
      }
    },
  )


  export const fetchGetUserChats = createAsyncThunk(
    'users/ fetchGetUserChats',
    async (payload, thunkAPI) => {
      try {
        const response = await ChatService.getChatsUsers()
        console.log(response.data)
        return response.data
      } catch (error: any) {
        return thunkAPI.rejectWithValue(error?.message)
      }
    },
  )




