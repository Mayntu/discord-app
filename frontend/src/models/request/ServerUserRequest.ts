

export interface IRoleCreate{
    uuid : string,
    server_uuid: string,
    role_name:string,
    role_color: string,
    permissions : string
}

export interface ICheckUserPermission{
    server_uuid : string,
    permission :string
}

export interface IAddUserRole{
    uuid : string,
    server_uuid: string,
    role_uuid:string
}