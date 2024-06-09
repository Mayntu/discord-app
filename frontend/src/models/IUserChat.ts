export interface IUserChatT  {
    avatar : string,
    login : string,
    status : boolean,
    text? : string,
    messagecount : number,
    uuid : string,
    is_current : boolean
}

export interface IUserChatTSearch  {
    avatar : string,
    login : string,
    uuid : string,
    is_online : boolean,
}

export interface  IUserChat {
    uuid: string;
    users : Array<IUserChatT>
}

export interface IMessage{
    avatar? : string,
    login? : string,
    media : string,
    content: string,
    uuid : string,
    from_user_id: string,
    chat_id : string,
    has_read:boolean,
    timestamp:string
}