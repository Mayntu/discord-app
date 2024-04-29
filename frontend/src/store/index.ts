import { configureStore } from "@reduxjs/toolkit";
import AuthSlice from "./AuthSlice";
import ChatsSlice from "./ChatsSlice";
import { serverApi } from "./RTQServer";




const store = configureStore({
    reducer:{
        auth : AuthSlice,
        chat : ChatsSlice,
        [serverApi.reducerPath]: serverApi.reducer,
    },
    middleware:  (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(serverApi.middleware),
})


export default store

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch