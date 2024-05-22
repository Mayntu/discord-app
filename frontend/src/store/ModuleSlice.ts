import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ReactNode } from "react";

type TModuleSlice={
    isViewModule: boolean
    children?: ReactNode,
    newFile? : ()=>{},
    imageSrc : string
}

const initialState:TModuleSlice ={
    isViewModule : false,
    imageSrc: ""
}


const moduleSlice = createSlice({
    name : "module",
    initialState,
    reducers:{
        isModule(state,{payload}:PayloadAction<TModuleSlice>){
            state.isViewModule = payload.isViewModule
            // state.children = payload.children
            // state.newFile = payload.newFile
            state.imageSrc = payload.imageSrc
        }
    }
})



export const {isModule} = moduleSlice.actions

export default moduleSlice.reducer