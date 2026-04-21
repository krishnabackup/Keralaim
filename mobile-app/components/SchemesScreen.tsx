import { SchemeCardTypes } from "@/types/schemes.types";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function SchemeCard({key , scheme} : {key : string , scheme : SchemeCardTypes}) {
  const router = useRouter();
  return (
    <TouchableOpacity onPress={() => router.push(`/(tabs)/(home)/schemes/${scheme.slug}`)}>
    <View className="bg-sky-300 rounded-2xl p-4 mb-4">
      
      <Text className="text-black font-semibold mb-1">
        {scheme.schemeName}
      </Text>

      <Text className="text-gray-500 text-s mb-2">
        {scheme.beneficiaryState}
      </Text>

      <Text className="text-gray-700 text-sm">
        {scheme.briefDescription}
      </Text>

    </View>
    </TouchableOpacity>
  );
}