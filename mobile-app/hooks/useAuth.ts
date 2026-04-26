import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";

export const useAuth = () => {
    const [token,setToken] = useState<string | null>(null);
    const [isLoading,setIsLoading] = useState(true);
    useEffect(()=>{
       const retriveToken = async () => {
         const token = await SecureStore.getItemAsync("token")
         if(token){
            setToken(token);
            setIsLoading(false)
         }
       }
       retriveToken();
    },[])
    const logout =  async() => {
       await SecureStore.deleteItemAsync("token"); 
       setToken(null);
       router.replace("/(auth)/login");
    }
    const login = async(token : string) => {
        await SecureStore.setItemAsync("token",token)
        setToken(token);
    }
    return {token,isLoading,login,logout}
}