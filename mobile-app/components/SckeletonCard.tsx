import { View } from "react-native";

export default function SchemeCardSkeleton() {
  return (
    <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
      
      {/* Title */}
      <View className="h-4 bg-gray-300 rounded w-3/4 mb-3 animate-pulse" />

      {/* Subtitle */}
      <View className="h-3 bg-gray-300 rounded w-1/2 mb-3 animate-pulse" />

      {/* Description */}
      <View className="h-3 bg-gray-300 rounded w-full mb-2 animate-pulse" />
      <View className="h-3 bg-gray-300 rounded w-5/6 animate-pulse" />

      {/* Button */}
      <View className="h-8 bg-gray-300 rounded-lg mt-4 w-24 animate-pulse" />
    </View>
  );
}

export function LocationCardSkeleton() {
  return (
    <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
      
      {/* Title */}
      <View className="h-4 bg-gray-300 rounded w-3/4 mb-3 animate-pulse" />

      {/* Subtitle */}
      <View className="h-3 bg-gray-300 rounded w-1/2 mb-3 animate-pulse" />
      
    </View>
  );
}