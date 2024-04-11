import { ActionReducerMapBuilder, PayloadAction,  createSlice } from "@reduxjs/toolkit";
import { IUser } from "../models/IUser";
import { fetchLogin, fetchRegistration } from "./acthion";



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
            console.log(action.payload,"payload")
           state.user = action.payload.user
           state.isAuth = true
           state.isLoading = false
           state.error = ""
        }).addCase(fetchRegistration.fulfilled,(state : TAuth,action : PayloadAction<any>)=>{
            state.user = action.payload.user
            state.isAuth = true
            state.isLoading = false
            state.error = ""
        }).addCase(fetchLogin.pending,(state : TAuth,action : PayloadAction<any>)=>{
            state.isLoading = true
            state.error = ""
         }).addCase(fetchLogin.rejected,(state : TAuth,action : PayloadAction<any>)=>{
            state.isLoading = false
            state.error = action.payload
        })
    }
})



export default authSlice.reducer;