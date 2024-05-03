import { AxiosResponse } from "axios";
import $api from "../http";
import { IcreateServerChat } from "../models/request/ServerRequest";





export class ServerService{

    static async createServer(n:any):Promise<AxiosResponse<any>>{
        return $api.post<any>("api/v1/createServer",n)
    }
    static async getDeleteServer(server_id:string):Promise<AxiosResponse<any>>{
        return $api.post<any>("api/v1/deleteServer",{server_id})
    }

    /// здесь нужно пересмтореть 
    // static async postChangeServersAvatar(server_uuid: string,title: string):Promise<AxiosResponse<any>>{
    //     return $api.post<any>("api/v1/changeServersAvatar",{server_uuid,title})
    // }


    static async postChangeServersTitle(uuid:string,title:string):Promise<AxiosResponse<any>>{
        return $api.post<any>("api/v1/changeServersTitle",{server_uuid : uuid,title})
    }

    static async createServerChat(server : IcreateServerChat):Promise<AxiosResponse<any>>{
        return $api.post<any>("api/v1/createServerChat",{uuid:server.uuid_server,title: server.title,file: "."})
    }
    static async getServerChatRooms(server_uuid : string):Promise<AxiosResponse<any>>{
        return $api.post<any>("api/v1/getServerChatRooms",{server_uuid})
    }

    static async postDeleteServerChatRoom(server_uuid : string,server_chat_room_id: string):Promise<AxiosResponse<any>>{
        return $api.post<any>("api/v1/deleteServerChatRoom",{server_uuid,server_chat_room_id})
    }

    static async getServer():Promise<AxiosResponse<any>>{
        return $api.get<any>("api/v1/getUsersServers")
    }
    static async getServerChatRoomMessages(chat_id: string):Promise<AxiosResponse<any>>{
        return $api.post<any>("api/v1/getServerChatRoomMessages",{chat_id})
    }

    static async postDeleteServersMessage(server_message_uuid: string):Promise<AxiosResponse<any>>{
        return $api.post<any>("api/v1/deleteServersMessage",{server_message_uuid})
    }
   
   
}