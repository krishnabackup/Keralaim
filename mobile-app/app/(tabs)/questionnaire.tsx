import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppBar } from "@/components/AppBar";
import {RadioButton} from "react-native-paper";

type Question = {
  field: string;
  question: string;
  type: "number" | "string" | "select" | "yes/no";
  value?: string[];
};

const sampleQuestions: Question[] = [
  { field: "age", question: "What is your age?", type: "number" },
  {
    field: "education",
    question: "Your education level?",
    type: "select",
    value: ["10th", "12th", "Degree"]
  },
  { field: "income", question: "Your annual income?", type: "number" },
   {
        field: "Nationality",
        question: "Are you an Indian citizen?",
        type: "yes/no"
    },
    {
        field: "Income",
        question: "Is your annual family income up to ₹3 lakhs?",
        type: "yes/no"
    },
];

export default function QuestionnaireScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<any>({});
 
  const currentQuestion = sampleQuestions[currentIndex];

  const progress = ((currentIndex + 1) / sampleQuestions.length) * 100;
  const [currentYesOrNo, setCurrentYesOrNo] = useState<string>("yes");
  const handleAnswer = (value: string) => {
    setAnswers((prev: any) => ({
      ...prev,
      [currentQuestion.field]: value
    }));
  };

  const insets = useSafeAreaInsets();

  return (
    <View style={{paddingBottom : insets.bottom , paddingTop : insets.top}}>
      <AppBar/>
      <View className="w-full h-2 bg-gray-200 rounded-full mb-6">
        <View
          className="h-2 bg-blue-500 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </View>
  <View className="flex px-4">
    <View className="bg-blue-200 p-4 rounded-lg">
      {/* Progress Text */}
      <Text className="text-right text-gray-500 mb-4">
        {currentIndex + 1} / {sampleQuestions.length}
      </Text>

      {/* Question Card */}

        <Text className="text-lg font-semibold mb-4">
          Q ) {currentQuestion.question}
        </Text>

        {currentQuestion.type === "number" ||
 currentQuestion.type === "string" ? (

  <TextInput
    className="border border-gray-300 rounded-xl p-3 bg-white"
    keyboardType={
      currentQuestion.type === "number" ? "numeric" : "default"
    }
    onChangeText={handleAnswer}
    value={answers[currentQuestion.field] || ""}
  />

) : currentQuestion.type === "select" ? (

  <View className="flex-row flex-wrap gap-2">
    {currentQuestion.value?.map((opt) => (
      <TouchableOpacity
        key={opt}
        onPress={() => handleAnswer(opt)}
        className={`px-4 py-2 rounded-full ${
          answers[currentQuestion.field] === opt
            ? "bg-blue-500"
            : "bg-gray-300"
        }`}
      >
        <Text
          className={`${
            answers[currentQuestion.field] === opt
              ? "text-white"
              : "text-black"
          }`}
        >
          {opt}
        </Text>
      </TouchableOpacity>
    ))}
  </View>

) : currentQuestion.type === "yes/no" ? (

  <View className="flex-row items-center gap-4">
    
    <TouchableOpacity
      onPress={() => handleAnswer("yes")}
      className="flex-row items-center"
    >
      <View className="w-5 h-5 border-2 border-gray-500 rounded-full items-center justify-center">
        {answers[currentQuestion.field] === "yes" && (
          <View className="w-2.5 h-2.5 bg-blue-500 rounded-full" />
        )}
      </View>
      <Text className="ml-2">Yes</Text>
    </TouchableOpacity>

    <TouchableOpacity
      onPress={() => handleAnswer("no")}
      className="flex-row items-center"
    >
      <View className="w-5 h-5 border-2 border-gray-500 rounded-full items-center justify-center">
        {answers[currentQuestion.field] === "no" && (
          <View className="w-2.5 h-2.5 bg-blue-500 rounded-full" />
        )}
      </View>
      <Text className="ml-2">No</Text>
    </TouchableOpacity>

  </View>

) : null}
      </View>

      <View className="flex-row justify-between mt-6">

        <TouchableOpacity
          disabled={currentIndex === 0}
          onPress={() => setCurrentIndex((prev) => prev - 1)}
          className={`px-5 py-3 rounded-xl ${
            currentIndex === 0 ? "bg-gray-300" : "bg-gray-500"
          }`}
        >
          <Text className="text-white">Previous</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            if (currentIndex < sampleQuestions.length - 1) {
              setCurrentIndex((prev) => prev + 1);
            } else {
              console.log("Final Answers:", answers);
            }
          }}
          className="bg-blue-500 px-5 py-3 rounded-xl"
        >
          <Text className="text-white">
            {currentIndex === sampleQuestions.length - 1
              ? "Submit"
              : "Next"}
          </Text>
        </TouchableOpacity>
      </View>
      </View>
    </View>
  );
}