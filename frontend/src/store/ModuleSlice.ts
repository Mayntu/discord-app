import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ReactNode } from "react";

type TModuleSlice={
    isViewModule?: boolean
    isViewModuleSetting: boolean,
    children?: ReactNode,
    newFile? : any,
    isModule?:React.Dispatch<React.SetStateAction<boolean>>,
    imageSrc? : string
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
       
        isModule(state,{payload}:PayloadAction<boolean>){
            state.isViewModuleSetting = payload
        },
        isModuleSet(state,{payload}:PayloadAction<TModuleSlice>){
            state.isViewModuleSetting = payload.isViewModuleSetting
       
            state.children = payload.children
            state.newFile = payload.newFile
        }
    }
})



export const {isModule, isModuleSet} = moduleSlice.actions

export default moduleSlice.reducer