import { createAsyncThunk } from "@reduxjs/toolkit"
import { ServerUsersService } from "../services/ServerUserService"
import { IAddUserRole, ICheckUserPermission, IRoleCreate } from "../models/request/ServerUserRequest"



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
