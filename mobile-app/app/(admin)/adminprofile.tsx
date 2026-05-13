
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "expo-router";
import { View ,TouchableOpacity,Text} from "react-native";

export default function AdminProfileScreen(){
    const router = useRouter();
    const logout = useAuthStore((state) => state.logout); 
    const handleLogout = () => {
       logout();
       router.replace("/(auth)/login")
    }
    return(
        <>
        <View className="flex-1 items-center justify-center">
            <TouchableOpacity className="bg-red-600 p-4 rounded-md " onPress={handleLogout}>
                <Text className="font-bold">Logout</Text>
            </TouchableOpacity>
        </View>
        </>
    )
}