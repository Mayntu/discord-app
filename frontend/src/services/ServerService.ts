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

    static async postDeleteServersMessage(server_message_uuid: string,server_id:string):Promise<AxiosResponse<any>>{
        return $api.post<any>("api/v1/deleteServersMessage",{server_message_uuid,server_id})
    }


    static async getUsersServerChat(chat_id: string):Promise<AxiosResponse<any>>{
        return $api.post<any>("api/v1/getUsersServerChat",{chat_id})
    }


   static async postInvitationLink(server_uuid: string):Promise<AxiosResponse<any>>{
        return $api.post<any>("api/v1/getInvitationLink",{server_uuid})
    }
 
    static async getServersUsers(server_uuid: string):Promise<AxiosResponse<any>>{
        return $api.post<any>(`api/v1/getServersUsers`,{uuid: server_uuid})
    }


 
    static async getchangeServerMessage(message_uuid: string,new_content: string):Promise<AxiosResponse<any>>{
        return $api.post<any>(`api/v1/changeServerMessage`,{message_uuid,new_content})
    }

    static async postCheckServerUser(server_uuid: string):Promise<AxiosResponse<any>>{
        return $api.post<any>(`api/v1/checkServerUser`,{server_uuid})
    }

   
    static async postDejoinServer(server_uuid: string):Promise<AxiosResponse<any>>{
        return $api.post<any>(`api/v1/dejoinServer`,{server_uuid})
    }


    static async postСhangeServersAvatar(n:any):Promise<AxiosResponse<any>>{
        return $api.post<any>(`api/v1/changeServersAvatar`,n,{headers: {'Content-Type': 'multipart/form-data'}})
    }
  

    
    static async postCreateServerAudioChatRoom(uuid:string,title:string):Promise<AxiosResponse<any>>{
        return $api.post<any>(`api/v1/createServerAudioChatRoom`,{uuid,title})
    }

    static async getServerAudioChatRooms(server_uuid:string):Promise<AxiosResponse<any>>{
        return $api.post<any>(`api/v1/getServerAudioChatRooms`,{server_uuid})
    }
}