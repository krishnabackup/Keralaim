import { Tabs } from "expo-router";
import {FontAwesome5, FontAwesome6, Ionicons} from "@expo/vector-icons"
import AppIcons from "@/componets/AppIcons";
import { SafeAreaView } from "react-native-safe-area-context";
export default function TabLayout () {
    return(
        <Tabs screenOptions={{headerShown : false,
            tabBarStyle : {
                backgroundColor : "#71C0F5",
                height : 60
            },
            tabBarActiveTintColor: '#ffd33d', 
           tabBarInactiveTintColor: '#cccccc',
        }}>
            <Tabs.Screen name="(home)" options={{
                title : "Home",
                tabBarIcon : () => (
         <Ionicons name="home-sharp" size={24} color="black" />
                )
            }}/>
            <Tabs.Screen name="aichatbot" options={{
                title : "AI Chat Bot",
                tabBarIcon : () => (
                    <FontAwesome6 name="robot" size={24} color="black" />
                )
            }}/>
            <Tabs.Screen name="aboutus"options={{
                title : "About Us",
                tabBarIcon : () => (
                    <FontAwesome5 name="question" size={24} color="black" />
                )
            }}/>
        </Tabs>
    )
}