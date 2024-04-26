import { configureStore } from "@reduxjs/toolkit";
import AuthSlice from "./AuthSlice";
import ChatsSlice from "./ChatsSlice";
import { chatApi } from "./RTQChat";




const store = configureStore({
    reducer:{
        auth : AuthSlice,
        chat : ChatsSlice,
        [chatApi.reducerPath]: chatApi.reducer,
    },
    middleware:  (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(chatApi.middleware),
})


export default store

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch