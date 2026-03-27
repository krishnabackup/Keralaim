import { Ionicons } from "@expo/vector-icons";
import { ImageSourcePropType } from "react-native";

export type IconType = keyof typeof Ionicons.glyphMap | ImageSourcePropType;

export type PaginationProps = {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
};

