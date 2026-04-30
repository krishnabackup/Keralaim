import { Tabs } from "expo-router";
import { FontAwesome5, FontAwesome6, Ionicons } from "@expo/vector-icons"
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
    const insets = useSafeAreaInsets();
    return (
        <Tabs screenOptions={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarStyle: {
                backgroundColor: "#71C0F5",
                height: 50,
                bottom: insets.bottom + 2,
                borderRadius: 30,
                marginHorizontal: 20,
                position: "absolute",
                borderTopWidth: 0,
                elevation: 5, // Android
                shadowColor: "#000",
                shadowOpacity: 0.1,
                shadowRadius: 10,

            },
            tabBarActiveTintColor: '#ffd33d',
            tabBarInactiveTintColor: '#cccccc',
        }}>
            <Tabs.Screen name="(home)" options={{
                title: "Home",
                tabBarIcon: () => (
                    <Ionicons name="home-sharp" size={24} color="black" />
                )
            }} />
            <Tabs.Screen name="aichatbot" options={{
                title: "AI Chat Bot",
                tabBarIcon: () => (
                    <FontAwesome6 name="robot" size={24} color="black" />
                )
            }} />
            <Tabs.Screen name="profile" options={{
                title: "Profile",
                tabBarIcon: () => (
                    <Ionicons name="person" size={24} color="black" />
                )
            }} />
            <Tabs.Screen name="aboutus" options={{
                title: "About Us",
                tabBarIcon: () => (
                    <FontAwesome5 name="question" size={24} color="black" />
                )
            }} />
        </Tabs>
    )
}