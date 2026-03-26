import { Text, View } from "react-native";

export default function SchemeCard() {
  return (
    <View className="bg-sky-300 rounded-2xl p-4 mb-4">
      
      <Text className="text-white font-semibold mb-1">
        KSCSTE Post-Doctoral Fellowship Programme
      </Text>

      <Text className="text-white text-xs mb-2">
        Kerala
      </Text>

      <Text className="text-white text-sm">
        KSCSTE Post-Doctoral Fellowships will be provided to those who possess
        Ph.D. in science and engineering with high quality research publications
        in SCI journals. The program aims to encourage Ph.D. holders to pursue
        further research and to develop career as scientist.
      </Text>

    </View>
  );
}