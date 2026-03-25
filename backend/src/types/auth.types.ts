import { Types } from "mongoose";

export interface LoginBody {
    email : string;
    phone : string
    password : string
}

export interface LoginResponseBody{
    userId : Types.ObjectId;
    token : string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export interface RegisterBody {
    name : string;
    email : string;
    password : string;
    dob : Date;
    district : string;
}

export interface RegisterResponseBody{
    userId : Types.ObjectId;
    token : string;
}
