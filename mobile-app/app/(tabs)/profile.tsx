
import { useAuthStore } from "@/store/useAuthStore";
import { View ,TouchableOpacity,Text} from "react-native";

export default function ProfileScreen(){
    const logout = useAuthStore((state) => state.logout); 
    return(
        <>
        <View className="flex-1 items-center justify-center">
            <TouchableOpacity className="bg-red-600 p-4 rounded-md " onPress={logout}>
                <Text className="font-bold">Logout</Text>
            </TouchableOpacity>
        </View>
        </>
    )
}