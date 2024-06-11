import { AxiosResponse } from "axios";
import $api from "../http";
import { IAddUserRole, ICheckUserPermission, IRoleCreate } from "../models/request/ServerUserRequest";






export class ServerUsersService{

    static async postCreateRole({server_uuid,uuid,role_color,role_name,permissions}:IRoleCreate):Promise<AxiosResponse<IRoleCreate>>{
        return $api.post<any>("api/v1/createRole",{server_uuid,uuid,role_color,role_name,permissions})
    }

    //api/v1/checkUserPermission
    static async postCheckUserPermission({server_uuid,permission}:ICheckUserPermission):Promise<AxiosResponse<ICheckUserPermission>>{
        return $api.post<any>("api/v1/checkUserPermission",{server_uuid,permission})
    }

    //api/v1/getAllPermissions

    static async getAllPermissions():Promise<AxiosResponse<any>>{
        return $api.post<any>("api/v1/getAllPermissions")
    }

    //"api/v1/addUserRole"

    static async postAddUserRole({uuid,server_uuid,role_uuid}:IAddUserRole):Promise<AxiosResponse<IAddUserRole>>{
        return $api.post<any>("api/v1/addUserRole",{uuid,server_uuid,role_uuid})
    }

}