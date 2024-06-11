

export interface IRoleCreate{
   
    server_uuid: string,
    role_name:string,
    role_color: string,
    permissions : string[]
}

export interface ICheckUserPermission{
    server_uuid : string,
    permission :string
}

export interface IAddUserRole{
    server_uuid: string,
    role_uuid:string,
    user_uuid_to_add:string
}

export interface IAddModerator{
    server_uuid: string,
    user_uuid:string
}

export interface IDeleteRole{
    server_uuid: string,
    role_uuid:string
}