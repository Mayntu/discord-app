import { ActionReducerMapBuilder, PayloadAction,  createSlice } from "@reduxjs/toolkit";
import { IUser } from "../models/IUser";
import { fetchUser, fetchLogin, fetchRegistration, fetchChangeUsersLogin } from "./acthion";
import { IAuthResponse } from "../models/response/AuthResponse";



type TAuth= {
    user:  IUser,
    isAuth : boolean,
    isLoading : boolean
    error? : string | null
    
}


const initialState : TAuth= {
    user: {} as IUser,
    isAuth : false,
    isLoading : false,
    error : ""
}




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
    extraReducers:(builder: ActionReducerMapBuilder<TAuth>)=>{
        builder.addCase(fetchLogin.fulfilled,(state : TAuth,action : PayloadAction<any>)=>{
        console.log(action.payload)
           state.user = action.payload
           state.isAuth = action.payload.result
           state.isLoading = false
           state.error = ""
        }).addCase(fetchRegistration.fulfilled,(state : TAuth,action : PayloadAction<any>)=>{
            console.log(action.payload.result)
            state.user = action.payload.user
            state.isAuth = action.payload.result
            state.isLoading = false
            state.error = ""
        }).addCase(fetchLogin.pending,(state : TAuth,action : PayloadAction<any>)=>{
            state.isLoading = true
            state.error = ""
         }).addCase(fetchLogin.rejected,(state : TAuth,action : PayloadAction<any>)=>{
            state.isLoading = false
            state.error = action.payload
        }).addCase(fetchUser.fulfilled,(state : TAuth,action : PayloadAction<IAuthResponse>)=>{
            state.user = action.payload.user_data
            state.isAuth = true
        }).addCase(fetchChangeUsersLogin.fulfilled,(state : TAuth,{payload} : PayloadAction<any>)=>{
            state.isLoading = true;
            state.error = ""
        }).addCase(fetchChangeUsersLogin.pending,(state : TAuth,{payload} : PayloadAction<any>)=>{
            state.isLoading = false;
            state.error = ""
        })
    }
})


export const {setIsAuth,setLoading,setUser} = authSlice.actions

export default authSlice.reducer;