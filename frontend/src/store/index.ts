import { configureStore } from "@reduxjs/toolkit";
import AuthSlice from "./AuthSlice";
import ChatsSlice from "./ChatsSlice";




const store = configureStore({
    reducer:{
        auth : AuthSlice,
        chat : ChatsSlice
    }
})


export default store

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch