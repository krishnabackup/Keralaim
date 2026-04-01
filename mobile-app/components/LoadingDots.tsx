import React, { useEffect, useRef } from "react";
import { View, Animated } from "react-native";

const Dot = ({ delay }: { delay: number }) => {
  const scale = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1,
          duration: 400,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 0.5,
          duration: 400,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={{
        transform: [{ scale }],
      }}
      className="w-3 h-3 bg-sky-400 rounded-full mx-1"
    />
  );
};

export default function LoadingDots() {
  return (
    <View className="flex-row items-center justify-center py-4">
      <Dot delay={0} />
      <Dot delay={150} />
      <Dot delay={300} />
    </View>
  );
}