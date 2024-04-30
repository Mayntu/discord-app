import { createAsyncThunk } from "@reduxjs/toolkit"
import { IAuthLogin, IAuthRegistration, IcreateServerChat } from "../models/request/AuthRequest"
import { AuthService } from "../services/AuhService"
import { ChatService } from "../services/ChatService"
import { ServerService } from "../services/ServerService"


 export const fetchLogin = createAsyncThunk(
    'auth/fetchlogin',
    async (payload: IAuthLogin, thunkAPI) => {
      try {
        const response = await AuthService.login(payload.login,payload.password)
        console.log(response.data,"login")
        localStorage.setItem('token',response.data.token)
        return response.data
      } catch (error: any) {
        return thunkAPI.rejectWithValue(error?.message)
      }
    },
  )


  export const fetchRegistration = createAsyncThunk(
    'auth/fetchRegistration',
    async (payload: IAuthRegistration, thunkAPI) => {
      try {
        const response = await AuthService.registration(payload.email,payload.login,payload.password)
        console.log(response.data,"fetchRegistration")
        localStorage.setItem('token',response.data.token)
        return response.data
      } catch (error: any) {
        return thunkAPI.rejectWithValue(error?.message)
      }
    },
  )


  export const fetchGetUserChats = createAsyncThunk(
    'chats/fetchGetUserChats',
    async (payload: string, thunkAPI) => {
      try {
        const response = await ChatService.getChatsUsers()
        console.log(response.data.data,"fetchGetUserChats")
        if(payload){
          return {data: response.data,users : payload }
        }else{
          return {data:response.data}
        }
      
      } catch (error: any) {
        return thunkAPI.rejectWithValue(error?.message)
      }
    },
  )

   export const fetchChangeUsersLogin = createAsyncThunk(
    'auth/fetchChangeUsersLogin',
    async (payload:string, thunkAPI) => {
      try {
        const response = await AuthService.postChangeUsersLogin(payload)
        console.log(response.data,"ChangeUsersLogin")
        return response.data
      } catch (error: any) {
        return thunkAPI.rejectWithValue(error?.message)
      }
    },
  )
  export const fetchGetChatMessage = createAsyncThunk(
    'chats/fetchGetChatMessage',
    async (payload:string, thunkAPI) => {
      try {
        const response = await ChatService.getChatMessage(payload)
        console.log(response.data,"chatMessage")
        return response.data
      } catch (error: any) {
        return thunkAPI.rejectWithValue(error?.message)
      }
    },
  )

  export const fetchFindChat = createAsyncThunk(
    'chats/fetchFindChat',
    async (payload:string, thunkAPI) => {
      try {
        const response = await ChatService.postFindChat(payload)
        console.log(response.data,"findChat")
        return response.data
      } catch (error: any) {
        return thunkAPI.rejectWithValue(error?.message)
      }
    },
  )


  export const fetchCreateChat = createAsyncThunk(
    'chats/fetchFindChat',
    async (payload:string, thunkAPI) => {
      try {
        const response = await ChatService.postCreateChat(payload)
        console.log(response.data,"create")
        return response.data
      } catch (error: any) {
        return thunkAPI.rejectWithValue(error?.message)
      }
    },
  )

  export const fetchTest = createAsyncThunk(
    'users/fetchTest',
    async (payload:string, thunkAPI) => {
      try {
        const response = await ChatService.test(payload)
        console.log(response.data,"test")
        return response.data
      } catch (error: any) {
        return thunkAPI.rejectWithValue(error?.message)
      }
    },
  )


  export const fetchMedia = createAsyncThunk(
    'users/fetchMedia',
    async (payload:any, thunkAPI) => {
      try {
        console.log(payload)
        const response = await ChatService.saveM(payload)
        console.log(response.data,"media")
        return response.data
      } catch (error: any) {
        return thunkAPI.rejectWithValue(error?.message)
      }
    },
  )

  export const fetchUser = createAsyncThunk(
    'users/fetchUser',
    async (_, thunkAPI) => {
      try {
        const response = await AuthService.getUser()
        console.log(response.data,"User")
        return response.data
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



export const fetchDeleteUser = createAsyncThunk(
  'server/fetchDeleteUser',
  async (chat_id:string, thunkAPI) => {
    try {
      const response = await ChatService.postDeleteChat(chat_id)
      console.log(response.data,"fetchDeleteUser")
      return response.data
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.message)
    }
  },
)

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
      console.log(response.data,"fetchGetServerChatRooms")
      return response.data
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
      // console.log(response.data.data ,"fetchGetServer")
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
