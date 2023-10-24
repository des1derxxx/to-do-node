import $api from "../http";
import {AxiosResponse} from 'axios'
import { AuthResponse } from '../models/response/AuthResponse'
import { IUser } from "../models/IUser";


export default class AuthService { 
    static fetchUsers():Promise<AxiosResponse<IUser[]>>{ 
        return $api.get<IUser[]>('/users')
    }
}

