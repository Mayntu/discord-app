import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ReactNode } from "react";

type TModuleSlice={
    isViewModule: boolean
    isViewModuleSetting: boolean,
    children?: ReactNode,
    newFile? : ()=>{},
    isModule?:React.Dispatch<React.SetStateAction<boolean>>,
    imageSrc : string
}

const initialState:TModuleSlice ={
    isViewModule : false,
    isViewModuleSetting: false,
    imageSrc: "",
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
        },
        isModuleSet(state,{payload}:PayloadAction<TModuleSlice>){
            state.isViewModuleSetting = payload.isViewModuleSetting
            state.isModule = payload.isModule
            state.children = payload.children
            state.newFile = payload.newFile
        }
    }
})



export const {isModule} = moduleSlice.actions

export default moduleSlice.reducer