import {create} from 'zustand'
import * as SecureStore from "expo-secure-store"
type AuthState = {
    token : string | null
    isAdmin : boolean
    isLoading : boolean

  login: (token: string, isAdmin: boolean) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
}


export const useAuthStore = create<AuthState>((set) => ({
    token : null,
    isAdmin : false,
    isLoading : true,

    login : async (token,isAdmin) => {
        await SecureStore.setItemAsync("token",token)
        await SecureStore.setItemAsync("role",JSON.stringify(isAdmin));

        set({token,isAdmin});
    },
    logout : async() => {
       await SecureStore.deleteItemAsync("token");
       await SecureStore.deleteItemAsync("role");

       set({token : null , isAdmin : false});
    },
    loadUser : async () => {
        const token = await SecureStore.getItemAsync("token");
        const role = await SecureStore.getItemAsync("role");

        set({
            token : token,
            isAdmin : role ? JSON.parse(role) : false,
            isLoading : false
        });
    }
}))
