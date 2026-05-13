import { Tabs } from "expo-router";
import { FontAwesome5, FontAwesome6, Ionicons } from "@expo/vector-icons"
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AdminTabLayout() {
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
            <Tabs.Screen name="homescreen" options={{
                title: "Home",
                tabBarIcon: () => (
                    <Ionicons name="home-sharp" size={24} color="black" />
                )
            }} />
            <Tabs.Screen name="admindashboard" options={{
                title: "dashboard",
                tabBarIcon: () => (
                    <FontAwesome6 name="robot" size={24} color="black" />
                )
            }} />
            <Tabs.Screen name="adminprofile" options={{
                title: "profile",
                tabBarIcon: () => (
                    <FontAwesome6 name="profile" size={24} color="black" />
                )
            }} />
        </Tabs>
    )
}