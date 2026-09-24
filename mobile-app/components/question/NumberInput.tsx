import { View, TextInput, Text } from "react-native";

interface Props {
  value: string | null;
  placeholder?: string;
  suffix?: string;
  onChange: (val: string) => void;
}

export default function NumberInput({ value, placeholder, suffix, onChange }: Props) {
  return (
    <View className="mt-1">
      <TextInput
        className="w-full px-3 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-800"
        keyboardType="numeric"
        placeholder={placeholder ?? "Enter a number"}
        placeholderTextColor="#94a3b8"
        value={value ?? ""}
        onChangeText={onChange}
      />
      {suffix && (
        <Text className="text-xs text-slate-400 mt-1.5 ml-1">{suffix}</Text>
      )}
    </View>
  );
}
