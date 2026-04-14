import { useEffect, useState, useCallback } from "react";
import { Linking, Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";
import * as Location from "expo-location";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocation } from "@/hooks/useLocation";
import { AppBar } from "@/components/AppBar";
import { LocationCardSkeleton } from "@/components/SckeletonCard";

const categories = [
    { name: "Hospitals", tag: "hospital", isSelected: true },
    { name: "Police Stations", tag: "police", isSelected: false },
    { name: "Fire Stations", tag: "fire_station", isSelected: false },
    { name: "Government Offices", tag: "local_government_office", isSelected: false },
    { name: "Public Transport", tag: "bus_stations", isSelected: false },
];

export default function ServiceLocatorScreen() {
    const insets = useSafeAreaInsets();

    const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [selectedCategory, setSelectedCategory] = useState(categories);
    const { isLoading, isError, data, error } = useLocation(currentLocation?.lat || 0, currentLocation?.lng || 0, selectedCategory.find(c => c.isSelected)?.tag || "hospital");
    console.log("ServiceLocatorScreen data:", data, "error:", error);
    const openMap = (lat: number, lng: number) => {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
        Linking.openURL(url);
    };


    const handleCategoryChange = (tag: string) => {
        setSelectedCategory(prev =>
            prev.map(category =>
                category.tag === tag
                    ? { ...category, isSelected: true }
                    : { ...category, isSelected: false }
            )
        );
    }

    useEffect(() => {
        const fetchLocationData = async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") return;

            const loc = await Location.getCurrentPositionAsync({});
            setCurrentLocation({
                lat: loc.coords.latitude,
                lng: loc.coords.longitude,
            });
        };

        fetchLocationData();
    }, []);


    if (isError) {
        return <Text>Error fetching location data</Text>
    }
    return (
        <>
            <View className="flex-1" style={{ paddingTop: insets.top, paddingBottom: insets.bottom + 60 }}>
                <AppBar />
                <Text className="font-semibold ml-4 mt-2">Service Locator</Text>
                <View className="flex-row flex-wrap p-4">
                    {
                        selectedCategory.map((category) => (
                            <Pressable key={category.tag} className={`px-4 py-2 m-2 rounded-lg ${category.isSelected ? "bg-sky-300" : "bg-gray-300"}`} onPress={() => handleCategoryChange(category.tag)}>
                                <Text className="font-medium">{category.name}</Text>
                            </Pressable>
                        ))
                    }
                </View>
                <ScrollView className="flex-1 p-4">
                    {isLoading ? (
                        <View className="flex-1 p-4">
                            <LocationCardSkeleton />
                            <LocationCardSkeleton />
                            <LocationCardSkeleton />
                            <LocationCardSkeleton />
                            <LocationCardSkeleton />
                            <LocationCardSkeleton />
                        </View>
                    ) : (
                        data.map(place => (
                            <TouchableOpacity
                                key={place.id}
                                onPress={() => openMap(place.lat, place.lon)}
                                className="bg-white p-4 rounded-xl mb-3 shadow-sm"
                            >
                                <Text className="font-semibold text-lg">
                                    {place?.name || "Unknown"}
                                </Text>

                                <Text className="text-gray-500">
                                    {place.type}
                                </Text>

                                <Text className="text-blue-500 mt-1">
                                    📍 {place.distance} km away
                                </Text>
                            </TouchableOpacity>
                        ))
                    )}
                </ScrollView>
            </View>
        </>
    )
}