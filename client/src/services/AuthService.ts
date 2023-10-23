import $api from "../http";
import {AxiosResponse} from 'axios'


export default class AuthService { 
    static async login(email: string, password: string):Promise<AxiosResponse> { 
        return $api.post()
    }
}

Response