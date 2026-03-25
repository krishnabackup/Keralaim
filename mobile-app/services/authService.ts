import api from "./api";

export const login = async (email : string , password : string) => {
    try{
   const res = await api.post("/auth/login",{email : email , password : password})
    return res.data;
    }
    catch(error){
        console.error("Error :",error)
    }
   
}

