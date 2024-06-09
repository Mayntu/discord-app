import { createAsyncThunk } from "@reduxjs/toolkit"
import { IAuthLogin, IAuthRegistration } from "../models/request/AuthRequest"
import { AuthService } from "../services/AuhService"
import { ChatService } from "../services/ChatService"


 export const fetchLogin = createAsyncThunk(
    'auth/fetchlogin',
    async (payload: IAuthLogin, thunkAPI) => {
      try {
        const response = await AuthService.login(payload.login,payload.password)
        console.log(response.data,"login")
        if(response.data.result){
          localStorage.setItem('token',response.data.token)
          return response.data
        }
       
      } catch (error: any) {
        return thunkAPI.rejectWithValue(error?.message)
      }
    },
  )


  export const fetchRegistration = createAsyncThunk(
    'auth/fetchRegistration',
    async (payload: IAuthRegistration, thunkAPI) => {
      try {
        const response = await AuthService.registration(payload.email,payload.login,payload.password)
        console.log(response.data,"fetchRegistration")
        if(response.data.result){
          localStorage.setItem('token',response.data.token)
          console.log(  localStorage.getItem('token'))
        }
        return response.data
      } catch (error: any) {
        return thunkAPI.rejectWithValue(error?.message)
      }
    },
  )



   export const fetchChangeUsersLogin = createAsyncThunk(
    'auth/fetchChangeUsersLogin',
    async (payload:string, thunkAPI) => {
      try {
        const response = await AuthService.postChangeUsersLogin(payload)
        console.log(response.data,"ChangeUsersLogin")
        return response.data
      } catch (error: any) {
        return thunkAPI.rejectWithValue(error?.message)
      }
    },
  )
 



  export const fetchMedia = createAsyncThunk(
    'users/fetchMedia',
    async (payload:any, thunkAPI) => {
      try {
        console.log(payload)
        const response = await ChatService.saveM(payload)
        console.log(response.data,"media")
        return response.data
      } catch (error: any) {
        return thunkAPI.rejectWithValue(error?.message)
      }
    },
  )


  export const fetchUser = createAsyncThunk(
    'users/fetchUser',
    async (_, thunkAPI) => {
      try {
        const response = await AuthService.getUser()
        console.log(response.data,"User")
        return response.data
      } catch (error: any) {
        return thunkAPI.rejectWithValue(error?.message)
      }
    },
  )





export const fetchDeleteUser = createAsyncThunk(
  'users/fetchDeleteUser',
  async (chat_id:string, thunkAPI) => {
    try {
      const response = await ChatService.postDeleteChat(chat_id)
      console.log(response.data,"fetchDeleteUser")
      return response.data
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.message)
    }
  },
)


