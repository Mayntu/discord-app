import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IUser } from "../models/IUser";
import { IAuthLogin } from "../models/request/AuthRequest";
import { AuthService } from "../services/AuhService";


type TAuth= {
    user:  IUser,
    isAuth : boolean,
    isLoading : boolean

}


const initialState : TAuth= {
    user: {} as IUser,
    isAuth : false,
    isLoading : false
}

const fetchLogin = createAsyncThunk(
    'users/fetchlogin',
    async (payload: IAuthLogin, thunkAPI) => {
      try {
        const response = await AuthService.login(payload.email,payload.password)
        console.log(response.data)
        localStorage.setItem('token',response.data.accessToken)

      } catch (error: any) {
        return thunkAPI.rejectWithValue(error?.message)
      }
    },
  )

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers:{
        setUser(state,{payload}:PayloadAction<IUser>){
            state.user = payload
        },
        setIsAuth(state,{payload}:PayloadAction<boolean>){
            state.isAuth = payload
        },
        setLoading(state,{payload}:PayloadAction<boolean>){
            state.isLoading = payload
        }
    },
    extraReducers:(builder)=>{
        builder.addCase(fetchLogin.fulfilled,(state,action)=>{
           
        })
    }
})



export default authSlice.reducer;