import { AxiosResponse } from "axios";
import $api from "../http";




export class AuthService{

    static async login(email:string,password:string):Promise<AxiosResponse<any>>{
        return $api.post<any>("/login",{email,password})
    }

    static async registration(email:string,password:string,login:string):Promise<AxiosResponse<any>>{
        return $api.post<any>("api/v1/registration/",{email,password,login})
    }
    
    static async logout(): Promise<void>{
        return $api.post("/logout")
    }
}