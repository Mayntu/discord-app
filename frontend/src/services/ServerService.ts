import { AxiosResponse } from "axios";
import $api from "../http";




export class ServerService{

    static async createServer(n:any):Promise<AxiosResponse<any>>{
        return $api.post<any>("api/v1/createServer",n)
    }

}