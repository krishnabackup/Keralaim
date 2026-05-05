import { RegisterBody } from "@/types/auth.types";
import api from "./api";
import { Question, Question_Answer } from "@/types/global.types";

export const loginCall = async (email : string , password : string) => {
    try{
    const res = await api.post("/auth/login",{email : email , password : password})
    return res.data;
    }
    catch(error : any){
        return {
            success : error.success,
            message : error.customMessage
        }
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

export const updateProfile = async (profileData : Question_Answer) => {
    try{
        console.log("Updating profile with data:", profileData);
        const res = await api.patch("/user/profile",{
            profileData
        })
        return res.data
    }
    catch(error){
        console.error("Error updating profile : " , error)
    }
}