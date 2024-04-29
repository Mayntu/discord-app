import { AxiosResponse } from "axios";
import $api from "../http";
import { IcreateServerChat } from "../models/request/AuthRequest";




export class ServerService{

    static async createServer(n:any):Promise<AxiosResponse<any>>{
        return $api.post<any>("api/v1/createServer",n)
    }
    static async createServerChat(server : IcreateServerChat):Promise<AxiosResponse<any>>{
        return $api.post<any>("api/v1/createServerChat",{uuid:server.uuid_server,title: server.title})
    }
    static async getServerChatRooms(server_uuid : string):Promise<AxiosResponse<any>>{
        return $api.post<any>("api/v1/getServerChatRooms",{server_uuid})
    }
}