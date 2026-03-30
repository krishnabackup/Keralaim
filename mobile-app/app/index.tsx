import { useEffect, useState } from "react";
import "../global.css"
import { Redirect, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { ActivityIndicator } from "react-native";
import * as NavigationBar from "expo-navigation-bar";

export default function Index() {
    const [loading,setLoading] = useState(true);
    const [route,setRoute] = useState<string | null>(null);
  useEffect(()=> {
    const authCheck = async () => {
     const token = await SecureStore.getItemAsync("token");
     if(token){
      setRoute("/(tabs)/(home)/dashboard");
     }else{
      setRoute("/(auth)/login")
     }
     setLoading(false);
     NavigationBar.setStyle("dark");
    }
    
   authCheck();
  },[])
  if(loading) return<ActivityIndicator/>
  if(!route) return null;

  return (
    <Redirect href={route}/>
  );
}
