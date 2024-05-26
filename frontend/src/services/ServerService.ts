import { AxiosResponse } from "axios";
import $api from "../http";
import { IcreateServerChat } from "../models/request/ServerRequest";





export class ServerService{

    static async createServer(n:any):Promise<AxiosResponse<any>>{
        return $api.post<any>("api/v1/createServer",n,{headers: {'Content-Type': 'multipart/form-data'}})
    }
    static async getDeleteServer(server_id:string):Promise<AxiosResponse<any>>{
        return $api.post<any>("api/v1/deleteServer",{server_id})
    }

    // / здесь нужно пересмтореть 
    // static async  createServer(server_uuid: string,title: string):Promise<AxiosResponse<any>>{
    //     return $api.post<any>("api/v1/createServer",{title:"ujhuhuhuhuh",file: 'dceec'})
    // }


    static async postChangeServersTitle(uuid:string,title:string):Promise<AxiosResponse<any>>{
        return $api.post<any>("api/v1/changeServersTitle",{server_uuid : uuid,title})
    }

    static async createServerChat(server : IcreateServerChat):Promise<AxiosResponse<any>>{
        return $api.post<any>("api/v1/createServerChat",{uuid:server.uuid_server,title: server.title,file: "."})
    }
    static async getServerChatRooms(server_uuid : string):Promise<AxiosResponse<IServersUsers<IServerChatRoom>>>{
        return $api.post<any>("api/v1/getServerChatRooms",{server_uuid})
    }

    static async postDeleteServerChatRoom(server_id : string,server_chat_room_id: string):Promise<AxiosResponse<any>>{
        console.log(server_id,server_chat_room_id)
        return $api.post<any>("api/v1/deleteServerChatRoom",{server_id,server_chat_room_id})
    }

    static async getServerUsers():Promise<AxiosResponse<IServersUsers<IServer>>>{
        return $api.get<any>("api/v1/getUsersServers")
    }
    static async getServerChatRoomMessages(chat_id: string):Promise<AxiosResponse<IServerChatNessageUser>>{
        return $api.post<any>("api/v1/getServerChatRoomMessages",{chat_id,count:10})
    }

    static async postDeleteServersMessage(server_message_uuid: string):Promise<AxiosResponse<any>>{
        return $api.post<any>("api/v1/deleteServersMessage",{server_message_uuid})
    }


    static async getUsersServerChat(chat_id: string):Promise<AxiosResponse<any>>{
        return $api.post<any>("api/v1/getUsersServerChat",{chat_id})
    }


   static async postInvitationLink(server_uuid: string):Promise<AxiosResponse<any>>{
        return $api.post<any>("api/v1/getInvitationLink",{server_uuid})
    }
    static async postInvitationLinkUser(linkid: string):Promise<AxiosResponse<any>>{
        return $api.get<any>(`invite/${linkid}`)
    }
    static async getServersUsers(server_uuid: string):Promise<AxiosResponse<any>>{
        return $api.post<any>(`api/v1/getServersUsers`,{uuid: server_uuid})
    }


    //api/v1/changeServerMessage
    static async getchangeServerMessage(message_uuid: string,new_content: string):Promise<AxiosResponse<any>>{
        return $api.post<any>(`api/v1/changeServerMessage`,{message_uuid,new_content})
    }
}