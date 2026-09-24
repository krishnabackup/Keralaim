import { TouchableOpacity, View, Text } from "react-native";

interface Props {
  options: string[];
  value: string | null;
  onChange: (val: string) => void;
}

export default function SelectInput({ options, value, onChange }: Props) {
  return (
    <View className="flex-col gap-2 mt-1">
      {options.map((opt) => {
        const selected = value === opt;
        return (
          <TouchableOpacity
            key={opt}
            onPress={() => onChange(opt)}
            activeOpacity={0.8}
            className={`flex-row items-center gap-3 px-3 py-3 rounded-xl border
              ${selected
                ? "bg-sky-50 border-sky-400"
                : "bg-white border-slate-200"}`}
          >
            {/* Radio dot */}
            <View
              className={`w-4 h-4 rounded-full border-2 items-center justify-center
                ${selected ? "border-sky-400 bg-sky-400" : "border-slate-300"}`}
            >
              {selected && (
                <View className="w-1.5 h-1.5 rounded-full bg-white" />
              )}
            </View>

            <Text
              className={`text-sm flex-1
                ${selected ? "text-sky-800 font-medium" : "text-slate-700"}`}
            >
              {opt}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
