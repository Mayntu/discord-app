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
        const response = await ServerService.getServerUsers()
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
        const response = await ServerService.postDeleteServerChatRoom(payload.server_id,payload.server_chat_room_id)
        console.log(response.data,"fetchDeleteServerChatRoom")
        return response.data
      } catch (error: any) {
        return thunkAPI.rejectWithValue(error?.message)
      }
    },
  )

  export const fetchDeleteServersMessage = createAsyncThunk(
    'server/fetchDeleteServersMessage',
    async (payload:any, thunkAPI) => {
      try {
        const response = await ServerService.postDeleteServersMessage(payload.ms,payload.server)
        console.log(response.data,"fetchDeleteServer")
        return response.data
      } catch (error: any) {
        return thunkAPI.rejectWithValue(error?.message)
      }
    },
  )

  export const fetchGetchangeServerMessage = createAsyncThunk(
    'server/fetchgetchangeServerMessage',
    async ({message_uuid,new_content}:any, thunkAPI) => {
      try {
        const response = await ServerService.getchangeServerMessage(message_uuid,new_content)
        console.log(response.data,"fetchgetchangeServerMessage")
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
        console.log(response.data,"fetchpostChangeServersTitle")
        return response.data
      } catch (error: any) {
        return thunkAPI.rejectWithValue(error?.message)
      }
    },
  )


  export const fetchpostInvitationLink = createAsyncThunk(
    'server/fetchpostInvitationLink',
    async (payload:string, thunkAPI) => {
      try {
        const response = await ServerService.postInvitationLink(payload)
        console.log(response.data,"fetchInvitationLink")
        return response.data
      } catch (error: any) {
        return thunkAPI.rejectWithValue(error?.message)
      }
    },
  )
  export const fetchGetServersUsers = createAsyncThunk(
    'server/fetchGetServersUsers',
    async (payload:string, thunkAPI) => {
      try {
        const response = await ServerService.getServersUsers(payload)
        console.log(response.data,"fetchgetServersUsers")
        return response.data
      } catch (error: any) {
        return thunkAPI.rejectWithValue(error?.message)
      }
    },
  )

  export const fetchCheckServerUser = createAsyncThunk(
    'server/fetchCheckServerUser',
    async (payload:string, thunkAPI) => {
      try {
        const response = await ServerService.postCheckServerUser(payload)
        console.log(response.data,"fetchCheckServerUser")
        return response.data
      } catch (error: any) {
        return thunkAPI.rejectWithValue(error?.message)
      }
    },
  )


  export const fetchDejoinServer = createAsyncThunk(
    'server/fetchDejoinServer',
    async (payload:string, thunkAPI) => {
      try {
        const response = await ServerService.postDejoinServer(payload)
        console.log(response.data,"fetchDejoinServer")
        return response.data
      } catch (error: any) {
        return thunkAPI.rejectWithValue(error?.message)
      }
    },
  )

  export const fetchСhangeServersAvatar = createAsyncThunk(
    'server/fetchСhangeServersAvatar',
    async (payload:any, thunkAPI) => {
      try {
        const response = await ServerService.postСhangeServersAvatar(payload)
        console.log(response.data,"fetchpostСhangeServersAvata")
        return response.data
      } catch (error: any) {
        return thunkAPI.rejectWithValue(error?.message)
      }
    },
  )

 


  export const fetchCreateServerAudioChatRoom = createAsyncThunk(
    'server/fetchCreateServerAudioChatRoom',
    async (payload:any, thunkAPI) => {
      try {
        const response = await ServerService.postCreateServerAudioChatRoom(payload.uuid,payload.title)
        console.log(response.data,"fetchCreateServerAudioChatRoom")
        return response.data
      } catch (error: any) {
        return thunkAPI.rejectWithValue(error?.message)
      }
    },
  )


  export const fetchgetServerAudioChatRooms = createAsyncThunk(
    'server/fetchgetServerAudioChatRooms',
    async (payload:string, thunkAPI) => {
      try {
        const response = await ServerService.getServerAudioChatRooms(payload)
        console.log(response.data,"fetchgetServerAudioChatRooms")
        return response.data.data
      } catch (error: any) {
        return thunkAPI.rejectWithValue(error?.message)
      }
    },
  )