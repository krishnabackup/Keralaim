import { ActivityIndicator } from "react-native";
import { Redirect } from "expo-router";
import { useAuthStore } from "@/store/useAuthStore";

export default function Index() {
  const { isLoading, isAdmin, token } = useAuthStore();

  if (isLoading) return <ActivityIndicator />;

  if (!token) {
    return <Redirect href="/(auth)/login" />;
  }

  if (isAdmin) {
    return <Redirect href="/(admin)/homescreen" />;
  }

  return <Redirect href="/(tabs)/(home)/dashboard" />;
}