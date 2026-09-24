import { View, Text, ScrollView } from "react-native"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useScheme } from "@/hooks/useSchemes"
import { AppBar } from "@/components/AppBar"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"

const Section = ({ title, content }: any) => {
  if (!content?.plainText) return null

  return (
    <View className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
      <Text className="text-lg font-semibold mb-2 text-gray-900">
        {title}
      </Text>
        {content?.structured?.map((s, index: number) => {
  if (s.type === "text") {
    return (
      <Text key={index} className="text-gray-600 mb-2 leading-6">
        {s.value}
      </Text>
    )
  }

  if (s.type === "list") {
    return (
      <View key={index} className="mb-3">
        {s.items?.map((item: string, i: number) => (
          <Text key={i} className="text-gray-600 mb-1">
            {i + 1}. {item}
          </Text>
        ))}
      </View>
    )
  }

  return null
})}
    </View>
  )
}

const SchemeDetails = () => {
  const { slug } = useLocalSearchParams<{ slug: string }>()
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { data , isLoading , isError} = useScheme(slug);
  console.log(data)
  const schemeData = data?.data;
  console.log(isError)
  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-gray-500">Loading scheme...</Text>
      </View>
    )
  }

  if(isError) return ( <View className="flex-1 justify-center items-center">
        <Text className="text-gray-500">Loading scheme...</Text>
      </View>)

  if(!schemeData) return (
   <View className="flex-1 justify-center items-center">
        <Text className="text-gray-500">Error loadiing scheme.</Text>
      </View>)
  return (
    <View
      className="flex-1 bg-gray-100"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom + 60 }}
    >
    <AppBar/>
    <ScrollView className="flex-1 bg-gray-100 px-4 pt-4">

      {/* Title Card */}
      <View className="bg-blue-500 rounded-2xl p-5 mb-5 relative">
  
  <TouchableOpacity
    style={{
      position: "absolute",
      right: 15,
      top: 15,
      zIndex: 10,
    }}
  >
    <Ionicons name="bookmark" size={20} color="white" />
  </TouchableOpacity>

  <Text className="text-white text-xl font-bold pr-8">
    {schemeData.title}
  </Text>

</View>
      <View className="flex-row justify-end mb-2">
        <TouchableOpacity className="bg-blue-400 rounded-2xl p-2" onPress={() => router.push(`/(tabs)/(home)/schemes/${schemeData.title}/question`)}>
            <Text className="font-bold">Check Eligibility</Text>
        </TouchableOpacity>
      </View>

      {/* Sections */}
      <Section title="Details" content={schemeData.schemeDetails.details} />
      <Section title="Benefits" content={schemeData.schemeDetails.benefits} />
      <Section title="Eligibility" content={schemeData.schemeDetails.eligibility} />
      <Section title="Exclusions" content={schemeData.schemeDetails.exclusions} />
      <Section title="Documents Required" content={schemeData.schemeDetails.documentsRequired} />
      <Section title="Application Process" content={schemeData.schemeDetails.applicationProcess} />

    </ScrollView>
    </View>
  )
}

export default SchemeDetails