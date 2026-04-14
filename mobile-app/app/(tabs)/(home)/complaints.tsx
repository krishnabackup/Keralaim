import { AppBar } from "@/components/AppBar";
import { ComplaintCard } from "@/components/complaintsCard";
import { useComplaints } from "@/hooks/useComplaints";
import { useRouter } from "expo-router";
import { FlatList, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
  type Complaint = { _id: string; title: string; description: string };

export default function ComplaintScreen(){
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const {isLoading, isError, data , error} = useComplaints();
  console.log("ComplaintScreen data:", data, "error:", error);
  return(
    <>
     <View
      className="flex-1 bg-gray-100"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom + 60 }}
    >
      <AppBar/>
      <View className="p-4">
        <View className="flex-row justify-between items-center">    
      <Text className="text-lg font-semibold">Complaints</Text>
      <Pressable className="bg-sky-300 px-4 py-2 rounded-lg" onPress={() => router.push("/complaintRegisterScreen")}>
        <Text className="font-medium">Register a Complaint</Text>
      </Pressable>
      </View>
      {
        isLoading ? <Text className="text-center mt-4">Loading complaints...</Text> :
        isError ? <Text className="text-center mt-4">Error loading complaints: {error.message}</Text> :
         data.length === 0 ? <Text className="text-center mt-4">No complaints found.</Text> :
         <FlatList
           contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
           data={data}
           renderItem={({ item }: { item: Complaint }) => (
              <ComplaintCard item={item} />
           )}
           keyExtractor={(item: Complaint) => item._id.toString()}
         />
      }
     </View>
    </View>
    </>
  )
}
