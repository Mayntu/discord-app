import { createAsyncThunk } from "@reduxjs/toolkit"
import { IAuthLogin, IAuthRegistration } from "../models/request/AuthRequest"
import { AuthService } from "../services/AuhService"


 export const fetchLogin = createAsyncThunk(
    'users/fetchlogin',
    async (payload: IAuthLogin, thunkAPI) => {
      try {
        const response = await AuthService.login(payload.login,payload.password)
        console.log(response.data)
        localStorage.setItem('token',response.data.accessToken)

      } catch (error: any) {
        return thunkAPI.rejectWithValue(error?.message)
      }
    },
  )

  export const fetchRegistration = createAsyncThunk(
    'users/fetchRegistration',
    async (payload: IAuthRegistration, thunkAPI) => {
      try {
        console.log(payload)
        const response = await AuthService.registration(payload.email,payload.login,payload.password)
        console.log(response.data)
        localStorage.setItem('token',response.data.accessToken)

      } catch (error: any) {
        return thunkAPI.rejectWithValue(error?.message)
      }
    },
  )




