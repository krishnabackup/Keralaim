import React, { use } from "react";
import { View, Text, TouchableOpacity, TextInput, ScrollView, Image, Pressable, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppBar } from "@/components/AppBar";
import * as ImagePicker from "expo-image-picker";
import { uploadComplaintImage } from "@/services/complaintServices";
import * as Location from "expo-location";
import { useRouter } from "expo-router";

export default function ComplaintRegisterScreen() {
  const [image, setImage] = React.useState<string | null>(null);
  const [location, setLocation] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [currentLocation, setCurrentLocation] = React.useState<{ lat: number; lng: number } | null>(null);
  const [description, setDescription] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  const handleUpload = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
    });

    if (!res.canceled) {
      setImage(res.assets[0].uri);
    }
  }
  const handleSubmitComplaint = async() => {
    try{
      setLoading(true);
      const response = await uploadComplaintImage(image, location, description , title);
      console.log("Complaint submitted successfully:", response);
      setLoading(false);
      if(response.success){
        setImage(null);
        setLocation("");
        setDescription("");
        setTitle("")
        Alert.alert("Success", "Complaint submitted successfully!");
        router.back();
      }
    }
    catch(error) {
      console.error("Error submitting complaint:", error);
      setLoading(false);
      Alert.alert("Error", "Failed to submit complaint. Please try again.");
    }
  }

  const handleDetectLocation = async() => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission to access location was denied');
      return;
    }
    let loc = await Location.getCurrentPositionAsync({});
    setCurrentLocation({ lat: loc.coords.latitude, lng: loc.coords.longitude });
    const addresses = await Location.reverseGeocodeAsync({
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
    });
    if (addresses.length > 0) {
      const address = addresses[0];
      setLocation(address.formattedAddress || "");
    }
    console.log("Current Location:", loc);
  }
  
  const insets = useSafeAreaInsets();
  return (
    <>

      <View className="flex-1 bg-gray-100" style={{ paddingTop: insets.top, paddingBottom: insets.bottom + 70 }}>
        <AppBar />
        <KeyboardAvoidingView behavior= {Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView className="p-4" keyboardShouldPersistTaps="handled">
          {loading && <Text className="text-center mt-4">Submitting complaint...</Text>}

          {/* Title */}
          <Text className="font-semibold mb-3">Complaints</Text>

          {image ? (
            <View className="mt-4">
              <Text className="text-gray-600 mb-2">Selected Image:</Text>
              <Image source={{ uri: image }} className="w-full h-96 rounded-md" />
            </View>
          ) : <View className="h-96 bg-gray-300 rounded-md items-center justify-center">
            <Ionicons name="cloud-upload-outline" size={32} color="black" />
          </View>}

          {/* Upload Button */}
          <TouchableOpacity className="mt-4 bg-blue-400 py-3 rounded-md items-center mb-10" onPress={handleUpload}>
            <Text className="text-black font-semibold">Upload</Text>
          </TouchableOpacity>

          <View className="flex-row gap-1 items-center mb-6">
            <Text className="text-gray-600">Location :</Text>
            <TextInput className="border border-gray-300 rounded-xl p-3 w-1/2 bg-white text-gray-700" value = {location} onChangeText={(e) => setLocation(e)}/>
            <Pressable className="bg-blue-500 px-4 py-2 rounded-full" onPress={handleDetectLocation}>
              <Text className="text-white text-sm font-semibold">
                Detect Location
              </Text>
            </Pressable>
          </View>

          {/* AI Button */}
          <TouchableOpacity className="self-start bg-blue-500 px-4 py-2 rounded-full mb-4">
            <Text className="text-white text-sm font-semibold">
              Auto generate AI complaint
            </Text>
          </TouchableOpacity>

          {/* OR Divider */}
          <View className="flex-row items-center my-4">
            <View className="flex-1 h-[1px] bg-gray-300" />
            <Text className="mx-2 text-gray-500">or</Text>
            <View className="flex-1 h-[1px] bg-gray-300" />
          </View>
         {/* Input Box */}
         <TextInput placeholder="Enter complaint title here ..." value={title} onChangeText={(e) => setTitle(e)} className="border border-gray-300 rounded-xl p-3 bg-white text-gray-700 mb-4" />
          <TextInput
            placeholder="Write complaint details here ..."
            style={{ textAlignVertical: "top" }}
            multiline
            value={description}
            className="h-32 border border-gray-300 rounded-xl p-3 bg-white text-gray-700 mb-5"
            onChangeText={e => setDescription(e)}
          />
          <TouchableOpacity className="self-start bg-blue-500 px-4 py-2 rounded-md mb-4" onPress={handleSubmitComplaint}>
            <Text className="text-white text-sm font-semibold">
              Submit Complaint
            </Text>
          </TouchableOpacity>
        </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </>

  );
}