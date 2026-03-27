import { IconType } from "@/types/global.types";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { routePatternToRegex } from "expo-router/build/fork/getStateFromPath-forks";
import { TouchableOpacity,Text,Image, ImageSourcePropType } from "react-native";

export function ServiceCard({ icon, title , path}: { icon: IconType; title: string , path : string }) {
  const isImage = typeof icon !== "string";
  const router = useRouter();
  return (
    <TouchableOpacity className="w-[47%] h-32 bg-sky-300 rounded-2xl items-center justify-center mb-5 shadow-md" onPress={() => router.push(`/(tabs)/(home)${path}`)}>
       {isImage ? (
        <Image
          source={icon as ImageSourcePropType}
          style={{height : 28 , width : 28}}
          resizeMode="contain"
        />
      ) : (
        <Ionicons name={icon} size={28} color="black" />
      )}
      <Text className="mt-2 text-sm font-medium">{title}</Text>
    </TouchableOpacity>
  );
}