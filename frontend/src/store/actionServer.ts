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


  // export const fetchgetUsersServerChat = createAsyncThunk(
  //   'server/fetchgetUsersServerChat',
  //   async (payload: string, thunkAPI) => {
  //     try {
  //       const response = await ServerService.getUsersServerChat(payload)
  //       console.log(response.data,"fetchgetUsersServerChat")
  //       return response.data
  //     } catch (error: any) {
  //       return thunkAPI.rejectWithValue(error?.message)
  //     }
  //   },
  // )
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
  export const fetchgetServersUsers = createAsyncThunk(
    'server/getServersUsers',
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
  export const fetchpostInvitationLinkUser = createAsyncThunk(
    'server/postInvitationLinkUser',
    async (payload:string, thunkAPI) => {
      try {
        const response = await ServerService.postInvitationLinkUser(payload)
        console.log(response.data,"fetchInvitationLinkUser")
        return response.data
      } catch (error: any) {
        return thunkAPI.rejectWithValue(error?.message)
      }
    },
  )