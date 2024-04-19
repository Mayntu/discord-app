import { AxiosResponse } from "axios";
import $api from "../http";



export class ChatService {
    static async getChatsUsers():Promise<AxiosResponse<any>>{
        return $api.get<any>("api/v1/getUsersChats")
    }


    static async getChatMessage():Promise<AxiosResponse<any>>{
        return $api.post<any>("api/v1/getChatMessages",{chat_id : "6dc5d949-d47a-4121-a5e6-a3596a75178b"})
    }


}
