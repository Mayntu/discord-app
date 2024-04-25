import { IUser } from "../IUser"

export interface IAuthResponse{
    result: boolean
    user_data: IUser
}