import axios from "axios"
import { IAuthResponse } from "../models/response/AuthResponse"



export const API_URL = `http://127.0.0.1:8000/`


const $api = axios.create({
    withCredentials : true,
    baseURL: API_URL
})


$api.interceptors.request.use(config=>{
    //Bearer
    config.headers.Authorization = `${localStorage.getItem("token")}`
    return config
})


$api.interceptors.response.use(config=>{
    return config
},async error=>{
    const originalRequest = error.config
    console.log(error,"intecepor")
    if(error.response.status == 401 && error.config && !error.config._isRetry){
        originalRequest._isRetry = true
        try {
            const response = await  axios.get<IAuthResponse>(`${API_URL}/refresh`,{
                withCredentials: true})
                localStorage.setItem("token", response.data.accessToken)
                return $api.request(originalRequest)
        } catch (e) {
            console.log(e)
        }
    }
    throw error
})

export default $api