import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IUser } from "../models/IUser";


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
    extraReducers:(bilder)=>{
        
    }
})



export default authSlice.reducer;