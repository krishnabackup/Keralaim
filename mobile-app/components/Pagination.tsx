import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { PaginationProps } from "@/types/global.types";

const Pagination: React.FC<PaginationProps> = ({
  totalPages,
  currentPage,
  onPageChange,
}) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <View className="flex-row items-center gap-2 p-3">
      
      {/* Prev Button */}
      <TouchableOpacity
        disabled={currentPage === 1}
        onPress={() => onPageChange(currentPage - 1)}
        className={`px-3 py-2 rounded-md bg-gray-200 ${
          currentPage === 1 ? "opacity-40" : ""
        }`}
      >
        <Text className="font-semibold text-gray-800">Prev</Text>
      </TouchableOpacity>

      {/* Page Numbers */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="flex-row"
      >
        {pages.map((page) => (
          <TouchableOpacity
            key={page}
            onPress={() => onPageChange(page)}
            className={`mx-1 px-4 py-2 rounded-md ${
              currentPage === page ? "bg-blue-500" : "bg-gray-200"
            }`}
          >
            <Text
              className={`${
                currentPage === page
                  ? "text-white font-bold"
                  : "text-gray-800"
              }`}
            >
              {page}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Next Button */}
      <TouchableOpacity
        disabled={currentPage === totalPages}
        onPress={() => onPageChange(currentPage + 1)}
        className={`px-3 py-2 rounded-md bg-gray-200 ${
          currentPage === totalPages ? "opacity-40" : ""
        }`}
      >
        <Text className="font-semibold text-gray-800">Next</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Pagination;