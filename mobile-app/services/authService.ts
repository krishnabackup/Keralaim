import { RegisterBody } from "@/app/(auth)/auth.types";
import api from "./api";

export const login = async (email : string , password : string) => {
    try{
   const res = await api.post("/auth/login",{email : email , password : password})
   console.log("Res:" , res);
    return res.data;
    }
    catch(error){
        console.error("Error :",error)
    }
}

export const register = async(registerDetails : RegisterBody) => {
    try {
      const res = await api.post("/auth/register",registerDetails)
      return res.data
    }
    catch(error){
        console.error("Error : " ,error)
    }
}

