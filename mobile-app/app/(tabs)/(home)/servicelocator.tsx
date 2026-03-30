import { useEffect, useState } from "react";
import { Linking, Pressable, ScrollView, Text, View } from "react-native";
import * as Location from "expo-location";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocation } from "@/hooks/useLocation";
import { AppBar } from "@/components/AppBar";

export default function ServiceLocatorScreen() {
    const insets = useSafeAreaInsets();

    const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
    const {isLoading,isError,data,error} = useLocation(currentLocation?.lat || 0, currentLocation?.lng || 0);
    const openMap = (lat: number, lon: number) => {
        const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;
        Linking.openURL(url);
    };
    useEffect(() => {
        const fetchLocationData = async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permission to access location was denied');
                return;
            }
            const loc = await Location.getCurrentPositionAsync({});
            setCurrentLocation({ lat: loc.coords.latitude, lng: loc.coords.longitude })
        }
        fetchLocationData();
    }, []);
    if(isLoading){
        return <Text>Loading...</Text>
    }
    if(isError){
        return <Text>Error fetching location data</Text>
    }
    console.log("Location Data : " , data);
    return (
        <>
        <View className="flex-1 " style={{ paddingTop: insets.top, paddingBottom: insets.bottom + 60 }}>
            <AppBar/>
            <ScrollView className="flex-1 p-4">
                {data.map((place: any) => (
                    <Pressable
                        key={place.id}
                        onPress={() => openMap(place.lat, place.lon)}
                        className="flex gap-3 w-full h-32 bg-sky-300 rounded-2xl items-center justify-center mb-5 shadow-md"
                    >
                        <Text className="font-semibold text-center text-lg">
                            {place.tags?.name || "Unknown"}
                        </Text>
                        <Text>{place.tags?.amenity || place.tags?.office}</Text>
                    </Pressable>
                ))}
            </ScrollView>
            </View>
        </>
    )
}