import { configureStore } from "@reduxjs/toolkit";
import AuthSlice from "./AuthSlice";
import ChatsSlice from "./ChatsSlice";
import { serverApi } from "./RTQServer";
import ServerSlice from "./ServerSlice";




const store = configureStore({
    reducer:{
        auth : AuthSlice,
        chats : ChatsSlice,
        server : ServerSlice,
        [serverApi.reducerPath]: serverApi.reducer,
    },
    middleware:  (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(serverApi.middleware),
})


export default store

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch