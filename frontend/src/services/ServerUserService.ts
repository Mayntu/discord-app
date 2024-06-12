import { AxiosResponse } from "axios";
import $api from "../http";
import { IAddModerator, IAddUserRole, ICheckUserPermission, IDeleteRole, IRoleCreate } from "../models/request/ServerUserRequest";






export class ServerUsersService{

    static async postCreateRole({server_uuid,role_color,role_name,permissions}:IRoleCreate):Promise<AxiosResponse<IRoleCreate>>{
        return $api.post<any>("api/v1/createRole",{server_uuid,role_color,role_name,permissions})
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

    static async postAddUserRole({server_uuid,role_uuid,user_uuid_to_add}:IAddUserRole):Promise<AxiosResponse<IAddUserRole>>{
        return $api.post<any>("api/v1/addUserRole",{server_uuid,role_uuid,user_uuid_to_add})
    }
    //////////////////
    //"api/v1/insertModerator"

    static async postinsertModerator({server_uuid,user_uuid}:IAddModerator):Promise<AxiosResponse<IAddModerator>>{
        return $api.post<any>("api/v1/insertModerator",{server_uuid,user_uuid})
    }
    //api/v1/deleteModerator
    static async postDeleteModerator({server_uuid,user_uuid}:IAddModerator):Promise<AxiosResponse<IAddModerator>>{
        return $api.post<any>("api/v1/deleteModerator",{server_uuid,user_uuid})
    }

    ///api/v1/removeRole
    static async postRemoveRole({server_uuid,user_uuid}:IAddModerator):Promise<AxiosResponse<IAddModerator>>{
        return $api.post<any>("api/v1/removeRole",{server_uuid,user_to_remove_uuid:user_uuid})
    }
    ///api/v1/deleteServerAudioRoom

    static async postDeleteServerAudioRoom(server_id:string,server_audio_chat_room_id:string):Promise<AxiosResponse<any>>{
        return $api.post<any>("api/v1/deleteServerAudioRoom",{server_id,server_audio_chat_room_id})
    }

    //api/v1/getServersMembers

    static async postGetServersMembers(uuid:string):Promise<AxiosResponse<any>>{
        return $api.post<any>("api/v1/getServersMembers",{uuid})
    }

    ///api/v1/deleteRole

    static async postDeleteRole({server_uuid,role_uuid}:IDeleteRole):Promise<AxiosResponse<IDeleteRole>>{
        return $api.post<any>("api/v1/deleteRole",{server_uuid,role_uuid})
    }
        //api/v1/getServersRoles
        static async getServersRoles(server_uuid:string):Promise<AxiosResponse<any>>{
            return $api.post<any>("api/v1/getServersRoles",{server_uuid})
        }

      //api/v1/getServerMembersRolePermissionsIsAvailable
      static async getServerMembersRolePermissionsIsAvailable(server_uuid:string):Promise<AxiosResponse<any>>{
        return $api.post<any>("api/v1/getServerMembersRolePermissionsIsAvailable",{server_uuid})
    }    
}  
