import SchemeCard from "@/components/SchemesScreen";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SchemesScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-1 bg-gray-100"
      style={{ paddingTop: insets.top }}
    >
      {/* Header */}
      <View className="bg-sky-400 py-4 items-center">
        <Text className="text-white text-lg font-semibold">
          KeralAim
        </Text>
      </View>

      <ScrollView className="px-4 mt-4">

        {/* Title */}
        <Text className="text-base font-semibold mb-3">
          Schemes
        </Text>

        {/* Toggle Buttons */}
        <View className="flex-row justify-between mb-4">
          <TouchableOpacity className="bg-sky-300 px-4 py-2 rounded-lg">
            <Text className="font-medium">My Schemes</Text>
          </TouchableOpacity>

          <TouchableOpacity className="bg-sky-300 px-4 py-2 rounded-lg">
            <Text className="font-medium">All Schemes</Text>
          </TouchableOpacity>
        </View>

        {/* Cards */}
        <SchemeCard />
        <SchemeCard />

      </ScrollView>
    </View>
  );
}

