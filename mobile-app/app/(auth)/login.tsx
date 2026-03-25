import { Text, View ,TouchableOpacity,TextInput} from "react-native";
import { login } from "../../services/authService";
import * as SecureStore from "expo-secure-store";

import { useState } from "react";
import { useRouter } from "expo-router";


export default function LoginScreen() {
  const [email,setEmail] = useState("");
  const [password ,setPassword] = useState("");
  const router = useRouter();
   const handleLogin = async (email : string,password : string) => {
        const res = await login(email,password)
        console.log(res);
        await SecureStore.setItemAsync("token",res.data.token)
        if(res.success === true){
           router.replace("/(home)/dashboard");
        }else{
            console.log("Error login");
        }
    }
  return (
    <View className="flex-1 bg-white px-6 justify-center">
      
      {/* App Name */}
      <Text className="text-center text-2xl font-semibold text-blue-500 mb-10">
        KeralAIm
      </Text>

      {/* Title */}
      <Text className="text-center text-lg font-semibold text-gray-800">
        Login to Continue
      </Text>
      <Text className="text-center text-gray-500 mb-6">
        Enter your email and password
      </Text>

      {/* Email Input */}
      <TextInput
        placeholder="email@domain.com"
        className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
        keyboardType="email-address"
        onChangeText={(e) => setEmail(e)}
      />

      {/* Password Input */}
      <TextInput
        placeholder="password"
        secureTextEntry
        className="border border-gray-300 rounded-lg px-4 py-3 mb-6"
         onChangeText={(e) => setPassword(e)}
      />

      {/* Continue Button */}
      <TouchableOpacity className="bg-blue-500 py-3 rounded-lg mb-4" onPress={() => handleLogin(email,password)}>
        <Text className="text-center text-white font-semibold">
          Continue
        </Text>
      </TouchableOpacity>

      {/* Signup */}
      <Text className="text-center text-gray-500 mb-4">
        <Text>If No Account,{" "}</Text>
        <Text className="text-blue-500 font-semibold">Sign Up</Text>
      </Text>

      {/* Divider */}
      <View className="flex-row items-center mb-4">
        <View className="flex-1 h-[1px] bg-gray-300" />
        <Text className="mx-2 text-gray-400">or</Text>
        <View className="flex-1 h-[1px] bg-gray-300" />
      </View>

      {/* Google Button */}
      <TouchableOpacity className="bg-gray-100 py-3 rounded-lg flex-row items-center justify-center mb-6">
        <Text className="mr-2 text-lg">G</Text>
        <Text className="text-gray-700 font-medium">
          Continue with Google
        </Text>
      </TouchableOpacity>

      {/* Terms */}
      <Text className="text-center text-gray-400 text-xs">
        By clicking continue, you agree to our{" "}
        <Text className="underline">Terms of Service</Text> and{" "}
        <Text className="underline">Privacy Policy</Text>
      </Text>
    </View>
  );
}