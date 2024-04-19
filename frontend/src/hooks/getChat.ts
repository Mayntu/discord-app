import { IUserChat, IUserChatT } from "../models/IUserChat"




export const getChats = (chats:any)=>{
   const res =  Object.keys(chats).map((i)=>{
    let obj: IUserChat = {id : i, users : [ {} as IUserChatT ]}
    obj.users = Object.keys(chats[i]).map(el=>{
        return chats[i][el]
    })
    return obj
   })

    return res
}