import { InputProps, RegisterBody } from "@/app/(auth)/auth.types";
import React from "react";
import { TextInput } from "react-native";


export function Input({ placeholder, name , secureTextEntry ,setRegisterBody } : InputProps) {
  return (
    <TextInput
      placeholder={placeholder}
      secureTextEntry={secureTextEntry}
      className="bg-white rounded-md px-3 py-2 mb-3"
      onChangeText={(text) => setRegisterBody(prev => (
        {
            ...prev,
            [name] : text
        }
      ))}
    />
  );
}