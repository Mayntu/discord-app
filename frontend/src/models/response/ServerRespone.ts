
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