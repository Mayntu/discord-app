
interface IServer{
    avatar: string,
    chat_rooms: string[],
    owner_id :string,
    title: string  , 
    uuid: string
}

interface IServersUsers<T> {
    data : T[]
}

interface IServerChatRoom{
    title : string,
    uuid:string
}
interface IServerChatNessageUser{
    server_messages : IServerChatNessage[]
}
interface IServerChatNessage{
    content:  string,
    from_user_id : string,
    media: string,
    timestamp : string,
    uuid: string
}


type TServeMembersRolePermissions = {
    CREATE_CHAT : boolean;
    CREATE_PRIVATE_CHAT:boolean;
    CREATE_ROLE : boolean;
    DELETE: boolean;
    DELETE_MSGS: boolean;
    DELETE_USER: boolean
    INVITE_USER: boolean
    REAVTR: boolean
    RENAME: boolean
    SEE_PRIVATE: boolean

}


///permissions

type  permissions={
    key : keyof TServeMembersRolePermissions;
    is_available : boolean
}
type TfetchgetServerMembersRolePermissions = {
    permissions :Array<permissions>
    result : boolean
}

//[key in keyof typeof SampleEnum]: string

type role={
    color: string,
    name : string,
    uuid: string

}
type TGetServersUsers={
    uuid : string,
    user_uuid: string,
    name : string
    permissions : any[],
    role: role,
    avatar: string
    status: boolean
}

type TfetchGetServersUsers = {
    users: Array<TGetServersUsers>
    result: boolean
}