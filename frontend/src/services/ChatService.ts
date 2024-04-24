import { AxiosResponse } from "axios";
import $api from "../http";



export class ChatService {
    static async getChatsUsers():Promise<AxiosResponse<any>>{
        return $api.get<any>("api/v1/getUsersChats")
    }


    static async getChatMessage(chat_id: string):Promise<AxiosResponse<any>>{
        return $api.post<any>("api/v1/getChatMessages",{chat_id})
    }

    static async postFindChat(login : string):Promise<AxiosResponse<any>>{
        return $api.post<any>("api/v1/findUsers",{login})
    }

    static async postCreateChat(uuid : string):Promise<AxiosResponse<any>>{
        return $api.post<any>("api/v1/createChat",{users_ids: uuid})
    }

                        // все что нужно отправить
    static async test(uuid : string):Promise<AxiosResponse<any>>{
                                        // если get ничего не надо 
                                        // если post просто объект axios все сам сделает
        return $api.post<any>("адрес",{users_ids: uuid})
    }

    static async saveM(media : any):Promise<AxiosResponse<any>>{
        return $api.post<any>("api/v1/saveMessage",{media, token : localStorage.getItem("token")})
    }
}
