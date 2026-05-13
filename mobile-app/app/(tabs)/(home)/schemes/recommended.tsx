import { AppBar } from "@/components/AppBar";
import Pagination from "@/components/Pagination";
import SchemeCard from "@/components/SchemesScreen";
import SchemeCardSkeleton from "@/components/SckeletonCard";
import { useMySchemes } from "@/hooks/useSchemes";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, TextInput } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function RecommendedSchemesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [pageNumber, setPageNumber] = useState(1);
  const { isLoading, data, isError, isSuccess } = useMySchemes(pageNumber);
  if (isError) {
    return <Text>Error loading schemes</Text>;
  }
  return (
    <View
      className="flex-1 bg-gray-100"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom + 60 }}
    >
      {/* Header */}
      <AppBar />
      <ScrollView className="px-4 mt-4">

        {/* Title */}
        <View className="flex-row justify-between items-center mb-4 relative">
        <Text className="text-base font-semibold mb-3">
          My Schemes
        </Text>
          <Ionicons name="search" size={20} style={{position : "absolute" , left : 210 , top : 8 , zIndex : 1 , fontSize : 15}}/>
        <TextInput placeholder="Search schemes..." className="bg-white rounded-lg px-4 py-2 pl-10 mb-4 shadow-sm"  />
</View>
       
        {isLoading ? (
          <>
            {[1, 2, 3, 4].map((i) => (
              <SchemeCardSkeleton key={i} />
            ))}
          </>
        ) : isError ? (
          <Text>Error loading schemes</Text>
        ) : (
          data?.data.map((scheme: any) => (
            <SchemeCard key={scheme.scheme.slug} scheme={scheme.scheme.cardData} />
          ))
        )}
        {
          data?.totalPages > 1 && <Pagination
            totalPages={data.totalPages}
            currentPage={pageNumber}
            onPageChange={setPageNumber}
          />
        }
      </ScrollView>
    </View>
  );
}

