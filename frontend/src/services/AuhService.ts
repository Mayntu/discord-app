import { AxiosResponse } from "axios";
import $api from "../http";




export class AuthService{

    static async login(email:string,password:string):Promise<AxiosResponse<any>>{
        return $api.post<any>("/api/v1/authorization",{email,password})
    }

    static async registration(email:string,password:string):Promise<AxiosResponse<any>>{
        return $api.post<any>("/api/v1/registration",{email,password})
    }
    
    static async logout(): Promise<void>{
        return $api.post("/logout")
    }
}