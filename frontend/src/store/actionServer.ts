import { createAsyncThunk } from "@reduxjs/toolkit/react"
import { ServerService } from "../services/ServerService"
import { IDeleteSereverChatRoom, IcreateServerChat } from "../models/request/ServerRequest"


export const fetchCreateServerChat = createAsyncThunk(
    'server/fetchCreateServerChat',
    async (payload : IcreateServerChat, thunkAPI) => {
      try {
        const response = await ServerService.createServerChat(payload)
        console.log(response.data,"fetchCreateServerChat")
        return response.data
      } catch (error: any) {
        return thunkAPI.rejectWithValue(error?.message)
      }
    },
  )
  export const fetchGetServerChatRooms = createAsyncThunk(
    'server/fetchGetServerChatRooms',
    async (payload : string, thunkAPI) => {
      try {
        const response = await ServerService.getServerChatRooms(payload)
        console.log(response.data.data,"fetchGetServerChatRooms")
        return response.data.data
      } catch (error: any) {
        return thunkAPI.rejectWithValue(error?.message)
      }
    },
  )
  
  
  export const fetchGetServer = createAsyncThunk(
    'server/fetchGetServer',
    async (_, thunkAPI) => {
      try {
        const response = await ServerService.getServer()
        console.log(response.data.data ,"fetchGetServer")
        return response.data.data
      } catch (error: any) {
        return thunkAPI.rejectWithValue(error?.message)
      }
    },
  )
  
  
  export const fetchGetServerChatRoomMessages = createAsyncThunk(
    'server/fetchGetServerChatRoomMessages',
    async (payload:string, thunkAPI) => {
      try {
        const response = await ServerService.getServerChatRoomMessages(payload)
        console.log(response.data.server_messages ,"fetchGetServerChatRoomMessages")
        return response.data.server_messages
      } catch (error: any) {
        return thunkAPI.rejectWithValue(error?.message)
      }
    },
  )

  export const fetchCreateServer = createAsyncThunk(
    'server/fetchCreateServer',
    async (n:any, thunkAPI) => {
      try {
        const response = await ServerService.createServer(n)
        console.log(response.data,"createServer")
        return response.data
      } catch (error: any) {
        return thunkAPI.rejectWithValue(error?.message)
      }
    },
  )

  export const fetchDeleteServer = createAsyncThunk(
    'server/fetchDeleteServer',
    async (payload:string, thunkAPI) => {
      try {
        const response = await ServerService.getDeleteServer(payload)
        console.log(response.data,"fetchDeleteServer")
        return response.data
      } catch (error: any) {
        return thunkAPI.rejectWithValue(error?.message)
      }
    },
  )

  export const fetchDeleteServerChatRoom = createAsyncThunk(
    'server/ fetchDeleteServerChatRoom',
    async (payload:IDeleteSereverChatRoom, thunkAPI) => {
      try {
        const response = await ServerService.postDeleteServerChatRoom(payload.server_uuid,payload.server_chat_room_id)
        console.log(response.data,"fetchDeleteServer")
        return response.data
      } catch (error: any) {
        return thunkAPI.rejectWithValue(error?.message)
      }
    },
  )

  export const fetchDeleteServersMessage = createAsyncThunk(
    'server/fetchDeleteServersMessage',
    async (payload:string, thunkAPI) => {
      try {
        const response = await ServerService.postDeleteServersMessage(payload)
        console.log(response.data,"fetchDeleteServer")
        return response.data
      } catch (error: any) {
        return thunkAPI.rejectWithValue(error?.message)
      }
    },
  )

  export const fetchpostChangeServersTitle = createAsyncThunk(
    'server/fetchpostChangeServersTitle',
    async (payload:any, thunkAPI) => {
      try {
        const response = await ServerService.postChangeServersTitle(payload.server_uuid,payload.title)
        console.log(response.data,"fetchDeleteServer")
        return response.data
      } catch (error: any) {
        return thunkAPI.rejectWithValue(error?.message)
      }
    },
  )