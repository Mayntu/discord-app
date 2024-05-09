import { AxiosResponse } from "axios";
import $api from "../http";
import { IcreateServerChat } from "../models/request/ServerRequest";





export class ServerService{

    // static async createServer(n:any):Promise<AxiosResponse<any>>{
    //     return $api.post<any>("api/v1/createServer",n,{headers: {'Content-Type': 'multipart/form-data'}})
    // }
    static async getDeleteServer(server_id:string):Promise<AxiosResponse<any>>{
        return $api.post<any>("api/v1/deleteServer",{server_id})
    }

    // / здесь нужно пересмтореть 
    static async  createServer(server_uuid: string,title: string):Promise<AxiosResponse<any>>{
        return $api.post<any>("api/v1/createServer",{title:"ujhuhuhuhuh",file: 'dceec'})
    }


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

    static async getServer():Promise<AxiosResponse<IServersUsers<IServer>>>{
        return $api.get<any>("api/v1/getUsersServers")
    }
    static async getServerChatRoomMessages(chat_id: string):Promise<AxiosResponse<IServerChatNessageUser>>{
        return $api.post<any>("api/v1/getServerChatRoomMessages",{chat_id})
    }

    static async postDeleteServersMessage(server_message_uuid: string):Promise<AxiosResponse<any>>{
        return $api.post<any>("api/v1/deleteServersMessage",{server_message_uuid})
    }
   
   
}