import { ServiceCard } from "@/components/ServiceCard";
import {useRouter } from "expo-router";
import { View ,Text, TouchableOpacity} from "react-native";


export default function AppDashboard(){
    const router = useRouter();
   return(
    <>
     <View className="flex-1 bg-gray-100 px-5">

      {/* Header */}
      <View className="bg-sky-400 mt-12 py-4 rounded-md items-center">
        <Text className="text-white text-lg font-semibold">
          KeralAim
        </Text>
      </View>

      {/* Title */}
      <Text className="mt-5 mb-4 text-base font-semibold">
        Services
      </Text>

      {/* Grid */}
      <View className="flex-row flex-wrap justify-between">
        <ServiceCard icon="leaf-outline" title="Schemes" path="/schemes" />
        <ServiceCard icon="location-outline" title="Service locator" path="/servicelocator" />
        <ServiceCard icon={require("../../../assets/images/bad-review.png")} title="Complaints" path="/complaint"/>
        <ServiceCard icon={require("../../../assets/images/thunder.png")} title="Disaster Alert" path="/disasteralert"/>

      </View>
    </View>
    </>
   )
}

