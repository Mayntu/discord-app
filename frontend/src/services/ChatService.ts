import { AxiosResponse } from "axios";
import $api from "../http";



export class ChatService {
    static async getChatsUsers():Promise<AxiosResponse<any>>{
        return $api.get<any>("api/v1/getUsersChats")
    }


    static async getChatMessage(chat_id: string):Promise<AxiosResponse<any>>{
        return $api.post<any>("api/v1/getChatMessages",{chat_id : chat_id})
    }

    static async postFindChat(login : string):Promise<AxiosResponse<any>>{
        return $api.post<any>("api/v1/findUsers",{login})
    }

    static async postCreateChat(uuid : string):Promise<AxiosResponse<any>>{
        return $api.post<any>("api/v1/createChat",{users_ids: uuid})
    }
}
