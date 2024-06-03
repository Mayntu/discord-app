import { AxiosResponse } from "axios";
import $api from "../http";



export class ChatService {
    static async getChatsUsers():Promise<AxiosResponse<any>>{
        return $api.get<any>("api/v1/getUsersChats")
    }


    static async getChatMessage(chat_id: string,count: number):Promise<AxiosResponse<any>>{
        return $api.post<any>("api/v1/getChatMessages",{chat_id,count})
    }

    static async postFindChat(login : string):Promise<AxiosResponse<any>>{
        return $api.post<any>("api/v1/findUsers",{login})
    }

    static async postCreateChat(uuid : string):Promise<AxiosResponse<any>>{
        return $api.post<any>("api/v1/createChat",{users_ids: uuid})
    }
    static async saveM(media : FormData):Promise<AxiosResponse<any>>{

        return $api.post<any>("api/v1/changeProfileAvatar",media,{
            headers: {
              'Content-Type': 'multipart/form-data'
            }
        })
    }
    static async postDeleteChat(chat_id: string):Promise<AxiosResponse<any>>{
        return $api.post<any>("api/v1/deleteUsersChat",{chat_id})
    }

    static async postDeleteChatMessage(message_id: string):Promise<AxiosResponse<any>>{
        return $api.post<any>("api/v1/deleteMessage",{message_id})
    }
  
    static async postRecognizeAudio(message_id: string):Promise<AxiosResponse<any>>{
        return $api.post<any>("api/v1/recognizeAudio",{message_id})
    }

    static async postChangeChatMessage(message_uuid: string,new_content: string):Promise<AxiosResponse<any>>{
        return $api.post<any>("api/v1/changeChatMessage",{message_uuid,new_content})
    }


    static async postReadMessage(message_id:string):Promise<AxiosResponse<any>>{
        return $api.post<any>("api/v1/readMessage",{message_id})
    }
}
