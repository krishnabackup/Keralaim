import { Ionicons } from "@expo/vector-icons";
import { ImageSourcePropType } from "react-native";

export type IconType = keyof typeof Ionicons.glyphMap | ImageSourcePropType;

export type PaginationProps = {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
};

export type Message = {
  id: string;
  text: string;
  sender: "user" | "bot";
};

export type Question = {
  field: string;
  question: string;
  type: "number" | "string" | "select" | "yes/no";
  value?: string[];
};

export type Question_Answer = {
  category?: string;
  disability?: string;
  gender?: string;
  income?: string | number;
  occupation?: string;
  region?: string;
  religion?: string;
};