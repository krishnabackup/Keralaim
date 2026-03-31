import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Message } from "@/types/global.types";
import { getAIResponse } from "@/services/aichatbotservices";

export default function AIChatbotScreen() {
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const flatListRef = useRef<FlatList>(null);

  const sendMessage = async () => {
    const userQuery = input.trim();
    if (!userQuery) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
    };

    setMessages((prev) => [userMessage, ...prev]);
    setInput("");

    

    const data = await getAIResponse(userQuery);

    const botMessage: Message = {
      id: Date.now().toString() + "bot",
      text: data, 
      sender: "bot",
    };

    setMessages((prev) => [botMessage, ...prev]);
};

const renderItem = ({ item }: { item: Message }) => (
  <View
    className={`mb-3 ${item.sender === "user" ? "items-end" : "items-start"
      }`}
  >
    <View
      className={`px-3 py-2 rounded-xl max-w-[80%] ${item.sender === "user"
        ? "bg-blue-500"
        : "bg-white"
        }`}
    >
      <Text
        className={`${item.sender === "user"
          ? "text-white"
          : "text-gray-800"
          }`}
      >
        {item.text}
      </Text>
    </View>
  </View>
);

return (
  <View className="flex-1 bg-sky-100" style={{ paddingTop: insets.top, paddingBottom: insets.bottom + 60 }}>
    {/* Header */}
    <View className="bg-sky-400 py-4 items-center">
      <Text className="text-white text-lg font-semibold">KeralAIm</Text>
    </View>

    {/* Title */}
    <Text className="px-4 mt-3 font-semibold text-gray-800">
      AI chatbot
    </Text>

    <KeyboardAvoidingView
      className="flex-1"
      behavior="padding"
    >
      <View className="flex-1 mx-4 my-3 bg-sky-200 rounded-xl p-3">

        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          inverted   // 🔥 latest at bottom
          showsVerticalScrollIndicator={false}
        />

        {/* Input */}
        <View className="flex-row items-center mt-2 bg-white rounded-full px-3 py-2">
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Type your message..."
            className="flex-1"
          />

          <TouchableOpacity className="mx-2">
            <Ionicons name="mic-outline" size={20} />
          </TouchableOpacity>

          <TouchableOpacity onPress={sendMessage}>
            <MaterialIcons name="send" size={20} />
          </TouchableOpacity>
        </View>

      </View>
    </KeyboardAvoidingView>
  </View>
);
}