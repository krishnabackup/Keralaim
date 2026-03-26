import { Input } from "@/components/Input";
import { router } from "expo-router";
import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RegisterBody } from "./auth.types";
import { register } from "@/services/authService";

export default function RegisterScreen() {
    const [registerBody,setRegisterBody] = useState<RegisterBody>({}); 
    const handleRegister = async (details : RegisterBody) => {
       const res = await register(details);
       console.log(res);
       if(res?.data === true){
        router.replace("/(tabs)/(home)/dashboard");
       }else{
        console.log("Not allwed");
       }
    }
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-1 bg-gray-100 px-6 mt-28"
      style={{ paddingTop: insets.top + 20 }}
    >
      {/* Title */}
      <Text className="text-center text-xl font-semibold text-sky-500 mb-6">
        KeralAim
      </Text>

      {/* Form Card */}
      <View className="bg-sky-300 rounded-2xl p-4">

        <Input placeholder="Name" name="name" setRegisterBody={setRegisterBody} />
        <Input placeholder="Age" name="age" setRegisterBody={setRegisterBody}/>
        <Input placeholder="District" name="district" setRegisterBody={setRegisterBody}/>
        <Input placeholder="Email" name="email" setRegisterBody={setRegisterBody}/>
        <Input placeholder="Password" secureTextEntry name="password" setRegisterBody={setRegisterBody}/>
        <Input placeholder="Confirm Password" secureTextEntry  name="password" setRegisterBody={setRegisterBody}/>

      </View>

      {/* Button */}
      <TouchableOpacity className="bg-sky-500 py-3 rounded-lg mt-6" onPress={() => handleRegister(registerBody)}>
        <Text className="text-center text-white font-semibold">
          Login
        </Text>
      </TouchableOpacity>

      {/* Footer */}
      <View className="flex flex-row items-baseline justify-center">
      <Text className="text-center text-gray-600 mt-4">
        Already have an account ?{" "}
         </Text>
        <TouchableOpacity onPress={() => router.replace("/(auth)/login")}>
        <Text className="text-sky-500 font-semibold text-center">Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

