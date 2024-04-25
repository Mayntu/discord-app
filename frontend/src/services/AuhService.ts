import { AxiosResponse } from "axios";
import $api from "../http";




export class AuthService{

    static async login(login:string,password:string):Promise<AxiosResponse<any>>{
        return $api.post<any>("/api/v1/authorization",{login,password})
    }

    static async registration(email:string,login:string,password:string):Promise<AxiosResponse<any>>{
        return $api.post<any>("/api/v1/registration",{email,login,password})
    }
    
    // static async logout(): Promise<void>{
        // return $api.post("/logout")  //под вопросом нужно ли
    // }

    static async getUser():Promise<AxiosResponse<any>>{
        return $api.get<any>("api/v1/getUsersInfo")
    }
}