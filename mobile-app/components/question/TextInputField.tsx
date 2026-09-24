import { TextInput } from "react-native";

interface Props {
  value: string | null;
  placeholder?: string;
  onChange: (val: string) => void;
}

export default function TextInputField({ value, placeholder, onChange }: Props) {
  return (
    <TextInput
      className="mt-1 w-full px-3 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-800"
      placeholder={placeholder ?? "Type your answer..."}
      placeholderTextColor="#94a3b8"
      value={value ?? ""}
      onChangeText={onChange}
      multiline
      numberOfLines={2}
    />
  );
}
