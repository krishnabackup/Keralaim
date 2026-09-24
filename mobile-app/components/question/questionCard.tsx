import { View, Text } from "react-native";
import { SmartQuestion, AnswerValue } from "../../types/question.types";
import YesNoInput from "./YesNoInput";
import SelectInput from "./selectInput";
import NumberInput from "./NumberInput";
import TextInputField from "./TextInputField";

const TYPE_BADGE: Record<string, { label: string; className: string }> = {
  yesno:  { label: "Yes / No", className: "bg-sky-100 text-sky-800" },
  select: { label: "Select",   className: "bg-green-100 text-green-800" },
  number: { label: "Number",   className: "bg-amber-100 text-amber-800" },
  text:   { label: "Text",     className: "bg-purple-100 text-purple-800" },
};

interface Props {
  question: SmartQuestion;
  index: number;
  answer: AnswerValue;
  isActive: boolean;
  isAnswered: boolean;
  onAnswer: (id: number, value: AnswerValue) => void;
}

export default function QuestionCard({
  question,
  index,
  answer,
  isActive,
  isAnswered,
  onAnswer,
}: Props) {
  const badge = TYPE_BADGE[question.type];

  return (
    <View
      className={`bg-white rounded-2xl p-4 mb-3 border
        ${isActive ? "border-sky-400" : "border-slate-100"}
        ${isAnswered ? "opacity-80" : "opacity-100"}`}
    >
      {/* Top row: index + type badge */}
      <View className="flex-row items-center gap-2 mb-3">
        <View
          className={`w-6 h-6 rounded-full items-center justify-center
            ${isAnswered ? "bg-sky-400" : "bg-sky-100"}`}
        >
          <Text
            className={`text-xs font-semibold
              ${isAnswered ? "text-white" : "text-sky-700"}`}
          >
            {isAnswered ? "✓" : index + 1}
          </Text>
        </View>

        <View className={`px-2 py-0.5 rounded-full ${badge.className}`}>
          <Text className={`text-xs font-semibold uppercase tracking-wide ${badge.className}`}>
            {badge.label}
          </Text>
        </View>
      </View>

      {/* Question text */}
      <Text className="text-sm font-semibold text-slate-800 mb-3 leading-5">
        {question.text}
      </Text>

      {/* Input based on type */}
      {question.type === "yesno" && (
        <YesNoInput
          value={answer as string | null}
          onChange={(val) => onAnswer(question.id, val)}
        />
      )}

      {question.type === "select" && (
        <SelectInput
          options={question.options ?? []}
          value={answer as string | null}
          onChange={(val) => onAnswer(question.id, val)}
        />
      )}

      {question.type === "number" && (
        <NumberInput
          value={answer as string | null}
          placeholder={question.placeholder}
          suffix={question.suffix}
          onChange={(val) => onAnswer(question.id, val)}
        />
      )}

      {question.type === "text" && (
        <TextInputField
          value={answer as string | null}
          placeholder={question.placeholder}
          onChange={(val) => onAnswer(question.id, val)}
        />
      )}
    </View>
  );
}
