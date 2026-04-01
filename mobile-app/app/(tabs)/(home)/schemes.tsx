import { AppBar } from "@/components/AppBar";
import LoadingDots from "@/components/LoadingDots";
import Pagination from "@/components/Pagination";
import SchemeCard from "@/components/SchemesScreen";
import SchemeCardSkeleton from "@/components/SckeletonCard";
import { useSchemes } from "@/hooks/useSchemes";
import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SchemesScreen() {
  const insets = useSafeAreaInsets();
  const [pageNumber, setPageNumber] = useState(1);
  const { isLoading, data, isError, isSuccess } = useSchemes(pageNumber);
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

        {isLoading ? (
          <>
            {[1, 2, 3, 4].map((i) => (
              <SchemeCardSkeleton key={i} />
            ))}
          </>
        ) : isError ? (
          <Text>Error loading schemes</Text>
        ) : (
          data?.data?.map((scheme: any) => (
            <SchemeCard key={scheme.slug} scheme={scheme} />
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

