import { createAsyncThunk } from "@reduxjs/toolkit"
import { ServerUsersService } from "../services/ServerUserService"
import { IAddModerator, IAddUserRole, ICheckUserPermission, IDeleteRole, IRoleCreate } from "../models/request/ServerUserRequest"



export const fetchGetAllPermissions = createAsyncThunk(
    'server/fetchgetAllPermissions',
    async (_, thunkAPI) => {
      try {
        const response = await  ServerUsersService.getAllPermissions()
        console.log(response.data,"fetchGetAllPermissions")
        return response.data
      } catch (error: any) {
        return thunkAPI.rejectWithValue(error?.message)
      }
    },
  )

  export const fetchPostCreateRole = createAsyncThunk(
    'server/fetchPostCreateRole',
    async (payload:IRoleCreate, thunkAPI) => {
      try {
        const response = await  ServerUsersService.postCreateRole(payload)
        console.log(response.data,"fetchPostCreateRole")
        return response.data
      } catch (error: any) {
        return thunkAPI.rejectWithValue(error?.message)
      }
    },
  )

  export const fetchPostCheckUserPermission = createAsyncThunk(
    'server/fetchPostCheckUserPermission',
    async (payload:ICheckUserPermission, thunkAPI) => {
      try {
        const response = await  ServerUsersService.postCheckUserPermission(payload)
        console.log(response.data,"fetchPostCheckUserPermission")
        return response.data
      } catch (error: any) {
        return thunkAPI.rejectWithValue(error?.message)
      }
    },
  )

  export const fetchPostAddUserRole = createAsyncThunk(
    'server/fetchPostAddUserRole',
    async (payload:IAddUserRole, thunkAPI) => {
      try {
        const response = await  ServerUsersService.postAddUserRole(payload)
        console.log(response.data,"fetchPostAddUserRole")
        return response.data
      } catch (error: any) {
        return thunkAPI.rejectWithValue(error?.message)
      }
    },
  )

  //postinsertModerator


  export const fetchPostinsertModerator = createAsyncThunk(
    'server/fetchPostinsertModerator',
    async (payload:IAddModerator, thunkAPI) => {
      try {
        const response = await  ServerUsersService.postinsertModerator(payload)
        console.log(response.data,"fetchPostinsertModerator")
        return response.data
      } catch (error: any) {
        return thunkAPI.rejectWithValue(error?.message)
      }
    },
  )

  export const fetchPostDeleteModerator = createAsyncThunk(
    'server/fetchPostDeleteModerator',
    async (payload:IAddModerator, thunkAPI) => {
      try {
        const response = await  ServerUsersService.postDeleteModerator(payload)
        console.log(response.data,"fetchPostDeleteModerator")
        return response.data
      } catch (error: any) {
        return thunkAPI.rejectWithValue(error?.message)
      }
    },
  )


  
  export const fetchPostRemoveRole = createAsyncThunk(
    'server/fetchPostRemoveRole',
    async (payload:IAddModerator, thunkAPI) => {
      try {
        const response = await  ServerUsersService.postRemoveRole(payload)
        console.log(response.data,"etchPostRemoveRole")
        return response.data
      } catch (error: any) {
        return thunkAPI.rejectWithValue(error?.message)
      }
    },
  )


  export const fetchPostDeleteServerAudioRoom = createAsyncThunk(
    'server/fetchPostDeleteServerAudioRoom ',
    async (payload:any, thunkAPI) => {
      try {
        const response = await  ServerUsersService.postDeleteServerAudioRoom(payload.server_id,payload.server_audio_chat_room_id)
        console.log(response.data,"fetchPostDeleteServerAudioRoom ")
        return response.data
      } catch (error: any) {
        return thunkAPI.rejectWithValue(error?.message)
      }
    },
  )


  export const fetchPostGetServersMembers = createAsyncThunk(
    'server/fetchPostGetServersMembers ',
    async (payload:string, thunkAPI) => {
      try {
        const response = await  ServerUsersService.postGetServersMembers(payload)
        console.log(response.data,"fetchPostGetServersMembers ")
        return response.data
      } catch (error: any) {
        return thunkAPI.rejectWithValue(error?.message)
      }
    },
  )

  export const fetchPostDeleteRole = createAsyncThunk(
    'server/fetchPostDeleteRole',
    async (payload:IDeleteRole, thunkAPI) => {
      try {
        const response = await  ServerUsersService.postDeleteRole(payload)
        console.log(response.data,"v ")
        return response.data
      } catch (error: any) {
        return thunkAPI.rejectWithValue(error?.message)
      }
    },
  )
//getServersRoles


export const fetchgetServersRoles = createAsyncThunk(
  'server/fetchgetServersRoles',
  async (payload:string, thunkAPI) => {
    try {
      const response = await  ServerUsersService.getServersRoles(payload)
      console.log(response.data,"fetchgetServersRoles")
      return response.data
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.message)
    }
  },
)

//getServerMembersRolePermissionsIsAvailable

export const fetchgetServerMembersRolePermissions = createAsyncThunk(
  'server/fetchgetServerMembersRolePermissions',
  async (payload:string, thunkAPI) => {
    try {
      const response = await  ServerUsersService.getServerMembersRolePermissionsIsAvailable(payload)
      console.log(response.data,"fetchgetServerMembersRolePermissions")
      return response.data
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.message)
    }
  },
)
