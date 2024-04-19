export interface IUserChatT  {
    avatar : string,
    login : string,
    status : boolean,
    text? : string,
    messagecount : number,
    uuid : string,
    is_current : boolean
}


export interface  IUserChat {
    id: string;
    users : Array<IUserChatT>
 
}