import { configureStore } from "@reduxjs/toolkit";
import AuthSlice from "./AuthSlice";
import ChatsSlice from "./ChatsSlice";
import ServerSlice from "./ServerSlice";
import ModuleSlice from "./ModuleSlice";




const store = configureStore({
    reducer:{
        auth : AuthSlice,
        chats : ChatsSlice,
        server : ServerSlice,
        module : ModuleSlice
    },
})


export default store

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch