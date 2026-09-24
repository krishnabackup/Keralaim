import { TouchableOpacity, View, Text } from "react-native";

interface Props {
  value: string | null;
  onChange: (val: string) => void;
}

export default function YesNoInput({ value, onChange }: Props) {
  return (
    <View className="flex-row gap-3 mt-1">
      <TouchableOpacity
        onPress={() => onChange("yes")}
        className={`flex-1 py-3 rounded-xl border items-center justify-center flex-row gap-2
          ${value === "yes"
            ? "bg-sky-400 border-sky-400"
            : "bg-white border-slate-200"}`}
        activeOpacity={0.8}
      >
        <Text
          className={`text-sm font-semibold
            ${value === "yes" ? "text-white" : "text-slate-500"}`}
        >
          ✓  Yes
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => onChange("no")}
        className={`flex-1 py-3 rounded-xl border items-center justify-center flex-row gap-2
          ${value === "no"
            ? "bg-red-400 border-red-400"
            : "bg-white border-slate-200"}`}
        activeOpacity={0.8}
      >
        <Text
          className={`text-sm font-semibold
            ${value === "no" ? "text-white" : "text-slate-500"}`}
        >
          ✕  No
        </Text>
      </TouchableOpacity>
    </View>
  );
}
